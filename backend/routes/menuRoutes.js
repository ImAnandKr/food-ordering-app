const express = require('express');
const router = express.Router();
const {
  addMenuItem,
  getMenuByRestaurant,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, addMenuItem); // Admin only
router.get('/:restaurantId', getMenuByRestaurant);

module.exports = router;
