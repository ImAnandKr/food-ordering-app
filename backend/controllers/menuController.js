const MenuItem = require('../models/menuItemModel');

// @desc    Add a new menu item
// @route   POST /api/menu
// @access  Private/Admin
const addMenuItem = async (req, res) => {
  const { itemName, price, category, image, restaurantId } = req.body;

  try {
    const menuItem = new MenuItem({
      itemName,
      price,
      category,
      image,
      restaurantId,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get menu for a specific restaurant
// @route   GET /api/menu/:restaurantId
// @access  Public
const getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurantId: req.params.restaurantId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMenuItem, getMenuByRestaurant };