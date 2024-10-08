const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const { now } = require('mongoose');
const Products = require('./models/Products')
const ProductCategory = require('./models/ProductCategory')
const router = express.Router();
const authMiddleware = require('./routes/auth');
const cookieParser = require('cookie-parser');



dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();


// CORS configuration
const corsOptions = {
  origin: 'https://rama-bakery.vercel.app', // Replace with your frontend URL
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // For handling cookies


// Get all products route
app.get('/api/products', async (req, res) => {  // Changed from router to app
    try {
      const products = await Products.find({});  // Fetch products from the database
      res.json(products);  // Send the products as a JSON response
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

app.get('/api/category', async (req, res) => {
  try {


    const category = await ProductCategory.findOne({}); 
    
    if (!category) {
      return res.status(404).json({ message: 'No categories found' });
    }
    res.json(category.productCategories);  // Send the product categories array as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Routes
app.use('/api/auth', require('./routes/auth'));


app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${now()}`));
