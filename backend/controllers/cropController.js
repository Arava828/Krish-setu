const Crop = require('../models/Crop');

const addCrop = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, farmer: req.user._id, location: req.body.location || req.user.location });
    await crop.populate('farmer', 'name phone location');
    res.status(201).json({ message: 'Crop listed successfully!', crop });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add crop.', error: error.message });
  }
};

const getCrops = async (req, res) => {
  try {
    const { category, state, minPrice, maxPrice, search, page = 1, limit = 12, isOrganic } = req.query;
    let query = { status: 'available' };
    if (category) query.category = category;
    if (state) query['location.state'] = state;
    if (isOrganic === 'true') query.isOrganic = true;
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }
    const total = await Crop.countDocuments(query);
    const crops = await Crop.find(query)
      .populate('farmer', 'name phone location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ crops, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch crops.', error: error.message });
  }
};

const getCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name phone email location');
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    crop.views += 1;
    await crop.save();
    res.json({ crop });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch crop.', error: error.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own listings.' });
    }
    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Crop updated!', crop: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update crop.', error: error.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }
    await crop.deleteOne();
    res.json({ message: 'Crop listing removed.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete crop.', error: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ crops, total: crops.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings.', error: error.message });
  }
};

module.exports = { addCrop, getCrops, getCrop, updateCrop, deleteCrop, getMyListings };