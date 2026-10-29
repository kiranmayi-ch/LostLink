import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../server/src/app.js';
import { setupTestDB, createTestUser } from './setup.js';
import ItemReport from '../server/src/models/ItemReport.js';

describe('Item Reports CRUD Suite', () => {
  setupTestDB();

  it('POST /api/reports - should create a lost item report', async () => {
    const { token, user } = await createTestUser();

    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dell XPS 15 Laptop',
        description: 'Silver aluminum laptop with a small sticker on top right corner.',
        category: 'Electronics',
        reportType: 'lost',
        dateOccurred: new Date().toISOString(),
        approximateLocation: 'Library 3rd floor',
        identifyingDetails: 'Serial ending in 9812, Intel Core i7 badge.',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.report.title, 'Dell XPS 15 Laptop');
    assert.strictEqual(res.body.report.reporterId, user._id.toString());
    assert.strictEqual(res.body.report.status, 'active');
  });

  it('POST /api/reports - should reject report with missing required fields', async () => {
    const { token } = await createTestUser();

    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'AB', // too short
        category: 'InvalidCategory',
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
  });

  it('GET /api/reports - should list reports with filters and pagination', async () => {
    const { token } = await createTestUser();

    // Create 2 reports
    await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Blue Water Bottle',
        description: 'Metal hydro bottle left on bench near gym.',
        category: 'Water Bottles',
        reportType: 'lost',
        approximateLocation: 'Campus Gym',
      });

    await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sony Earbuds',
        description: 'White wireless earbuds in charging case.',
        category: 'Electronics',
        reportType: 'found',
        approximateLocation: 'Library',
      });

    const res = await request(app)
      .get('/api/reports')
      .query({ category: 'Water Bottles' });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.total, 1);
    assert.strictEqual(res.body.reports[0].title, 'Blue Water Bottle');
    assert.strictEqual(
      res.body.reports[0].identifyingDetails,
      undefined,
      'Confidential details must be excluded from public list'
    );
  });

  it('GET /api/reports/:id - should get report details and protect private contact details for strangers', async () => {
    const { token: reporterToken } = await createTestUser({ name: 'Reporter Alice' });
    const { token: strangerToken } = await createTestUser({ name: 'Stranger Bob' });

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${reporterToken}`)
      .send({
        title: 'Black Leather Wallet',
        description: 'Bifold wallet with cards inside.',
        category: 'Wallets and Purses',
        reportType: 'found',
        approximateLocation: 'Student Union Lounge',
        identifyingDetails: 'Drivers license initials JS.',
      });

    const reportId = createRes.body.report._id;

    // Fetch as stranger
    const strangerRes = await request(app)
      .get(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${strangerToken}`);

    assert.strictEqual(strangerRes.status, 200);
    assert.strictEqual(strangerRes.body.report.title, 'Black Leather Wallet');
    assert.strictEqual(strangerRes.body.isOwner, false);
    assert.strictEqual(strangerRes.body.report.reporterId.email, undefined);
    assert.strictEqual(strangerRes.body.report.identifyingDetails, '');

    // Fetch as reporter (owner)
    const ownerRes = await request(app)
      .get(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${reporterToken}`);

    assert.strictEqual(ownerRes.status, 200);
    assert.strictEqual(ownerRes.body.isOwner, true);
    assert.strictEqual(ownerRes.body.report.identifyingDetails, 'Drivers license initials JS.');
  });

  it('PUT /api/reports/:id - should allow reporter to edit their report', async () => {
    const { token } = await createTestUser();

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Keys with Keychain',
        description: 'Set of house keys left behind.',
        category: 'Keys',
        reportType: 'lost',
        approximateLocation: 'Bus Stop A',
      });

    const reportId = createRes.body.report._id;

    const editRes = await request(app)
      .put(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Keys with Red Keychain',
        approximateLocation: 'Bus Stop A (Eastbound)',
      });

    assert.strictEqual(editRes.status, 200);
    assert.strictEqual(editRes.body.report.title, 'Keys with Red Keychain');
    assert.strictEqual(editRes.body.report.approximateLocation, 'Bus Stop A (Eastbound)');
  });

  it('PUT /api/reports/:id - should reject edit by unauthorized user', async () => {
    const { token: user1Token } = await createTestUser();
    const { token: user2Token } = await createTestUser();

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Calculator',
        description: 'Scientific calculator left in hall.',
        category: 'Books and Stationery',
        reportType: 'lost',
        approximateLocation: 'Hall 101',
      });

    const reportId = createRes.body.report._id;

    const editRes = await request(app)
      .put(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        title: 'Hacked Title',
      });

    assert.strictEqual(editRes.status, 403);
  });

  it('DELETE /api/reports/:id - should safely archive an eligible report', async () => {
    const { token } = await createTestUser();

    const createRes = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Umbrella',
        description: 'Black folding umbrella in cafeteria.',
        category: 'Other',
        reportType: 'found',
        approximateLocation: 'Cafeteria',
      });

    const reportId = createRes.body.report._id;

    const deleteRes = await request(app)
      .delete(`/api/reports/${reportId}`)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(deleteRes.status, 200);

    const doc = await ItemReport.findById(reportId);
    assert.strictEqual(doc.status, 'archived');
    assert.ok(doc.archivedAt);
  });
});
