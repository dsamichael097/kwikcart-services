const mongoose = require('mongoose');
const {cartSchema} = require('./cart');

const sessionSchema = new mongoose.Schema({
    cart: [cartSchema],
    otp: {type: String, minlength: 6, maxlength: 6}
});

const Session = mongoose.model('session',sessionSchema);

exports.Session = Session;