const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getReceivedOrders, updateOrderStatus, getOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('buyer'), placeOrder);
router.get('/my-orders', protect, authorize('buyer'), getMyOrders);
router.get('/received', protect, authorize('farmer'), getReceivedOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('farmer'), updateOrderStatus);

module.exports = router;