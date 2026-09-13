const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport
} = require('../controllers/reportController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyToken, createReport);
router.get('/', verifyToken, getReports);
router.get('/my', verifyToken, getMyReports);
router.get('/:id', verifyToken, getReportById);
router.put('/:id/status', verifyToken, verifyAdmin, updateReportStatus);
router.delete('/:id', verifyToken, verifyAdmin, deleteReport);

module.exports = router;
