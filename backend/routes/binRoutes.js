const express = require('express');
const router = express.Router();
const { getBins, getBinById, createBin, updateBin, deleteBin } = require('../controllers/binController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', getBins);
router.get('/:id', getBinById);
router.post('/', verifyToken, verifyAdmin, createBin);
router.put('/:id', verifyToken, verifyAdmin, updateBin);
router.delete('/:id', verifyToken, verifyAdmin, deleteBin);

module.exports = router;
