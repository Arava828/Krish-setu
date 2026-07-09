const express = require('express');
const router = express.Router();
const { addCrop, getCrops, getCrop, updateCrop, deleteCrop, getMyListings } = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCrops);
router.get('/my-listings', protect, authorize('farmer'), getMyListings);
router.get('/:id', getCrop);
router.post('/', protect, authorize('farmer'), addCrop);
router.put('/:id', protect, authorize('farmer'), updateCrop);
router.delete('/:id', protect, authorize('farmer'), deleteCrop);

module.exports = router;