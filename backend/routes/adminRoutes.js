const express = require('express');
const router = express.Router();
const { getAdminStats, getUsers, updateUserRole } = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, verifyAdmin, getAdminStats);
router.get('/users', verifyToken, verifyAdmin, getUsers);
router.put('/users/:id/role', verifyToken, verifyAdmin, updateUserRole);

module.exports = router;
