const express = require('express');
const router = express.Router();
const { getUserPoints, getLeaderboard } = require('../controllers/pointController');
const { verifyToken } = require('../middleware/auth');

router.get('/points', verifyToken, getUserPoints);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
