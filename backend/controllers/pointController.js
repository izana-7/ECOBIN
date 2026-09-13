const User = require('../models/User');
const EcoPointTransaction = require('../models/EcoPointTransaction');
const WasteReport = require('../models/WasteReport');
const MissionSubmission = require('../models/MissionSubmission');
const { BADGE_DEFINITIONS } = require('../services/gamificationService');

const getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('ecoPoints level badges name email');
    const transactions = await EcoPointTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const badgeDetails = BADGE_DEFINITIONS.map(b => ({
      ...b,
      unlocked: user.badges.includes(b.key)
    }));

    res.json({
      ecoPoints: user.ecoPoints,
      level: user.level,
      badges: badgeDetails,
      transactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user points.' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { filter, department } = req.query;
    const query = { role: 'user' };

    if (department && department !== 'All') {
      query.department = department;
    }

    const users = await User.find(query)
      .select('name email department ecoPoints level badges avatar')
      .sort({ ecoPoints: -1 })
      .limit(50);

    const leaderboardWithStats = await Promise.all(
      users.map(async (u, idx) => {
        const reportsCount = await WasteReport.countDocuments({ userId: u._id });
        const missionsCompleted = await MissionSubmission.countDocuments({ userId: u._id, status: 'Approved' });
        return {
          rank: idx + 1,
          id: u._id,
          name: u.name,
          department: u.department,
          ecoPoints: u.ecoPoints,
          level: u.level,
          badgesCount: u.badges ? u.badges.length : 0,
          reportsSubmitted: reportsCount,
          missionsCompleted,
          avatar: u.avatar
        };
      })
    );

    res.json(leaderboardWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard.' });
  }
};

module.exports = { getUserPoints, getLeaderboard };
