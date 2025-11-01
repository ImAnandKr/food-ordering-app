const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, admin, createRestaurant); // Admin only

module.exports = router;
