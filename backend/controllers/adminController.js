const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const CleaningMission = require('../models/CleaningMission');
const MissionSubmission = require('../models/MissionSubmission');
const Bin = require('../models/Bin');
const EcoPointTransaction = require('../models/EcoPointTransaction');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalReports = await WasteReport.countDocuments();
    const pendingReports = await WasteReport.countDocuments({ status: 'Pending' });
    const resolvedReports = await WasteReport.countDocuments({ status: 'Resolved' });
    
    const totalMissions = await CleaningMission.countDocuments();
    const completedMissions = await MissionSubmission.countDocuments({ status: 'Approved' });
    const pendingSubmissions = await MissionSubmission.countDocuments({ status: 'Submitted' });

    const totalBins = await Bin.countDocuments();
    const fullBins = await Bin.countDocuments({ status: 'Full' });

    const pointsAggregation = await EcoPointTransaction.aggregate([
      { $group: { _id: null, totalPoints: { $sum: '$points' } } }
    ]);
    const totalEcoPointsAwarded = pointsAggregation.length > 0 ? pointsAggregation[0].totalPoints : 0;

    // Charts Data: Waste Category Distribution
    const categoryDistribution = await WasteReport.aggregate([
      { $group: { _id: '$wasteType', count: { $sum: 1 } } }
    ]);

    // Charts Data: Reports Status Distribution
    const statusDistribution = await WasteReport.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Charts Data: Department Participation
    const departmentStats = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$department', totalPoints: { $sum: '$ecoPoints' }, members: { $sum: 1 } } },
      { $sort: { totalPoints: -1 } }
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalReports,
        pendingReports,
        resolvedReports,
        totalMissions,
        completedMissions,
        pendingSubmissions,
        totalEcoPointsAwarded,
        totalBins,
        fullBins
      },
      charts: {
        categoryDistribution: categoryDistribution.map(c => ({ name: c._id, count: c.count })),
        statusDistribution: statusDistribution.map(s => ({ name: s._id, count: s.count })),
        departmentStats: departmentStats.map(d => ({ name: d._id, points: d.totalPoints, members: d.members }))
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Error fetching admin stats.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { search, department } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department && department !== 'All') {
      filter.department = department;
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const reportsCount = await WasteReport.countDocuments({ userId: u._id });
        const missionsCount = await MissionSubmission.countDocuments({ userId: u._id, status: 'Approved' });
        return {
          ...u.toObject(),
          reportsCount,
          missionsCount
        };
      })
    );

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role.' });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserRole
};
