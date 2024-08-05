const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    photo: String,  // Add this line
});

module.exports = mongoose.model('User',userSchema);