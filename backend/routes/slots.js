const express = require('express');
const Slot = require('../models/Slot');
const Stadium = require('../models/Stadium');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/slots/stadium/:id - get all slots for a stadium (public)
router.get('/stadium/:id', async (req, res) => {
  try {
    const slots = await Slot.find({ stadium: req.params.id }).populate('user', 'username');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/slots/mine - my reservations (user only)
router.get('/mine', auth, async (req, res) => {
  try {
    const slots = await Slot.find({ user: req.user.id }).populate('stadium');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/slots - owner adds a new slot
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ msg: 'Only owners can add slots' });
    }

    const { stadium, date, startTime, endTime } = req.body;

    // The slot date must be within the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const slotDate = new Date(date);
    const diffDays = (slotDate - today) / (1000 * 60 * 60 * 24);
    if (diffDays < 0 || diffDays > 7) {
      return res.status(400).json({ msg: 'Date must be within the next 7 days' });
    }

    // Make sure the stadium belongs to this owner
    const found = await Stadium.findById(stadium);
    if (!found || String(found.owner) !== req.user.id) {
      return res.status(403).json({ msg: 'Not your stadium' });
    }

    const slot = new Slot({ stadium, date, startTime, endTime });
    await slot.save();
    res.json(slot);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/slots/:id/reserve - user reserves a slot
router.put('/:id/reserve', auth, async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ msg: 'Slot not found' });
    if (slot.status === 'reserved') {
      return res.status(400).json({ msg: 'Slot already reserved' });
    }

    slot.status = 'reserved';
    slot.user = req.user.id;
    await slot.save();
    res.json(slot);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/slots/:id/cancel - user cancels their reservation
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return res.status(404).json({ msg: 'Slot not found' });
    if (String(slot.user) !== req.user.id) {
      return res.status(403).json({ msg: 'Not your reservation' });
    }

    slot.status = 'available';
    slot.user = null;
    await slot.save();
    res.json(slot);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/slots/stats - owner statistics
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ msg: 'Only owners' });
    }

    const stadiums = await Stadium.find({ owner: req.user.id });
    const ids = stadiums.map(s => s._id);

    const total = await Slot.countDocuments({ stadium: { $in: ids } });
    const reserved = await Slot.countDocuments({ stadium: { $in: ids }, status: 'reserved' });

    res.json({
      stadiums: stadiums.length,
      totalSlots: total,
      reserved: reserved,
      available: total - reserved
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/slots/search - search slots by date and/or location
router.get('/search', async (req, res) => {
  try {
    const { date, location } = req.query;

    let stadiumFilter = {};
    if (location) stadiumFilter.location = new RegExp(location, 'i');

    const stadiums = await Stadium.find(stadiumFilter);
    const ids = stadiums.map(s => s._id);

    const filter = { stadium: { $in: ids }, status: 'available' };
    if (date) filter.date = date;

    const slots = await Slot.find(filter).populate('stadium');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
