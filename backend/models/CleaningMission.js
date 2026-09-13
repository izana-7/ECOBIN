const mongoose = require('mongoose');

const cleaningMissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, default: 12.9716 },
  longitude: { type: Number, default: 77.5946 },
  rewardPoints: { type: Number, required: true },
  deadline: { type: Date, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  maxParticipants: { type: Number, default: 50 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('CleaningMission', cleaningMissionSchema);
