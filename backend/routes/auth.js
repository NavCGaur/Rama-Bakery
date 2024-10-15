const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Products = require('../models/Products');
const router = express.Router();
const Joi = require('joi');
const  {getNextProductId}  = require('../utils/IdGenerator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {verifyToken} = require('../middleware/jwtMiddleware'); // Adjust the path as needed



// Check token status middleware
const checkTokenStatus = (req, res, next) => {
  if (req.cookies.token) {
    console.log('Token exists before clearing:', req.cookies.token);
  } else {
    console.log('No token found before clearing');
  }
  next();
};



const nameMinLenth = 3;
const passMinLength = 8;

const registrationSchema = Joi.object({
  username: Joi.string().min(nameMinLenth).required().regex(/^\S+$/).messages({
    'string.base': `Username should be a type of 'text'`,
    'string.empty': `Username cannot be an empty field`,
    'string.min': `Username should have a minimum length of ${nameMinLenth}`,
    'any.required': `Username is a required field`,
    'string.pattern.base': 'Username cannot contain Space' 
  }),
  email: Joi.string().email().required().messages({
    'string.email': `Email must be a valid email`,  
    'string.empty': `Email cannot be an empty field`,
    'any.required': `Email is a required field`
  }),
  password: Joi.string().min(passMinLength).regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/).regex(/^\S+$/).required().messages({
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password should have a minimum length of ${passMinLength}`,
    'any.required': `Password is a required field`,
    'string.pattern.base': `Password must contain at least one special character, one number, and no spaces`
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `Email must be a valid email`,  
    'string.empty': `Email cannot be an empty field`,
    'any.required': `Email is a required field`
  }),
  password: Joi.string().required().messages({
    'string.empty': `Password cannot be an empty field`,
    'any.required': `Password is a required field`
  })
});


const productAddSchema = Joi.object({

  category: Joi.string().trim().required().messages(
    {
      'string.empty': `Category cannot be an empty field`,
      'any.required': `Category is a required field`,
    }),
  name: Joi.string().trim().required().messages(
     {
        'string.empty': `name cannot be an empty field`,
        'any.required': `name is a required field`,
      }),
  price: Joi.number().required().positive().messages({
        'number.base': 'Price must be a number',
        'number.empty': 'Price cannot be empty',
        'any.required': 'Price is a required field',
        'number.positive': 'Price must be a positive number'
      }),
  weight: Joi.number().required().positive().messages({
        'number.base': 'Weight must be a number',
        'number.empty': 'Weight cannot be empty',
        'any.required': 'Weight is a required field',
        'number.positive': 'Weight must be a positive number'
      }),
  image: Joi.string().required().messages({
        'string.empty': `Image cannot be an empty, please upload image`,
        'any.required': `Image is required`,
      })
    
});

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
   
    console.log(username, email, password);
    const { error } = registrationSchema.validate({  username, email, password }, { abortEarly: true });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
      
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      return res.status(400).json(errors);
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if username is already taken
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin', // Default role,
      date: new Date()
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    });

    res.json({ message: 'Logged in successfully' });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Forgot Password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found. Please register or check your email address.' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Use the app-specific password here
      },
    });

    // Compose email
    const resetUrl = `https://rama-bakery-k92f.vercel.app/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Please check, an email has been sent to reset your password.' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  try {
    // Find user by token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Your password has been reset successfully.' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route in auth.js
router.get('/admin', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin panel', userId: req.userId });
});


// User dashboard route (protected, all authenticated users)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to your dashboard', user: req.user });
});

// Get user profile (protected, for the authenticated user)
router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});
// Add the checkTokenStatus middleware before clearing the token
router.post('/logout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
  });
  res.status(200).json({ message: 'Logged out successfully' });
});



router.post('/addproduct', async (req, res) => {
  let { id, category, name, price, weight, image } = req.body;
 
// Capitalize the first letter of each word in the name
name = capitalizeWords(name.trim());
    

  try {

    const numericPrice = Number(price);
    const numericWeight = Number(weight);

    const { error } = productAddSchema.validate({  category, name, price:numericPrice, weight:numericWeight, image }, { abortEarly: false });
    console.log('error:',error);

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
      
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return res.status(400).json(errors);
    }

   

    // Check if product exists
    let existingProduct = await Products.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

    if (existingProduct) return res.status(400).json({ message: 'Product already exists' });

    
    const id = await getNextProductId();

    // Create new product
    const product = new Products({ 
      id, 
      category, 
      name,
      price:numericPrice,
      weight:numericWeight,
      image,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

    await product.save();
    
    res.json({ message:`Product successfully added with ID:` });  
  }

    catch (err) {
      if (err.message === 'File too large') {
        return res.status(400).json({ message: 'Error: Please select image with size less than 500KB' });
      }
      res.status(500).json({ message: 'Server error in auth' });
    }
  });

  router.delete('/products', async (req, res) => {
    const { ids } = req.body; // Expecting an array of ids to delete
    console.log('Attempting to delete products with ids:', ids);
    
    try {
      const result = await Products.deleteMany({ id: { $in: ids } });
      console.log('Delete operation result:', result);
      
      if (result.deletedCount > 0) {
        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} product(s)` });
      } else {
        res.status(404).json({ message: 'No products found with the provided ids' });
      }
    } catch (error) {
      console.error('Error while deleting products:', error);
      res.status(500).json({ message: 'Server error while deleting products' });
    }
  });

  // Product Update Route
router.put('/products/:id', async (req, res) => {
  const productsToUpdate = req.body; // Assuming a single product in the body
  
  try {

    const { id } = req.params; // Get the product ID from the URL
    let { category, name, price, weight, image } = productsToUpdate;

    name = capitalizeWords(name.trim());
    const numericPrice = Number(price);
    const numericWeight = Number(weight);

    // Validate product data
    const { error } = productAddSchema.validate({
      category,
      name,
      price: numericPrice,
      weight: numericWeight,
      image
    }, { abortEarly: false });

    if (error) {
      const productErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});

      return res.status(400).json({ message: 'Validation failed', errors: productErrors });
    }

    // Update the product in the database
    const updatedProduct = await Products.findOneAndUpdate(
      { id }, // Find the product by its ID
      { 
        category, 
        name, 
        price: numericPrice, 
        weight: numericWeight, 
        image,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      updatedProduct
    });

  } catch (err) {
    console.error('Error while updating product:', err);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});


module.exports = router;
