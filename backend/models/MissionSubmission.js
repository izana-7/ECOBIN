const mongoose = require('mongoose');

const missionSubmissionSchema = new mongoose.Schema({
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CleaningMission', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beforeImageUrl: { type: String, required: true },
  afterImageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  adminFeedback: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('MissionSubmission', missionSubmissionSchema);
