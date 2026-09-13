const express = require('express');
const router = express.Router();
const {
  getMissions,
  getMissionById,
  createMission,
  joinMission,
  submitProof,
  getMySubmissions,
  reviewSubmission,
  updateMission,
  deleteMission
} = require('../controllers/missionController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', getMissions);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.get('/:id', getMissionById);

router.post('/', verifyToken, verifyAdmin, createMission);
router.post('/:id/join', verifyToken, joinMission);
router.post('/:id/submit', verifyToken, submitProof);

router.put('/submissions/:id/review', verifyToken, verifyAdmin, reviewSubmission);
router.put('/:id', verifyToken, verifyAdmin, updateMission);
router.delete('/:id', verifyToken, verifyAdmin, deleteMission);

module.exports = router;
