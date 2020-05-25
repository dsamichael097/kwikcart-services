const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true},
    numberInStock: {type: Number, min: 0, required: true},
    price: {type: Number, min: 0, required: true}
});

const Product = mongoose.model("Product",productSchema);

exports.Product = Product;