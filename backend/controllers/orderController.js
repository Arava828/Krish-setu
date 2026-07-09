const Order = require('../models/Order');
const Crop = require('../models/Crop');

const placeOrder = async (req, res) => {
  try {
    const { cropId, quantity, deliveryAddress, notes } = req.body;
    const crop = await Crop.findById(cropId).populate('farmer');
    if (!crop) return res.status(404).json({ message: 'Crop not found.' });
    if (crop.status !== 'available') return res.status(400).json({ message: 'Crop is no longer available.' });
    const totalAmount = crop.price.amount * quantity.amount;
    const order = await Order.create({
      buyer: req.user._id, farmer: crop.farmer._id, crop: cropId,
      quantity, pricePerUnit: crop.price.amount, totalAmount, deliveryAddress, notes,
      statusHistory: [{ status: 'pending', note: 'Order placed by buyer' }]
    });
    await order.populate([
      { path: 'buyer', select: 'name email phone' },
      { path: 'farmer', select: 'name email phone' },
      { path: 'crop', select: 'name category price' }
    ]);
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order.', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('crop', 'name category price')
      .populate('farmer', 'name phone location')
      .sort({ createdAt: -1 });
    res.json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

const getReceivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('crop', 'name category price')
      .populate('buyer', 'name phone email')
      .sort({ createdAt: -1 });
    res.json({ orders, total: orders.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own orders.' });
    }
    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    await order.save();
    res.json({ message: 'Order status updated!', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order.', error: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('crop', 'name category price location')
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email phone location');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order.', error: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getReceivedOrders, updateOrderStatus, getOrder };