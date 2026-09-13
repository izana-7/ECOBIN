const Bin = require('../models/Bin');

const getBins = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) {
      filter.acceptedWasteTypes = { $in: [category] };
    }
    if (status) {
      filter.status = status;
    }

    const bins = await Bin.find(filter).sort({ location: 1 });
    res.json(bins);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bins.' });
  }
};

const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found.' });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bin.' });
  }
};

const createBin = async (req, res) => {
  try {
    const { binId, location, latitude, longitude, acceptedWasteTypes, fillLevel, status } = req.body;

    if (!binId || !location || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Bin ID, location, latitude, and longitude are required.' });
    }

    const existingBin = await Bin.findOne({ binId });
    if (existingBin) {
      return res.status(400).json({ message: 'Bin with this ID already exists.' });
    }

    const level = fillLevel !== undefined ? Number(fillLevel) : 0;
    let computedStatus = status;
    if (!computedStatus) {
      if (level >= 90) computedStatus = 'Full';
      else if (level >= 65) computedStatus = 'Nearly Full';
      else computedStatus = 'Available';
    }

    const bin = await Bin.create({
      binId,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      acceptedWasteTypes: acceptedWasteTypes || ['Plastic', 'Paper'],
      fillLevel: level,
      status: computedStatus
    });

    res.status(201).json({ message: 'Bin created successfully', bin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating bin.' });
  }
};

const updateBin = async (req, res) => {
  try {
    const { location, latitude, longitude, acceptedWasteTypes, fillLevel, status } = req.body;
    const bin = await Bin.findById(req.params.id);

    if (!bin) return res.status(404).json({ message: 'Bin not found.' });

    if (location) bin.location = location;
    if (latitude !== undefined) bin.latitude = Number(latitude);
    if (longitude !== undefined) bin.longitude = Number(longitude);
    if (acceptedWasteTypes) bin.acceptedWasteTypes = acceptedWasteTypes;
    if (fillLevel !== undefined) {
      bin.fillLevel = Number(fillLevel);
      if (bin.fillLevel >= 90) bin.status = 'Full';
      else if (bin.fillLevel >= 65) bin.status = 'Nearly Full';
      else bin.status = 'Available';
    }
    if (status) bin.status = status;

    await bin.save();
    res.json({ message: 'Bin updated successfully', bin });
  } catch (err) {
    res.status(500).json({ message: 'Error updating bin.' });
  }
};

const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found.' });
    res.json({ message: 'Bin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bin.' });
  }
};

module.exports = {
  getBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin
};
