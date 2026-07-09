const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

router.get('/farmer-stats', protect, async (req, res) => {
  try {
    const farmerId = req.user._id;
    const [totalCrops, activeCrops, totalOrders, completedOrders] = await Promise.all([
      Crop.countDocuments({ farmer: farmerId }),
      Crop.countDocuments({ farmer: farmerId, status: 'available' }),
      Order.countDocuments({ farmer: farmerId }),
      Order.countDocuments({ farmer: farmerId, status: 'delivered' })
    ]);
    const revenueResult = await Order.aggregate([
      { $match: { farmer: farmerId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({ totalCrops, activeCrops, totalOrders, completedOrders, totalRevenue: revenueResult[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats.', error: error.message });
  }
});

router.get('/buyer-stats', protect, async (req, res) => {
  try {
    const buyerId = req.user._id;
    const [totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
      Order.countDocuments({ buyer: buyerId }),
      Order.countDocuments({ buyer: buyerId, status: 'pending' }),
      Order.countDocuments({ buyer: buyerId, status: 'delivered' })
    ]);
    const spentResult = await Order.aggregate([
      { $match: { buyer: buyerId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    res.json({ totalOrders, pendingOrders, deliveredOrders, totalSpent: spentResult[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats.', error: error.message });
  }
});

module.exports = router;