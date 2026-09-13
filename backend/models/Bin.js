const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  acceptedWasteTypes: [{ type: String }],
  fillLevel: { type: Number, min: 0, max: 100, default: 0 },
  status: {
    type: String,
    enum: ['Available', 'Nearly Full', 'Full'],
    default: 'Available'
  },
  lastEmptied: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);
