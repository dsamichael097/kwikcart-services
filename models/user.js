const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone : {type : String, minlength: 10, maxlength: 10, required: true},
    otp: {type: String, minlength: 6, maxlength: 6}
});

const User = mongoose.model("User",userSchema);

exports.User = User;

