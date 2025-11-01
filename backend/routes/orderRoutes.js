const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders, // Import the admin function
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Place a new order (Customer)
router.post('/', protect, placeOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders (Customer)
router.get('/myorders', protect, getUserOrders);

// @route   GET /api/orders
// @desc    Get all orders (Admin)
router.get('/', protect, admin, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin)
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;