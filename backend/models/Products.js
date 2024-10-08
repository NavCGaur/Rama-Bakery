const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    category: {type:String, required:true},
    name: {type:String, required:true},
    price: {type:Number, required:true},
    weight: {type:Number, required:true},
    image: {type:String, required:true},
    date: {type:Date, default:Date.now}

});

module.exports = mongoose.model('Products', ProductsSchema)