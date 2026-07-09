const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  quantity: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
  deliveryAddress: { street: String, city: String, state: String, pincode: String },
  paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
  notes: { type: String },
  messages: [{ sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, timestamp: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);