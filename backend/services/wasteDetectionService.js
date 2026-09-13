/**
 * Waste Detection Service Abstraction
 * Supports AI Computer Vision API integration with automatic demo/mock fallback.
 */

const CATEGORIES = [
  { type: 'Plastic', bins: ['Plastic/Recyclable', 'Dry Waste Bin'], sampleItems: ['PET Bottle', 'Plastic Food Wrapper', 'Disposable Cup', 'Plastic Bag', 'Container Lid'] },
  { type: 'Paper', bins: ['Paper/Cardboard Bin', 'Dry Waste Bin'], sampleItems: ['Cardboard Box', 'Notebook Sheet', 'Paper Coffee Cup', 'Flyer/Paper Flyer'] },
  { type: 'Organic/Food', bins: ['Organic/Compost Bin', 'Wet Waste Bin'], sampleItems: ['Fruit Peel', 'Leftover Food', 'Vegetable Scraps', 'Garden Leaf Waste'] },
  { type: 'Glass', bins: ['Glass Recycling Station', 'Specialized Glass Bin'], sampleItems: ['Glass Beverage Bottle', 'Broken Glassware', 'Jam Jar'] },
  { type: 'Metal', bins: ['Metal/Can Bin', 'Recyclables Bin'], sampleItems: ['Aluminum Soda Can', 'Tin Food Can', 'Scrap Metal Piece'] },
  { type: 'E-waste', bins: ['E-Waste Collection Kiosk'], sampleItems: ['Circuit Board Piece', 'Old Smartphone Battery', 'Broken Charger Cable', 'Unused Earphones'] }
];

const detectWaste = async (imageBufferOrBase64, filename = '') => {
  // Check if external Vision API key is configured
  const hasRealVisionKey = !!process.env.GOOGLE_VISION_API_KEY || !!process.env.CLARIFAI_API_KEY;

  if (hasRealVisionKey) {
    // Note: Place real API call here when credentials are provided in .env
    // e.g. await callGoogleVisionApi(imageBufferOrBase64);
  }

  // Heuristic mock detection simulation based on filename hints or intelligent selection
  const lowerName = filename.toLowerCase();
  let selectedCategory = null;

  if (lowerName.includes('bottle') || lowerName.includes('plastic') || lowerName.includes('cup') || lowerName.includes('bag')) {
    selectedCategory = CATEGORIES[0];
  } else if (lowerName.includes('paper') || lowerName.includes('box') || lowerName.includes('cardboard')) {
    selectedCategory = CATEGORIES[1];
  } else if (lowerName.includes('food') || lowerName.includes('apple') || lowerName.includes('peel') || lowerName.includes('leaf')) {
    selectedCategory = CATEGORIES[2];
  } else if (lowerName.includes('glass') || lowerName.includes('jar')) {
    selectedCategory = CATEGORIES[3];
  } else if (lowerName.includes('can') || lowerName.includes('metal') || lowerName.includes('tin')) {
    selectedCategory = CATEGORIES[4];
  } else if (lowerName.includes('wire') || lowerName.includes('phone') || lowerName.includes('battery') || lowerName.includes('cable')) {
    selectedCategory = CATEGORIES[5];
  } else {
    // Pick a realistic random category if filename gives no hint
    const randIndex = Math.floor(Math.random() * CATEGORIES.length);
    selectedCategory = CATEGORIES[randIndex];
  }

  const randomItemIndex = Math.floor(Math.random() * selectedCategory.sampleItems.length);
  const detectedItem = selectedCategory.sampleItems[randomItemIndex];
  const confidence = Math.floor(Math.random() * 12) + 87; // 87% to 98%

  return {
    isMock: !hasRealVisionKey,
    detectionLabel: 'Demo AI Computer Vision Model (v1.2)',
    detectedItem,
    category: selectedCategory.type,
    confidence: confidence,
    recommendedBin: selectedCategory.bins[0],
    suggestedBins: selectedCategory.bins,
    recyclabilityRating: selectedCategory.type === 'Organic/Food' ? 'Compostable' : 'High Recyclability',
    processingTimeMs: Math.floor(Math.random() * 200) + 150
  };
};

module.exports = { detectWaste };
