const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const { awardPoints } = require('../services/gamificationService');
const { uploadImage } = require('../services/cloudinaryService');

const generateReportId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ECO-${year}-${randomNum}`;
};

const createReport = async (req, res) => {
  try {
    const { wasteType, location, latitude, longitude, description, quantity, imageUrl, aiDetectedType, aiConfidence } = req.body;

    if (!wasteType || !location) {
      return res.status(400).json({ message: 'Waste type and location are required.' });
    }

    const processedImageUrl = imageUrl ? await uploadImage(imageUrl) : '';
    const reportId = generateReportId();

    const report = await WasteReport.create({
      reportId,
      userId: req.user._id,
      wasteType,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      description: description || '',
      quantity: quantity || 'Medium',
      imageUrl: processedImageUrl,
      aiDetectedType: aiDetectedType || '',
      aiConfidence: aiConfidence || 0,
      status: 'Pending'
    });

    // Award 25 points for submitting a waste report
    await awardPoints(req.user._id, 25, `Submitted waste report ${reportId}`, report._id.toString());

    // Create confirmation notification
    await Notification.create({
      userId: req.user._id,
      title: 'Waste Report Submitted 🗑️',
      message: `Your report ${reportId} for ${wasteType} at ${location} has been logged.`,
      type: 'report_submitted',
      link: `/reports`
    });

    res.status(201).json({
      message: 'Waste report submitted successfully',
      report
    });
  } catch (err) {
    console.error('Create report error:', err);
    res.status(500).json({ message: 'Error creating waste report.' });
  }
};

const getReports = async (req, res) => {
  try {
    const { status, wasteType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;

    const reports = await WasteReport.find(filter)
      .populate('userId', 'name email department')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports.' });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user reports.' });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id)
      .populate('userId', 'name email department phone');

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report details.' });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, assignedTo, adminNotes } = req.body;
    const report = await WasteReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    const previousStatus = report.status;
    if (status) report.status = status;
    if (assignedTo !== undefined) report.assignedTo = assignedTo;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    // If status updated to Resolved, award 25 extra points to user
    if (status === 'Resolved' && previousStatus !== 'Resolved') {
      await awardPoints(report.userId, 25, `Waste report ${report.reportId} resolved`, report._id.toString());
      await Notification.create({
        userId: report.userId,
        title: 'Waste Report Resolved! 🎉',
        message: `Your report ${report.reportId} has been resolved by campus administration. +25 Eco Points awarded!`,
        type: 'report_updated'
      });
    } else {
      await Notification.create({
        userId: report.userId,
        title: 'Report Status Updated 📋',
        message: `Report ${report.reportId} status changed to ${status}.`,
        type: 'report_updated'
      });
    }

    res.json({
      message: 'Report status updated successfully',
      report
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating report status.' });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await WasteReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report.' });
  }
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport
};
