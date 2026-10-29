import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database.js';
import User from './models/User.js';
import ItemReport from './models/ItemReport.js';
import Claim from './models/Claim.js';
import Notification from './models/Notification.js';
import AuditLog from './models/AuditLog.js';

dotenv.config();

export const seed = async (exitOnComplete = false) => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Cleaning existing data...');
    await Promise.all([
      User.deleteMany({}),
      ItemReport.deleteMany({}),
      Claim.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    console.log('[Seed] Creating users...');
    const adminPasswordHash = await User.hashPassword(
      process.env.ADMIN_PASSWORD || 'Admin@LostLink2026!'
    );
    const modPasswordHash = await User.hashPassword('Moderator@LostLink2026!');
    const studentPasswordHash = await User.hashPassword('Student@LostLink2026!');

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'System Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@lostlink.edu').toLowerCase(),
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+1 (555) 019-2831',
      institution: process.env.ADMIN_INSTITUTION || 'Central University Campus',
      accountStatus: 'active',
    });

    const moderator = await User.create({
      name: 'Campus Safety Moderator',
      email: 'moderator@lostlink.edu',
      passwordHash: modPasswordHash,
      role: 'moderator',
      phone: '+1 (555) 019-2832',
      institution: 'Campus Safety & Helpdesk Office',
      accountStatus: 'active',
    });

    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@campus.edu',
      passwordHash: studentPasswordHash,
      role: 'user',
      phone: '+1 (555) 012-3456',
      institution: 'Faculty of Science & Computing',
      accountStatus: 'active',
    });

    const priya = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      passwordHash: studentPasswordHash,
      role: 'user',
      phone: '+1 (555) 012-7890',
      institution: 'School of Engineering',
      accountStatus: 'active',
    });

    const david = await User.create({
      name: 'David Chen',
      email: 'david.chen@campus.edu',
      passwordHash: studentPasswordHash,
      role: 'user',
      phone: '+1 (555) 012-9988',
      institution: 'Department of Economics',
      accountStatus: 'active',
    });

    console.log('[Seed] Creating item reports...');
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    // 1. Lost Sony Headphones (Alex)
    const lostHeadphones = await ItemReport.create({
      title: 'Sony WH-1000XM4 Wireless Headphones',
      description: 'Matte black over-ear noise-cancelling headphones left near the quiet study cubicles. Stored in a black zippered travel case.',
      category: 'Electronics',
      reportType: 'lost',
      dateOccurred: twoDaysAgo,
      approximateLocation: 'Central Library, 2nd Floor Study Area',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Has a small scratch near the left pivot arm and custom initials etched inside.',
      status: 'under_claim',
      moderationStatus: 'approved',
      reporterId: alex._id,
    });

    // 2. Found Sony Headphones (Priya) -> MATCH with #1
    const foundHeadphones = await ItemReport.create({
      title: 'Black Sony Over-Ear Noise-Cancelling Headphones',
      description: 'Found black Sony headphones inside a zip case on table 14 near the silent reading cubicles in the evening.',
      category: 'Electronics',
      reportType: 'found',
      dateOccurred: yesterday,
      approximateLocation: 'Central Library, 2nd Floor Table 14',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Verification required: claimant must state what initials are inside or specific scuff location.',
      status: 'under_claim',
      moderationStatus: 'approved',
      reporterId: priya._id,
    });

    // 3. Lost Student ID Card (Alex)
    const lostIdCard = await ItemReport.create({
      title: 'University Student ID Card - Alex Rivera',
      description: 'Student identification card attached to an official university blue lanyard. Misplaced during lunchtime.',
      category: 'ID Cards and Documents',
      reportType: 'lost',
      dateOccurred: yesterday,
      approximateLocation: 'Main Campus Cafeteria, Dining Hall',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'ID number ends in 4821; Faculty of Science.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: alex._id,
    });

    // 4. Found Student ID Card (David) -> MATCH with #3
    const foundIdCard = await ItemReport.create({
      title: 'Student ID Card with Blue Campus Lanyard',
      description: 'Found a student card left on a food tray return counter near the cafeteria exit. Safely kept with security desk.',
      category: 'ID Cards and Documents',
      reportType: 'found',
      dateOccurred: yesterday,
      approximateLocation: 'Campus Cafeteria Tray Return Station',
      imageUrl: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Student name and ID number will be verified at the safety desk before release.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: david._id,
    });

    // 5. Lost Water Bottle (Priya)
    const lostBottle = await ItemReport.create({
      title: 'Hydro Flask 32oz Insulated Water Bottle',
      description: 'Pacific blue wide mouth metal flask with straw lid. Left behind after evening workout.',
      category: 'Water Bottles',
      reportType: 'lost',
      dateOccurred: threeDaysAgo,
      approximateLocation: 'Gymnasium & Fitness Centre, Court B',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Has a small National Park sticker on the side.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: priya._id,
    });

    // 6. Found Blue Flask (David) -> MATCH with #5
    const foundBottle = await ItemReport.create({
      title: 'Blue Metal Thermos Flask with Stickers',
      description: 'Blue insulated water bottle found on the spectator bench in the sports complex.',
      category: 'Water Bottles',
      reportType: 'found',
      dateOccurred: twoDaysAgo,
      approximateLocation: 'Sports Complex Bleachers',
      imageUrl: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Contains stickers; claimant must describe sticker artwork.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: david._id,
    });

    // 7. Lost Graphing Calculator (David)
    await ItemReport.create({
      title: 'TI-84 Plus CE Graphing Calculator',
      description: 'Black Texas Instruments graphing calculator with a slide-on cover. Forgotten after Calculus class.',
      category: 'Books and Stationery',
      reportType: 'lost',
      dateOccurred: threeDaysAgo,
      approximateLocation: 'Engineering Hall, Lecture Room 302',
      imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Battery compartment has a yellow sticker inside.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: david._id,
    });

    // 8. Found Keys (Alex)
    await ItemReport.create({
      title: 'Set of 3 Keys with Brass Ring and Red Tag',
      description: 'Two house keys and one small locker key with a red plastic gym tag found along the path.',
      category: 'Keys',
      reportType: 'found',
      dateOccurred: yesterday,
      approximateLocation: 'Student Union North Walkway',
      imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Red tag has a handwritten locker number; claimant must specify.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: alex._id,
    });

    // 9. Lost Herschel Backpack (Priya)
    await ItemReport.create({
      title: 'Herschel Classic Grey Backpack',
      description: 'Grey canvas backpack containing class notebooks and an umbrella. Believed to have been left in lab.',
      category: 'Bags and Backpacks',
      reportType: 'lost',
      dateOccurred: fiveDaysAgo,
      approximateLocation: 'Turing Computer Science Building, Lab 4',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Keychain with a small wooden turtle attached to the front zipper.',
      status: 'active',
      moderationStatus: 'approved',
      reporterId: priya._id,
    });

    // 10. Returned Item (Alex -> David)
    const returnedWatch = await ItemReport.create({
      title: 'Apple Watch SE 40mm Space Grey',
      description: 'Found on the podium in the main auditorium following the guest lecture.',
      category: 'Electronics',
      reportType: 'found',
      dateOccurred: fiveDaysAgo,
      approximateLocation: 'Main Campus Auditorium, Stage Area',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      identifyingDetails: 'Passcode locked; owner unlocked it in person during verified handover.',
      status: 'returned',
      moderationStatus: 'approved',
      reporterId: alex._id,
    });

    console.log('[Seed] Creating claims...');
    // Claim on found headphones by Alex
    await Claim.create({
      reportId: foundHeadphones._id,
      claimantId: alex._id,
      finderId: priya._id,
      claimMessage: 'Hello Priya, I left my black Sony XM4 headphones on table 14 while rushing to my afternoon physics exam. They are in a black case.',
      privateVerificationDetails: 'The initials "AR" are etched in small silver paint inside the left band near the serial number.',
      status: 'approved',
      reviewNotes: 'Verified! Initials match exactly. Let us meet at the library helpdesk.',
      handoverStatus: 'scheduled',
      handoverDetails: {
        location: 'Central Library Main Circulation Desk',
        scheduledDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        notes: 'Meet at 2:00 PM with student card.',
      },
    });

    // Completed claim for returned Apple Watch
    await Claim.create({
      reportId: returnedWatch._id,
      claimantId: david._id,
      finderId: alex._id,
      claimMessage: 'This is my Apple Watch that slipped off my wrist during the guest lecture.',
      privateVerificationDetails: 'Space Grey aluminium with black sport band. Can unlock using PIN code.',
      status: 'approved',
      reviewNotes: 'Owner successfully entered PIN code and verified serial number in Apple ID.',
      handoverStatus: 'completed',
      handoverDetails: {
        location: 'Campus Security Office',
        scheduledDate: fiveDaysAgo,
        notes: 'Handover verified and signed in logbook.',
      },
      resolvedAt: new Date(fiveDaysAgo.getTime() + 4 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating notifications...');
    await Notification.create({
      recipientId: alex._id,
      type: 'claim_status_updated',
      title: 'Claim Approved!',
      message: 'Priya approved your claim for the Sony Headphones. Handover scheduled at Library Desk.',
      relatedReportId: foundHeadphones._id,
      isRead: false,
    });

    await Notification.create({
      recipientId: alex._id,
      type: 'match_found',
      title: 'Potential Match Discovered',
      message: 'We discovered an 88% potential match for your lost ID Card report: "Student ID Card with Blue Campus Lanyard".',
      relatedReportId: foundIdCard._id,
      isRead: false,
    });

    console.log('[Seed] Creating audit logs...');
    await AuditLog.create({
      actorId: admin._id,
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'System',
      resourceId: 'PLATFORM_BOOTSTRAP',
      metadata: { seedDate: new Date(), version: '1.0.0' },
    });

    console.log('\n======================================================');
    console.log('       LOSTLINK DATABASE SEED COMPLETED SUCCESSFULLY  ');
    console.log('======================================================');
    console.log('Administrator Credentials:');
    console.log(`  Email:    ${admin.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@LostLink2026!'}`);
    console.log('\nModerator Credentials:');
    console.log(`  Email:    moderator@lostlink.edu`);
    console.log(`  Password: Moderator@LostLink2026!`);
    console.log('\nStudent Test Accounts:');
    console.log(`  Email:    alex.rivera@campus.edu  / Student@LostLink2026!`);
    console.log(`  Email:    priya.sharma@campus.edu / Student@LostLink2026!`);
    console.log(`  Email:    david.chen@campus.edu   / Student@LostLink2026!`);
    console.log('======================================================\n');

    if (exitOnComplete) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (exitOnComplete) process.exit(1);
    throw error;
  }
};

// If run directly from CLI (e.g. npm run seed)
if (process.argv[1]?.endsWith('seed.js')) {
  seed(true);
}

