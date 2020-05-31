const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, minlength: 10, maxlength: 10, required: true },
    orders: [
      {
        date: { type: Date, default: Date.now() },
        name: String,
        img: String,
        qty: Number,
        price: Number,
        totalPrice: Number,
      },
    ],
    otp: { type: String, minlength: 6, maxlength: 6 },
    otpTimeStamp: { type: Date, default: Date.now() },
  },
  { _id: false }
);

const User = mongoose.model("User", userSchema);

exports.User = User;
