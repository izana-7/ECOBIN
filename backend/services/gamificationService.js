const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const MissionSubmission = require('../models/MissionSubmission');
const EcoPointTransaction = require('../models/EcoPointTransaction');
const Notification = require('../models/Notification');

const BADGE_DEFINITIONS = [
  { key: 'first_report', name: 'First Report', description: 'Submitted your first campus waste report', icon: '🌱', requirement: '1 Waste Report' },
  { key: 'first_cleanup', name: 'First Cleanup', description: 'Completed your first verified cleaning mission', icon: '🧹', requirement: '1 Cleanup Approved' },
  { key: 'recycling_hero', name: 'Recycling Hero', description: 'Submitted 5 waste reports for recycling', icon: '♻️', requirement: '5 Waste Reports' },
  { key: 'eco_warrior', name: 'Eco Warrior', description: 'Earned over 1,000 Eco Points for campus cleanliness', icon: '🌳', requirement: '1,000+ Eco Points' },
  { key: 'top_contributor', name: 'Top Contributor', description: 'Reached Eco Champion level with 2,500+ Eco Points', icon: '🏆', requirement: '2,500+ Eco Points' },
  { key: 'missions_5', name: '5 Missions Completed', description: 'Completed 5 voluntary campus cleaning missions', icon: '🔥', requirement: '5 Missions' },
  { key: 'reports_10', name: '10 Reports Submitted', description: 'Reported 10 waste hotspots across campus', icon: '💚', requirement: '10 Waste Reports' }
];

const calculateLevel = (points) => {
  if (points >= 2500) return 'Eco Champion';
  if (points >= 1000) return 'Eco Warrior';
  if (points >= 500) return 'Eco Helper';
  return 'Eco Starter';
};

const awardPoints = async (userId, points, reason, referenceId = '') => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.ecoPoints += points;
  user.level = calculateLevel(user.ecoPoints);

  // Record transaction ledger entry
  await EcoPointTransaction.create({
    userId,
    points,
    reason,
    referenceId
  });

  // Create notification
  await Notification.create({
    userId,
    title: `+${points} Eco Points Earned! ⭐`,
    message: `You earned ${points} points for: ${reason}. Total points: ${user.ecoPoints}`,
    type: 'points_awarded'
  });

  // Check badges unlock
  await checkAndAwardBadges(user);

  await user.save();
  return user;
};

const checkAndAwardBadges = async (user) => {
  const reportsCount = await WasteReport.countDocuments({ userId: user._id });
  const approvedMissionsCount = await MissionSubmission.countDocuments({ userId: user._id, status: 'Approved' });

  const existingBadges = new Set(user.badges || []);
  const newUnlocked = [];

  if (reportsCount >= 1 && !existingBadges.has('first_report')) {
    existingBadges.add('first_report');
    newUnlocked.push('first_report');
  }
  if (approvedMissionsCount >= 1 && !existingBadges.has('first_cleanup')) {
    existingBadges.add('first_cleanup');
    newUnlocked.push('first_cleanup');
  }
  if (reportsCount >= 5 && !existingBadges.has('recycling_hero')) {
    existingBadges.add('recycling_hero');
    newUnlocked.push('recycling_hero');
  }
  if (user.ecoPoints >= 1000 && !existingBadges.has('eco_warrior')) {
    existingBadges.add('eco_warrior');
    newUnlocked.push('eco_warrior');
  }
  if (user.ecoPoints >= 2500 && !existingBadges.has('top_contributor')) {
    existingBadges.add('top_contributor');
    newUnlocked.push('top_contributor');
  }
  if (approvedMissionsCount >= 5 && !existingBadges.has('missions_5')) {
    existingBadges.add('missions_5');
    newUnlocked.push('missions_5');
  }
  if (reportsCount >= 10 && !existingBadges.has('reports_10')) {
    existingBadges.add('reports_10');
    newUnlocked.push('reports_10');
  }

  user.badges = Array.from(existingBadges);

  for (const badgeKey of newUnlocked) {
    const badgeDef = BADGE_DEFINITIONS.find(b => b.key === badgeKey);
    if (badgeDef) {
      await Notification.create({
        userId: user._id,
        title: `Badge Unlocked: ${badgeDef.name} ${badgeDef.icon}`,
        message: badgeDef.description,
        type: 'badge_unlocked'
      });
    }
  }
};

module.exports = {
  BADGE_DEFINITIONS,
  calculateLevel,
  awardPoints,
  checkAndAwardBadges
};
