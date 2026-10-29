import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../server/src/app.js';
import { setupTestDB, createTestUser } from './setup.js';
import AuditLog from '../server/src/models/AuditLog.js';

describe('Administrator Moderation & Audit Trail Suite', () => {
  setupTestDB();

  it('Admin can suspend and reactivate a user account with audit logging', async () => {
    const { token: adminToken } = await createTestUser({ role: 'admin', email: 'leadadmin@campus.edu' });
    const { user: student, token: studentToken } = await createTestUser({
      name: 'Misbehaving Student',
      email: 'badactor@campus.edu',
    });

    // 1. Suspend student
    const suspendRes = await request(app)
      .patch(`/api/admin/users/${student._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'suspended',
        reason: 'Violation of lost-and-found community safety guidelines.',
      });

    assert.strictEqual(suspendRes.status, 200);
    assert.strictEqual(suspendRes.body.user.accountStatus, 'suspended');

    // 2. Student attempts action while suspended -> 403 Forbidden
    const blockedRes = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${studentToken}`);

    assert.strictEqual(blockedRes.status, 403);
    assert.ok(blockedRes.body.message.includes('suspended'));

    // 3. Reactivate student
    const reactivateRes = await request(app)
      .patch(`/api/admin/users/${student._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'active',
        reason: 'Reinstated after verification meeting.',
      });

    assert.strictEqual(reactivateRes.status, 200);
    assert.strictEqual(reactivateRes.body.user.accountStatus, 'active');

    // 4. Verify audit logs
    const auditLogs = await AuditLog.find({ resourceType: 'User' });
    assert.strictEqual(auditLogs.length, 2);
    assert.strictEqual(auditLogs[0].action, 'USER_SUSPENDED');
    assert.strictEqual(auditLogs[1].action, 'USER_REACTIVATED');
  });

  it('Admin can moderate a report by flagging or hiding it', async () => {
    const { token: adminToken } = await createTestUser({ role: 'admin' });
    const { token: userToken } = await createTestUser();

    const reportRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Suspicious Report Containing Spam',
        description: 'Spam text or inappropriate item details.',
        category: 'Other',
        reportType: 'lost',
        approximateLocation: 'Campus Square',
      });

    const reportId = reportRes.body.report._id;

    const modRes = await request(app)
      .patch(`/api/admin/reports/${reportId}/moderation`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        moderationStatus: 'hidden',
        notes: 'Inappropriate content hidden from public directory.',
      });

    assert.strictEqual(modRes.status, 200);
    assert.strictEqual(modRes.body.report.moderationStatus, 'hidden');

    // Verify it is excluded from public search
    const publicSearchRes = await request(app).get('/api/reports');
    const ids = publicSearchRes.body.reports.map((r) => r._id);
    assert.strictEqual(ids.includes(reportId), false);
  });
});
