import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../server/src/app.js';
import { setupTestDB, createTestUser } from './setup.js';

describe('Authentication & Authorization Suite', () => {
  setupTestDB();

  it('POST /api/auth/register - should successfully register a new student user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@campus.edu',
        password: 'Password123!',
        institution: 'Faculty of Arts',
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'jane.doe@campus.edu');
    assert.strictEqual(res.body.user.role, 'user');
    assert.strictEqual(res.body.user.passwordHash, undefined, 'Password hash must never be returned');
  });

  it('POST /api/auth/register - should reject duplicate email', async () => {
    await createTestUser({ email: 'duplicate@campus.edu' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Person',
        email: 'duplicate@campus.edu',
        password: 'Password123!',
      });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/auth/login - should authenticate valid user with correct password', async () => {
    await createTestUser({ email: 'loginuser@campus.edu', password: 'ValidPass123!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@campus.edu',
        password: 'ValidPass123!',
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.email, 'loginuser@campus.edu');
  });

  it('POST /api/auth/login - should reject invalid password', async () => {
    await createTestUser({ email: 'loginuser@campus.edu', password: 'ValidPass123!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'loginuser@campus.edu',
        password: 'WrongPassword999!',
      });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('GET /api/auth/me - should retrieve current user when authenticated', async () => {
    const { token, user } = await createTestUser();

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.id, user._id.toString());
  });

  it('GET /api/auth/me - should reject unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.strictEqual(res.status, 401);
  });

  it('GET /api/admin/users - should reject student role from admin endpoint', async () => {
    const { token } = await createTestUser({ role: 'user' });

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 403);
  });

  it('GET /api/admin/users - should allow admin role', async () => {
    const { token } = await createTestUser({ role: 'admin' });

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });
});
