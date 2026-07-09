const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['vegetables','fruits','grains','pulses','spices','oilseeds','cotton','sugarcane','other'] },
  description: { type: String, trim: true },
  quantity: {
    amount: { type: Number, required: true },
    unit: { type: String, required: true, enum: ['kg','quintal','ton','piece','dozen','bag'] }
  },
  price: {
    amount: { type: Number, required: true },
    per: { type: String, required: true, enum: ['kg','quintal','ton','piece','dozen','bag'] }
  },
  location: {
    state: { type: String },
    district: { type: String },
    village: { type: String }
  },
  quality: { type: String, enum: ['A','B','C'], default: 'A' },
  isOrganic: { type: Boolean, default: false },
  status: { type: String, enum: ['available','sold','reserved','expired'], default: 'available' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);