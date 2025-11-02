const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// === THIS IS THE FIX ===
// Setup CORS to allow your frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Your local dev environment
    'http://localhost:4173'  // Your local preview environment
    // Add your Vercel URL here later (e.g., 'https://your-frontend.vercel.app')
  ],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// =========================

// --- API Routes ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Simple test route
app.get('/', (req, res) => {
  res.send('Food Ordering API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});