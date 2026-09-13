const express = require('express');
const router = express.Router();
const multer = require('multer');
const { scanWasteImage } = require('../controllers/aiController');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/detect-waste', upload.single('image'), scanWasteImage);

module.exports = router;
