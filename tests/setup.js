import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { before, after, afterEach } from 'node:test';
import jwt from 'jsonwebtoken';
import User from '../server/src/models/User.js';

let mongoServer;
const JWT_SECRET = process.env.JWT_SECRET || 'lostlink_super_secure_jwt_secret_key_campus_2026';

export const setupTestDB = () => {
  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
};

export const createTestUser = async (overrides = {}) => {
  const passwordHash = await User.hashPassword(overrides.password || 'TestPassword123!');
  const user = await User.create({
    name: overrides.name || 'Test User',
    email: overrides.email || `test_${Date.now()}_${Math.random().toString(36).substring(7)}@campus.edu`,
    passwordHash,
    role: overrides.role || 'user',
    phone: overrides.phone || '+1 555-0100',
    institution: overrides.institution || 'Test University',
    accountStatus: overrides.accountStatus || 'active',
  });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
  return { user, token };
};
