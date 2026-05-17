const mongoose = require('mongoose');

// Stadium schema
const stadiumSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  photos: [String]  // base64 data URLs (kept simple, matching frontend)
});

module.exports = mongoose.model('Stadium', stadiumSchema);
