import { describe, it } from 'node:test';
import assert from 'node:assert';
import { setupTestDB, createTestUser } from './setup.js';
import ItemReport from '../server/src/models/ItemReport.js';
import { compareReports, findMatchesForReport } from '../server/src/services/matchingService.js';

describe('Smart Item Matching Engine Suite', () => {
  setupTestDB();

  it('compareReports - should calculate high similarity for matching lost and found reports', () => {
    const lostItem = {
      title: 'Black Sony Wireless Headphones',
      description: 'Over-ear noise cancelling headphones forgotten in library.',
      category: 'Electronics',
      approximateLocation: 'Central Library 2nd Floor',
      dateOccurred: new Date('2026-10-25T10:00:00Z'),
    };

    const foundItem = {
      title: 'Black Sony Over-Ear Headphones',
      description: 'Found headphones near the quiet study cubicles in the library.',
      category: 'Electronics',
      approximateLocation: 'Central Library Study Cubicles',
      dateOccurred: new Date('2026-10-25T14:00:00Z'),
    };

    const result = compareReports(lostItem, foundItem);

    assert.ok(result.score >= 60, `Expected score >= 60, got ${result.score}`);
    assert.strictEqual(result.isPotentialMatch, true);
    assert.ok(result.reasons.length > 0, 'Reasons should be explained');
    assert.ok(
      result.reasons.some((r) => r.includes('category')),
      'Should mention category match'
    );
  });

  it('compareReports - should calculate low score for unrelated items', () => {
    const lostItem = {
      title: 'Gold Ring',
      description: 'Family heirloom ring lost in swimming pool.',
      category: 'Jewellery and Accessories',
      approximateLocation: 'Pool Complex',
      dateOccurred: new Date('2026-10-01T10:00:00Z'),
    };

    const foundItem = {
      title: 'MacBook Pro Charger',
      description: 'White Apple 96W USB-C power adapter.',
      category: 'Electronics',
      approximateLocation: 'Computer Science Lab',
      dateOccurred: new Date('2026-10-28T10:00:00Z'),
    };

    const result = compareReports(lostItem, foundItem);

    assert.ok(result.score < 30, `Expected score < 30, got ${result.score}`);
    assert.strictEqual(result.isPotentialMatch, false);
  });

  it('findMatchesForReport - should find matching found items for a lost report and exclude returned reports', async () => {
    const { user: userA } = await createTestUser();
    const { user: userB } = await createTestUser();

    // Lost report
    const lostDoc = await ItemReport.create({
      title: 'Hydro Flask Water Bottle Blue',
      description: 'Blue insulated water bottle with stickers.',
      category: 'Water Bottles',
      reportType: 'lost',
      approximateLocation: 'Gymnasium',
      dateOccurred: new Date(),
      reporterId: userA._id,
      status: 'active',
    });

    // Found active report (matching)
    const foundDoc = await ItemReport.create({
      title: 'Blue Metal Water Bottle',
      description: 'Insulated bottle found on gym bleachers.',
      category: 'Water Bottles',
      reportType: 'found',
      approximateLocation: 'Gymnasium Bleachers',
      dateOccurred: new Date(),
      reporterId: userB._id,
      status: 'active',
    });

    // Found already-returned report (must be excluded)
    await ItemReport.create({
      title: 'Hydro Flask Water Bottle Blue',
      description: 'Identical bottle already returned to owner.',
      category: 'Water Bottles',
      reportType: 'found',
      approximateLocation: 'Gymnasium',
      dateOccurred: new Date(),
      reporterId: userB._id,
      status: 'returned',
    });

    const matches = await findMatchesForReport(lostDoc._id);

    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].report._id.toString(), foundDoc._id.toString());
    assert.ok(matches[0].matchScore >= 40);
  });
});
