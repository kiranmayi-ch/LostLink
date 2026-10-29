import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../server/src/app.js';
import { setupTestDB, createTestUser } from './setup.js';
import ItemReport from '../server/src/models/ItemReport.js';

describe('Claims & Handover Verification Workflow Suite', () => {
  setupTestDB();

  it('Complete Claim Lifecycle: Submit -> Review -> Approve -> Handover -> Returned', async () => {
    const { token: finderToken, user: finder } = await createTestUser({ name: 'Finder Frank' });
    const { token: claimantToken, user: claimant } = await createTestUser({ name: 'Claimant Clara' });
    const { token: competitorToken } = await createTestUser({ name: 'Competitor Carl' });

    // 1. Finder creates found item report
    const reportRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${finderToken}`)
      .send({
        title: 'Apple AirPods Pro in White Case',
        description: 'Found on table in Library study area 3.',
        category: 'Electronics',
        reportType: 'found',
        approximateLocation: 'Main Library 2nd Floor',
      });

    const reportId = reportRes.body.report._id;

    // 2. Prevent finder from claiming their own found item
    const selfClaimRes = await request(app)
      .post('/api/claims')
      .set('Authorization', `Bearer ${finderToken}`)
      .send({
        reportId,
        claimMessage: 'This belongs to me even though I found it.',
      });
    assert.strictEqual(selfClaimRes.status, 400);

    // 3. Claimant submits valid claim
    const claimRes = await request(app)
      .post('/api/claims')
      .set('Authorization', `Bearer ${claimantToken}`)
      .send({
        reportId,
        claimMessage: 'These are my AirPods Pro that I forgot around 3pm. The case has a small teal silicone loop.',
        privateVerificationDetails: 'The name set in Bluetooth is "Clara AirPods" and serial ends in 41X.',
      });

    assert.strictEqual(claimRes.status, 201);
    assert.strictEqual(claimRes.body.success, true);
    assert.strictEqual(claimRes.body.claim.status, 'pending');

    const claimId = claimRes.body.claim._id;

    // Verify report transitioned to 'under_claim'
    const reportCheck = await ItemReport.findById(reportId);
    assert.strictEqual(reportCheck.status, 'under_claim');

    // 4. Competitor submits a second claim
    const competitorClaimRes = await request(app)
      .post('/api/claims')
      .set('Authorization', `Bearer ${competitorToken}`)
      .send({
        reportId,
        claimMessage: 'I think these might be mine too, lost them yesterday.',
      });
    assert.strictEqual(competitorClaimRes.status, 201);
    const competitorClaimId = competitorClaimRes.body.claim._id;

    // 5. Prevent claimant Clara from submitting a duplicate active claim
    const dupRes = await request(app)
      .post('/api/claims')
      .set('Authorization', `Bearer ${claimantToken}`)
      .send({
        reportId,
        claimMessage: 'Submitting a duplicate claim attempt.',
      });
    assert.strictEqual(dupRes.status, 400);

    // 6. Finder reviews and approves Clara's claim
    const approveRes = await request(app)
      .patch(`/api/claims/${claimId}/status`)
      .set('Authorization', `Bearer ${finderToken}`)
      .send({
        status: 'approved',
        reviewNotes: 'Bluetooth name verified and serial number matches proof of purchase.',
      });

    assert.strictEqual(approveRes.status, 200);
    assert.strictEqual(approveRes.body.claim.status, 'approved');
    assert.strictEqual(approveRes.body.claim.handoverStatus, 'scheduled');

    // 7. Schedule safe handover details
    const handoverSchedRes = await request(app)
      .patch(`/api/claims/${claimId}/handover`)
      .set('Authorization', `Bearer ${finderToken}`)
      .send({
        handoverStatus: 'scheduled',
        location: 'Campus Security Front Desk',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(),
        notes: 'Meet at 1:00 PM with student ID.',
      });

    assert.strictEqual(handoverSchedRes.status, 200);
    assert.strictEqual(handoverSchedRes.body.claim.handoverDetails.location, 'Campus Security Front Desk');

    // 8. Complete handover -> Marks returned & resolves competing claims
    const handoverCompleteRes = await request(app)
      .patch(`/api/claims/${claimId}/handover`)
      .set('Authorization', `Bearer ${finderToken}`)
      .send({
        handoverStatus: 'completed',
      });

    assert.strictEqual(handoverCompleteRes.status, 200);
    assert.strictEqual(handoverCompleteRes.body.claim.handoverStatus, 'completed');
    assert.ok(handoverCompleteRes.body.claim.resolvedAt);

    // Verify report is now 'returned'
    const finalReport = await ItemReport.findById(reportId);
    assert.strictEqual(finalReport.status, 'returned');

    // 9. Verify new claims cannot be submitted on returned items
    const lateClaimRes = await request(app)
      .post('/api/claims')
      .set('Authorization', `Bearer ${competitorToken}`)
      .send({
        reportId,
        claimMessage: 'Attempting to claim already returned item.',
      });
    assert.strictEqual(lateClaimRes.status, 400);
  });
});
