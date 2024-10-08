const mongoose = require('mongoose');

console.log('Mongoose version:', mongoose.version);

// Define the schema
const productCategorySchema = new mongoose.Schema({
    productCategories: {
        type: [String],
        required: true,
    }
}, { collection: 'category' });

// Create the model
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);


// Export the model
module.exports = ProductCategory;

