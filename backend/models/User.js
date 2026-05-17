const mongoose = require('mongoose');

// User schema (Mongoose - L14)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
