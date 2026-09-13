const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const WasteReport = require('./models/WasteReport');
const Bin = require('./models/Bin');
const CleaningMission = require('./models/CleaningMission');
const MissionSubmission = require('./models/MissionSubmission');
const EcoPointTransaction = require('./models/EcoPointTransaction');
const Notification = require('./models/Notification');
const Badge = require('./models/Badge');
const { BADGE_DEFINITIONS } = require('./services/gamificationService');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[SEED] Clearing existing database collections...');

    await User.deleteMany({});
    await WasteReport.deleteMany({});
    await Bin.deleteMany({});
    await CleaningMission.deleteMany({});
    await MissionSubmission.deleteMany({});
    await EcoPointTransaction.deleteMany({});
    await Notification.deleteMany({});
    await Badge.deleteMany({});

    console.log('[SEED] Seeding Badges...');
    await Badge.insertMany(BADGE_DEFINITIONS);

    console.log('[SEED] Creating Users & Admin with Standard Names...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin123!', salt);
    const studentHash = await bcrypt.hash('Student123!', salt);

    // Admin: Sahil
    const admin = await User.create({
      name: 'Sahil (Campus Admin)',
      email: 'sahil@ecobin.campus.edu',
      phone: '+91 98220 11223',
      department: 'Environmental Management Pune',
      passwordHash: adminHash,
      role: 'admin',
      ecoPoints: 3450,
      level: 'Eco Champion',
      badges: ['first_report', 'first_cleanup', 'recycling_hero', 'eco_warrior', 'top_contributor'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    // Student 1: Ayush
    const student1 = await User.create({
      name: 'Ayush',
      email: 'ayush@ecobin.campus.edu',
      phone: '+91 98765 43210',
      department: 'Computer Science',
      passwordHash: studentHash,
      role: 'user',
      ecoPoints: 1250,
      level: 'Eco Warrior',
      badges: ['first_report', 'first_cleanup', 'recycling_hero', 'eco_warrior'],
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    });

    // Student 2: Hrishikesh
    const student2 = await User.create({
      name: 'Hrishikesh',
      email: 'hrishikesh@ecobin.campus.edu',
      phone: '+91 98112 33445',
      department: 'Mechanical Engineering',
      passwordHash: studentHash,
      role: 'user',
      ecoPoints: 850,
      level: 'Eco Helper',
      badges: ['first_report', 'first_cleanup'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    // Student 3: Pooja
    const student3 = await User.create({
      name: 'Pooja',
      email: 'pooja@ecobin.campus.edu',
      phone: '+91 97654 32109',
      department: 'Biotechnology',
      passwordHash: studentHash,
      role: 'user',
      ecoPoints: 2600,
      level: 'Eco Champion',
      badges: ['first_report', 'first_cleanup', 'recycling_hero', 'eco_warrior', 'top_contributor', 'missions_5'],
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    });

    console.log('[SEED] Creating Pune Campus Bins...');
    await Bin.create([
      {
        binId: 'BIN-PUNE-101',
        location: 'COEP Main Quad - Shivajinagar, Pune',
        latitude: 18.5293,
        longitude: 73.8565,
        acceptedWasteTypes: ['Paper', 'Plastic'],
        fillLevel: 42,
        status: 'Available'
      },
      {
        binId: 'BIN-PUNE-102',
        location: 'Fergusson College Road (FC Gate 1), Pune',
        latitude: 18.5236,
        longitude: 73.8415,
        acceptedWasteTypes: ['Plastic', 'E-waste', 'Metal'],
        fillLevel: 78,
        status: 'Nearly Full'
      },
      {
        binId: 'BIN-PUNE-103',
        location: 'SPPU Campus Canteen Courtyard (Pune University)',
        latitude: 18.5529,
        longitude: 73.8250,
        acceptedWasteTypes: ['Organic/Food', 'Plastic', 'Paper'],
        fillLevel: 94,
        status: 'Full'
      },
      {
        binId: 'BIN-PUNE-104',
        location: 'Kothrud Ideal Colony Circle, Pune',
        latitude: 18.5074,
        longitude: 73.8077,
        acceptedWasteTypes: ['Glass', 'Paper', 'Plastic'],
        fillLevel: 25,
        status: 'Available'
      },
      {
        binId: 'BIN-PUNE-105',
        location: 'Viman Nagar Symbiosis Plaza, Pune',
        latitude: 18.5679,
        longitude: 73.9143,
        acceptedWasteTypes: ['Plastic', 'Metal', 'Organic/Food'],
        fillLevel: 68,
        status: 'Nearly Full'
      },
      {
        binId: 'BIN-PUNE-106',
        location: 'Hinjewadi Phase 1 Tech Gate, Pune',
        latitude: 18.5912,
        longitude: 73.7389,
        acceptedWasteTypes: ['Plastic', 'Paper'],
        fillLevel: 15,
        status: 'Available'
      }
    ]);

    console.log('[SEED] Creating Waste Reports for Pune locations...');
    await WasteReport.create([
      {
        reportId: 'ECO-2026-00101',
        userId: student1._id, // Ayush
        wasteType: 'Plastic',
        location: 'Behind COEP Library Quad, Shivajinagar',
        latitude: 18.5295,
        longitude: 73.8568,
        description: 'Multiple PET bottles discarded near water fountain.',
        quantity: 'Medium',
        imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80',
        aiDetectedType: 'Plastic',
        aiConfidence: 94,
        status: 'Resolved',
        assignedTo: 'Pune Sanitation Squad 2',
        adminNotes: 'Cleaned and recycled by squad.'
      },
      {
        reportId: 'ECO-2026-00102',
        userId: student2._id, // Hrishikesh
        wasteType: 'Organic/Food',
        location: 'FC Road Canteen Seating Area, Pune',
        latitude: 18.5240,
        longitude: 73.8420,
        description: 'Leftover food wrappers and tea cups near bench.',
        quantity: 'Small',
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        aiDetectedType: 'Organic/Food',
        aiConfidence: 91,
        status: 'Pending'
      },
      {
        reportId: 'ECO-2026-00103',
        userId: student3._id, // Pooja
        wasteType: 'E-waste',
        location: 'SPPU Computer Science Department Annex, Pune',
        latitude: 18.5532,
        longitude: 73.8255,
        description: 'Discarded motherboards, old cables and monitor casings.',
        quantity: 'Bulk',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
        aiDetectedType: 'E-waste',
        aiConfidence: 96,
        status: 'Assigned',
        assignedTo: 'Pune E-Waste Recyclers'
      }
    ]);

    console.log('[SEED] Creating Cleaning Missions in Pune...');
    const mission1 = await CleaningMission.create({
      title: 'Clean COEP Botanical Garden, Pune',
      description: 'Join Pune student volunteers to clear fallen leaves and plastic litter along riverbank footpaths.',
      location: 'COEP Botanical Garden, Shivajinagar, Pune',
      latitude: 18.5293,
      longitude: 73.8565,
      rewardPoints: 100,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      difficulty: 'Easy',
      maxParticipants: 30,
      participants: [student1._id, student3._id],
      status: 'Active'
    });

    const mission2 = await CleaningMission.create({
      title: 'Fergusson College Road Plastic Cleanup',
      description: 'Help clean up single-use plastics and paper flyers around FC Road campus gates.',
      location: 'FC Road Gate 1, Pune',
      latitude: 18.5236,
      longitude: 73.8415,
      rewardPoints: 50,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      difficulty: 'Easy',
      maxParticipants: 15,
      participants: [student2._id],
      status: 'Active'
    });

    const mission3 = await CleaningMission.create({
      title: 'Pune University (SPPU) Circle Clean Drive',
      description: 'Targeted drive to scour university entrance lawns and parking zones for recyclable waste.',
      location: 'SPPU Circle, Ganeshkhind, Pune',
      latitude: 18.5529,
      longitude: 73.8250,
      rewardPoints: 75,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      difficulty: 'Medium',
      maxParticipants: 40,
      participants: [student1._id, student2._id, student3._id],
      status: 'Active'
    });

    console.log('[SEED] Creating Mission Submissions...');
    await MissionSubmission.create([
      {
        missionId: mission1._id,
        userId: student1._id, // Ayush
        beforeImageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
        afterImageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&auto=format&fit=crop&q=80',
        description: 'Cleared 3 bags of discarded plastic cups and cleaned garden pathways.',
        location: 'COEP Garden - Section A',
        status: 'Approved',
        reviewedBy: admin._id,
        reviewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        adminFeedback: 'Great job Ayush! Very thorough cleaning.'
      }
    ]);

    console.log('[SEED] Creating EcoPoint Transactions & Notifications...');
    await EcoPointTransaction.create([
      { userId: student1._id, points: 100, reason: 'Welcome Eco Starter Bonus' },
      { userId: student1._id, points: 25, reason: 'Submitted waste report ECO-2026-00101' },
      { userId: student1._id, points: 100, reason: 'Approved cleaning mission: Clean COEP Botanical Garden, Pune' },
      { userId: student3._id, points: 2500, reason: 'Pune Campus Cleanliness Captain Award' }
    ]);

    await Notification.create([
      {
        userId: student1._id,
        title: 'Welcome to EcoBin Pune! 🌱',
        message: 'Start scanning waste or joining Pune campus cleanups to earn Eco Points.',
        type: 'system',
        read: true
      },
      {
        userId: student1._id,
        title: 'Mission Approved! 🎉 (+100 Points)',
        message: 'Your proof for "Clean COEP Botanical Garden, Pune" was approved by Sahil (Admin).',
        type: 'mission_approved',
        read: false
      }
    ]);

    console.log('✅ [SEED] Database seeded successfully with Pune City Data & Standard Names!');
    console.log('--------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Admin Account (Sahil)      : sahil@ecobin.campus.edu / Admin123!');
    console.log('Student Account 1 (Ayush)   : ayush@ecobin.campus.edu / Student123!');
    console.log('Student Account 2 (Hrishikesh): hrishikesh@ecobin.campus.edu / Student123!');
    console.log('Student Account 3 (Pooja)   : pooja@ecobin.campus.edu / Student123!');
    console.log('--------------------------------------------------');
    
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ [SEED] Error seeding database:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
