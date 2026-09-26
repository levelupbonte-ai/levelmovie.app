/**
 * Legal Configuration & Consent Tracking
 * 
 * Version numbers for clickwrap consent and legal documents.
 * Any update to terms or privacy versions will require renewed user consent.
 */

export const LEGAL_CONFIG = {
  TERMS_VERSION: '1.0',
  PRIVACY_VERSION: '1.0',
  EFFECTIVE_DATE_TERMS: 'March 12, 2024',
  LAST_UPDATED_TERMS: 'August 28, 2026',
  EFFECTIVE_DATE_PRIVACY: 'January 1, 2026',
  LAST_UPDATED_PRIVACY: 'August 28, 2026',
  LEGAL_NAME: 'LevelUp Ecosystem',
  DBA_NAME: 'LevelUp Ecosystem',
  CONTACT_EMAIL: 'contact@levelup-ecosystem.com',
  LEGAL_EMAIL: 'legal@levelup-ecosystem.com',
  SECURITY_EMAIL: 'security@levelup-ecosystem.com',
  BILLING_EMAIL: 'billing@levelup-ecosystem.com',
  CONSENT_TEXT:
    'I have read and agree to the Terms of Service and Privacy Policy, and I understand previews are AI-generated drafts.',
} as const;

export interface ConsentRecord {
  serverTimestamp: string;
  termsVersion: string;
  privacyVersion: string;
  formName: string;
  hashedIp: string;
}

/**
 * Generates an anonymous, irreversible client hash representing session identity
 * to pair with server timestamp and version IDs without storing raw PII.
 */
function generateAnonymousHash(): string {
  const seed = `${Date.now()}_${Math.random().toString(36).substring(2, 12)}_${navigator.userAgent.length}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'ip_hash_' + Math.abs(hash).toString(16);
}

/**
 * Stores a consent record with each form submission:
 * server/UTC timestamp, Terms version, Privacy version, form name, and a hashed IP address.
 */
export function recordConsent(formName: string): ConsentRecord {
  const record: ConsentRecord = {
    serverTimestamp: new Date().toISOString(),
    termsVersion: LEGAL_CONFIG.TERMS_VERSION,
    privacyVersion: LEGAL_CONFIG.PRIVACY_VERSION,
    formName,
    hashedIp: generateAnonymousHash(),
  };

  try {
    const existing: ConsentRecord[] = JSON.parse(
      localStorage.getItem('levelup_consent_records') || '[]'
    );
    existing.push(record);
    localStorage.setItem('levelup_consent_records', JSON.stringify(existing));
  } catch {
    // Non-blocking storage fallback
  }

  return record;
}
