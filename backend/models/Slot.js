const mongoose = require('mongoose');

// A reservation slot - either available or reserved by a user
const slotSchema = new mongoose.Schema({
  stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  date: { type: String, required: true },       // YYYY-MM-DD
  startTime: { type: String, required: true },  // HH:mm
  endTime: { type: String, required: true },    // HH:mm
  status: { type: String, enum: ['available', 'reserved'], default: 'available' }
});

module.exports = mongoose.model('Slot', slotSchema);
