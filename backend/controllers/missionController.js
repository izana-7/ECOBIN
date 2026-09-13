const CleaningMission = require('../models/CleaningMission');
const MissionSubmission = require('../models/MissionSubmission');
const Notification = require('../models/Notification');
const { awardPoints } = require('../services/gamificationService');
const { uploadImage } = require('../services/cloudinaryService');

const getMissions = async (req, res) => {
  try {
    const { status, difficulty } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (difficulty) filter.difficulty = difficulty;

    const missions = await CleaningMission.find(filter).sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cleaning missions.' });
  }
};

const getMissionById = async (req, res) => {
  try {
    const mission = await CleaningMission.findById(req.params.id)
      .populate('participants', 'name email department avatar');

    if (!mission) return res.status(404).json({ message: 'Mission not found.' });

    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching mission.' });
  }
};

const createMission = async (req, res) => {
  try {
    const { title, description, location, rewardPoints, deadline, difficulty, maxParticipants, latitude, longitude } = req.body;

    if (!title || !description || !location || !rewardPoints || !deadline) {
      return res.status(400).json({ message: 'Title, description, location, reward points, and deadline are required.' });
    }

    const mission = await CleaningMission.create({
      title,
      description,
      location,
      latitude: latitude ? parseFloat(latitude) : 12.9716,
      longitude: longitude ? parseFloat(longitude) : 77.5946,
      rewardPoints: Number(rewardPoints),
      deadline: new Date(deadline),
      difficulty: difficulty || 'Medium',
      maxParticipants: maxParticipants ? Number(maxParticipants) : 50,
      status: 'Active'
    });

    res.status(201).json({ message: 'Cleaning mission created successfully', mission });
  } catch (err) {
    res.status(500).json({ message: 'Error creating mission.' });
  }
};

const joinMission = async (req, res) => {
  try {
    const mission = await CleaningMission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found.' });

    if (mission.status !== 'Active') {
      return res.status(400).json({ message: 'This mission is no longer active.' });
    }

    const alreadyJoined = mission.participants.some(p => p.toString() === req.user._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this mission.' });
    }

    mission.participants.push(req.user._id);
    await mission.save();

    await Notification.create({
      userId: req.user._id,
      title: 'Joined Cleaning Mission! 🧹',
      message: `You joined "${mission.title}". Upload before/after proof once finished to earn +${mission.rewardPoints} Eco Points!`,
      type: 'mission_joined',
      link: '/clean-earn'
    });

    res.json({ message: 'Successfully joined cleaning mission', mission });
  } catch (err) {
    res.status(500).json({ message: 'Error joining mission.' });
  }
};

const submitProof = async (req, res) => {
  try {
    const missionId = req.params.id;
    const { beforeImageUrl, afterImageUrl, description, location } = req.body;

    if (!beforeImageUrl || !afterImageUrl) {
      return res.status(400).json({ message: 'Both before and after photos are required.' });
    }

    const mission = await CleaningMission.findById(missionId);
    if (!mission) return res.status(404).json({ message: 'Mission not found.' });

    const processedBefore = await uploadImage(beforeImageUrl);
    const processedAfter = await uploadImage(afterImageUrl);

    const submission = await MissionSubmission.create({
      missionId,
      userId: req.user._id,
      beforeImageUrl: processedBefore,
      afterImageUrl: processedAfter,
      description: description || '',
      location: location || mission.location,
      status: 'Submitted'
    });

    await Notification.create({
      userId: req.user._id,
      title: 'Cleaning Proof Submitted 📸',
      message: `Your proof for "${mission.title}" is submitted and pending admin review.`,
      type: 'system',
      link: '/clean-earn'
    });

    res.status(201).json({ message: 'Cleaning submission uploaded successfully', submission });
  } catch (err) {
    console.error('Submit proof error:', err);
    res.status(500).json({ message: 'Error submitting cleaning proof.' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await MissionSubmission.find({ userId: req.user._id })
      .populate('missionId', 'title location rewardPoints')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { status, adminFeedback } = req.body; // Approved or Rejected
    const submissionId = req.params.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
    }

    const submission = await MissionSubmission.findById(submissionId).populate('missionId');
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    if (submission.status === 'Approved') {
      return res.status(400).json({ message: 'Submission has already been approved.' });
    }

    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    if (adminFeedback) submission.adminFeedback = adminFeedback;

    await submission.save();

    if (status === 'Approved') {
      const rewardPoints = submission.missionId ? submission.missionId.rewardPoints : 100;
      const missionTitle = submission.missionId ? submission.missionId.title : 'Cleaning Mission';

      await awardPoints(
        submission.userId,
        rewardPoints,
        `Approved cleaning mission: ${missionTitle}`,
        submission._id.toString()
      );

      await Notification.create({
        userId: submission.userId,
        title: `Mission Approved! 🎉 (+${rewardPoints} Points)`,
        message: `Your proof for "${missionTitle}" was approved by Admin. +${rewardPoints} Eco Points added!`,
        type: 'mission_approved'
      });
    } else {
      await Notification.create({
        userId: submission.userId,
        title: 'Mission Submission Rejected ⚠️',
        message: `Your submission for "${submission.missionId ? submission.missionId.title : 'Cleaning Mission'}" was not approved. Feedback: ${adminFeedback || 'Please provide clear before & after photos.'}`,
        type: 'mission_rejected'
      });
    }

    res.json({ message: `Submission ${status.toLowerCase()} successfully`, submission });
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ message: 'Error reviewing submission.' });
  }
};

const updateMission = async (req, res) => {
  try {
    const { title, description, location, rewardPoints, deadline, difficulty, status } = req.body;
    const mission = await CleaningMission.findById(req.params.id);

    if (!mission) return res.status(404).json({ message: 'Mission not found.' });

    if (title) mission.title = title;
    if (description) mission.description = description;
    if (location) mission.location = location;
    if (rewardPoints) mission.rewardPoints = Number(rewardPoints);
    if (deadline) mission.deadline = new Date(deadline);
    if (difficulty) mission.difficulty = difficulty;
    if (status) mission.status = status;

    await mission.save();
    res.json({ message: 'Mission updated successfully', mission });
  } catch (err) {
    res.status(500).json({ message: 'Error updating mission.' });
  }
};

const deleteMission = async (req, res) => {
  try {
    const mission = await CleaningMission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).json({ message: 'Mission not found.' });
    res.json({ message: 'Mission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting mission.' });
  }
};

module.exports = {
  getMissions,
  getMissionById,
  createMission,
  joinMission,
  submitProof,
  getMySubmissions,
  reviewSubmission,
  updateMission,
  deleteMission
};
