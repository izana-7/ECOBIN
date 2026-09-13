const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wasteType: {
    type: String,
    enum: ['Plastic', 'Paper', 'Organic/Food', 'Glass', 'Metal', 'E-waste', 'Other'],
    required: true
  },
  location: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  description: { type: String, default: '' },
  quantity: { type: String, default: 'Medium' },
  imageUrl: { type: String, default: '' },
  aiDetectedType: { type: String, default: '' },
  aiConfidence: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Collected', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  assignedTo: { type: String, default: '' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('WasteReport', wasteReportSchema);
