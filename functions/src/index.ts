import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Helper: Hash sensitive identifiers for privacy-preserving rate limiting & audit logs
function hashIdentifier(val: string): string {
  return crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex').substring(0, 32);
}

// Helper: Structured security audit logger
function logSecurityEvent(functionName: string, reason: string, context: { hashedIp: string; emailHash?: string; uid?: string }) {
  console.warn(
    JSON.stringify({
      severity: 'WARNING',
      timestamp: new Date().toISOString(),
      type: 'SECURITY_AUDIT_LOG',
      functionName,
      reason,
      client: {
        hashedIp: context.hashedIp,
        emailHash: context.emailHash || null,
        uid: context.uid || null,
      },
    })
  );
}

// In-Memory sliding-window rate limiter (fallback & fast path)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * 1. submitInquiry Callable Function
 * Handles Contact Form submissions with App Check, honeypot, rate limiting, and strict schema validation
 */
export const submitInquiry = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    maxInstances: 10,
  },
  async (request) => {
    const rawIp = request.rawRequest?.ip || '0.0.0.0';
    const hashedIp = hashIdentifier(rawIp);
    const data = request.data || {};

    // 1. Honeypot check
    if (data.websiteUrl || data.honeypot) {
      logSecurityEvent('submitInquiry', 'Honeypot triggered (bot submission)', { hashedIp });
      return { success: true }; // Silent fake-success to misdirect bots
    }

    // 2. Rate limiting per hashed IP (max 5 requests per 10 minutes)
    if (!checkRateLimit(`ip_${hashedIp}`, 5, 10 * 60 * 1000)) {
      logSecurityEvent('submitInquiry', 'Rate limit exceeded for IP', { hashedIp });
      throw new HttpsError('resource-exhausted', 'Too many requests. Please try again later.');
    }

    // 3. Schema & Input validation
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const businessName = typeof data.businessName === 'string' ? data.businessName.trim() : '';
    const serviceType = typeof data.serviceType === 'string' ? data.serviceType.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    const consent = data.consent === true;

    if (!consent) {
      throw new HttpsError('failed-precondition', 'Consent is required.');
    }

    if (!name || name.length > 80 || !/^[a-zA-Z0-9\s\-'.]+$/.test(name)) {
      throw new HttpsError('invalid-argument', 'Please provide a valid name.');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || email.length > 120 || !emailRegex.test(email)) {
      throw new HttpsError('invalid-argument', 'Please provide a valid email address.');
    }

    const emailHash = hashIdentifier(email);

    // Rate limiting per email (max 3 requests per hour)
    if (!checkRateLimit(`email_${emailHash}`, 3, 60 * 60 * 1000)) {
      logSecurityEvent('submitInquiry', 'Rate limit exceeded for email', { hashedIp, emailHash });
      throw new HttpsError('resource-exhausted', 'Too many inquiries sent for this email address.');
    }

    if (businessName.length > 120 || message.length > 2000) {
      throw new HttpsError('invalid-argument', 'Input size limits exceeded.');
    }

    // 4. Secure write via Admin SDK (client has zero direct write permissions)
    const inquiryRef = db.collection('inquiries').doc();
    await inquiryRef.set({
      id: inquiryRef.id,
      name,
      email,
      businessName,
      serviceType: serviceType.substring(0, 80),
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      hashedClientIp: hashedIp,
      status: 'new',
    });

    return { success: true, id: inquiryRef.id };
  }
);

/**
 * 2. requestCustomPreview Callable Function
 * Handles custom preview requests securely with App Check, rate limiting, and honeypot
 */
export const requestCustomPreview = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    maxInstances: 10,
  },
  async (request) => {
    const rawIp = request.rawRequest?.ip || '0.0.0.0';
    const hashedIp = hashIdentifier(rawIp);
    const data = request.data || {};

    if (data.honeypot) {
      logSecurityEvent('requestCustomPreview', 'Honeypot triggered', { hashedIp });
      return { success: true, previewId: 'prv_custom' };
    }

    if (!checkRateLimit(`custom_prv_${hashedIp}`, 3, 15 * 60 * 1000)) {
      logSecurityEvent('requestCustomPreview', 'Rate limit exceeded', { hashedIp });
      throw new HttpsError('resource-exhausted', 'Too many preview requests. Please wait.');
    }

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const businessName = typeof data.businessName === 'string' ? data.businessName.trim() : '';
    const businessType = typeof data.businessType === 'string' ? data.businessType.trim() : '';
    const city = typeof data.city === 'string' ? data.city.trim() : '';
    const consent = data.consent === true;

    if (!consent) {
      throw new HttpsError('failed-precondition', 'Affirmative consent required.');
    }

    if (!name || name.length > 80 || !email || email.length > 120 || !businessName || businessName.length > 100) {
      throw new HttpsError('invalid-argument', 'Invalid form fields.');
    }

    const emailHash = hashIdentifier(email);

    const previewId = 'prv_' + crypto.randomBytes(6).toString('hex');
    const docRef = db.collection('preview_requests').doc(previewId);

    await docRef.set({
      previewId,
      name,
      email,
      businessName,
      businessType: businessType.substring(0, 60),
      city: city.substring(0, 80),
      status: 'pending_review',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      hashedClientIp: hashedIp,
      emailHash,
    });

    return { success: true, previewId };
  }
);
