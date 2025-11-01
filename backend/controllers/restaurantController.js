const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuItemModel');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant and its menu
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menu = await MenuItem.find({ restaurantId: req.params.id });
    
    res.json({ restaurant, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  const { name, description, location, image } = req.body;

  try {
    const restaurant = new Restaurant({
      name,
      description,
      location,
      image,
      // In a real app, 'image' would be an upload URL from Multer/Cloudinary
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRestaurants, getRestaurantById, createRestaurant };