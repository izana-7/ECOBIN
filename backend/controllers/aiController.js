const { detectWaste } = require('../services/wasteDetectionService');
const { uploadImage } = require('../services/cloudinaryService');

const scanWasteImage = async (req, res) => {
  try {
    const { image, filename } = req.body;
    let imageSource = image;

    if (req.file) {
      imageSource = req.file.buffer;
    }

    if (!imageSource) {
      return res.status(400).json({ message: 'No image provided for AI analysis.' });
    }

    // Call waste detection service abstraction
    const detectionResult = await detectWaste(imageSource, filename || 'scanned_waste.jpg');

    // Also get stored image URL (Cloudinary or DataURI)
    const storedImageUrl = await uploadImage(imageSource, { mimeType: req.file ? req.file.mimetype : 'image/jpeg' });

    res.json({
      ...detectionResult,
      imageUrl: storedImageUrl
    });
  } catch (err) {
    console.error('AI Scan Error:', err);
    res.status(500).json({ message: 'Error analyzing waste image.' });
  }
};

module.exports = { scanWasteImage };
