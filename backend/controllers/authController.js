const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const MissionSubmission = require('../models/MissionSubmission');
const EcoPointTransaction = require('../models/EcoPointTransaction');
const Notification = require('../models/Notification');
const { JWT_SECRET } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { name, email, phone, department, password, confirmPassword } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      phone: typeof phone === 'string' ? phone.trim() : '',
      department: typeof department === 'string' && department.trim() ? department.trim() : 'General',
      passwordHash,
      role: 'user',
      ecoPoints: 100, // Starter welcome bonus
      level: 'Eco Starter',
      badges: ['first_report']
    });

    // Record welcome bonus and initial badge for ledger/notification consistency
    await EcoPointTransaction.create({
      userId: user._id,
      points: 100,
      reason: 'Welcome Eco Starter Bonus'
    });

    await Notification.create([
      {
        userId: user._id,
        title: '+100 Eco Points Earned! ⭐',
        message: 'You earned 100 points for: Welcome Eco Starter Bonus. Total points: 100',
        type: 'points_awarded'
      },
      {
        userId: user._id,
        title: 'Badge Unlocked: First Report 🌱',
        message: 'Submitted your first campus waste report',
        type: 'badge_unlocked'
      }
    ]);

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const reportsSubmitted = await WasteReport.countDocuments({ userId: user._id });
    const reportsResolved = await WasteReport.countDocuments({ userId: user._id, status: 'Resolved' });
    const cleanupsCompleted = await MissionSubmission.countDocuments({ userId: user._id, status: 'Approved' });

    res.json({
      ...user.toObject(),
      stats: {
        reportsSubmitted,
        reportsResolved,
        cleanupsCompleted
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, department, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department) user.department = department;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role,
        ecoPoints: user.ecoPoints,
        level: user.level,
        badges: user.badges,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
