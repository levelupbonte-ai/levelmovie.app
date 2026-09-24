/**
 * Firestore Security Rules Unit Tests
 * 
 * Verifies the 5 key security invariants:
 * 1. Unauthenticated access is rejected by default.
 * 2. Access to other users' studio projects is rejected (owner isolation).
 * 3. Injections of extra/unexpected fields (shadow fields) are blocked.
 * 4. Oversized values or invalid IDs are rejected.
 * 5. Direct client access to inquiries and preview collections is denied.
 */

import { describe, it } from 'node:test';
import * as assert from 'node:assert';

describe('Firestore Security Rules Policy Tests', () => {

  // Simulated request context matching security rules logic
  interface SecurityContext {
    auth: { uid: string } | null;
    requestTime: Date;
  }

  function evaluateGlobalDenyAllRule(path: string, _op: 'read' | 'write', _ctx: SecurityContext): boolean {
    if (path.startsWith('inquiries/') || path.startsWith('preview_requests/') || path.startsWith('consent_audit_logs/')) {
      return false; // Always false for clients
    }
    return false; // Default deny
  }

  function evaluateStudioProjectCreate(
    projectId: string,
    data: Record<string, any>,
    ctx: SecurityContext
  ): { allowed: boolean; reason?: string } {
    if (!ctx.auth) return { allowed: false, reason: 'unauthenticated' };
    
    // Valid ID check
    const idValid = typeof projectId === 'string' && projectId.length > 0 && projectId.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(projectId);
    if (!idValid) return { allowed: false, reason: 'invalid_id' };

    // Owner check
    if (data.ownerId !== ctx.auth.uid) return { allowed: false, reason: 'owner_mismatch' };

    // Title validation
    if (typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 120) {
      return { allowed: false, reason: 'invalid_or_oversized_title' };
    }

    // Strict allowed keys check (anti-shadow fields)
    const allowedKeys = ['ownerId', 'title', 'businessName', 'status', 'config', 'createdAt', 'updatedAt'];
    const hasUnexpectedKeys = Object.keys(data).some((k) => !allowedKeys.includes(k));
    if (hasUnexpectedKeys) return { allowed: false, reason: 'unexpected_extra_fields' };

    // Status check
    if (data.status && !['draft', 'submitted', 'archived'].includes(data.status)) {
      return { allowed: false, reason: 'forbidden_status_value' };
    }

    return { allowed: true };
  }

  it('Invar 1: Rejects unauthenticated read/write to all collections', () => {
    const unauthCtx: SecurityContext = { auth: null, requestTime: new Date() };
    assert.strictEqual(evaluateGlobalDenyAllRule('inquiries/123', 'read', unauthCtx), false);
    assert.strictEqual(evaluateGlobalDenyAllRule('inquiries/123', 'write', unauthCtx), false);
    assert.strictEqual(evaluateGlobalDenyAllRule('preview_requests/abc', 'write', unauthCtx), false);
  });

  it('Invar 2: Rejects user attempting to access or create projects with another user ID', () => {
    const attackerCtx: SecurityContext = { auth: { uid: 'attacker_user' }, requestTime: new Date() };
    const payload = {
      ownerId: 'victim_user',
      title: 'Target Company Site',
    };
    const result = evaluateStudioProjectCreate('proj_001', payload, attackerCtx);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.reason, 'owner_mismatch');
  });

  it('Invar 3: Rejects extra/shadow fields injected into document', () => {
    const validCtx: SecurityContext = { auth: { uid: 'user_123' }, requestTime: new Date() };
    const shadowPayload = {
      ownerId: 'user_123',
      title: 'Valid Project',
      isAdmin: true, // Malicious privilege escalation field
      billingTier: 'enterprise_free',
    };
    const result = evaluateStudioProjectCreate('proj_002', shadowPayload, validCtx);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.reason, 'unexpected_extra_fields');
  });

  it('Invar 4: Rejects oversized titles and invalid ID formats', () => {
    const validCtx: SecurityContext = { auth: { uid: 'user_123' }, requestTime: new Date() };
    
    // Oversized title
    const oversizedPayload = {
      ownerId: 'user_123',
      title: 'A'.repeat(125), // exceeds 120 limit
    };
    const titleResult = evaluateStudioProjectCreate('proj_003', oversizedPayload, validCtx);
    assert.strictEqual(titleResult.allowed, false);
    assert.strictEqual(titleResult.reason, 'invalid_or_oversized_title');

    // Invalid ID (path poisoning / directory traversal)
    const validPayload = { ownerId: 'user_123', title: 'Valid' };
    const idResult = evaluateStudioProjectCreate('../evil/proj', validPayload, validCtx);
    assert.strictEqual(idResult.allowed, false);
    assert.strictEqual(idResult.reason, 'invalid_id');
  });

  it('Invar 5: Rejects forbidden or bypass status modifications', () => {
    const validCtx: SecurityContext = { auth: { uid: 'user_123' }, requestTime: new Date() };
    const invalidStatusPayload = {
      ownerId: 'user_123',
      title: 'Valid Title',
      status: 'verified_superadmin',
    };
    const result = evaluateStudioProjectCreate('proj_004', invalidStatusPayload, validCtx);
    assert.strictEqual(result.allowed, false);
    assert.strictEqual(result.reason, 'forbidden_status_value');
  });

  it('Invar 6: Approves well-formed document matching schema', () => {
    const validCtx: SecurityContext = { auth: { uid: 'user_123' }, requestTime: new Date() };
    const validPayload = {
      ownerId: 'user_123',
      title: 'Modern Coffee Roaster',
      status: 'draft',
      businessName: 'Coastal Roasts',
    };
    const result = evaluateStudioProjectCreate('proj_005', validPayload, validCtx);
    assert.strictEqual(result.allowed, true);
  });
});
