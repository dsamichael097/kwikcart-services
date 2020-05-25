const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: {type: mongoose.Types.ObjectId, required: true},
    img: {type: String, required: true},
    price: {type: Number, required: true},
    qty: {type: Number, required: true, default: 1}
},{_id: false});

const Cart = mongoose.model("cart",cartSchema);

exports.Cart = Cart;
exports.cartSchema = cartSchema;