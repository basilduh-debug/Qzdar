const express = require('express');
const Stadium = require('../models/Stadium');
const Slot = require('../models/Slot');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/stadiums - list all (optional location filter)
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    const filter = {};
    if (location) filter.location = new RegExp(location, 'i');

    const stadiums = await Stadium.find(filter).populate('owner', 'username');
    res.json(stadiums);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/stadiums/mine - my stadiums (owner only)
router.get('/mine', auth, async (req, res) => {
  try {
    const stadiums = await Stadium.find({ owner: req.user.id });
    res.json(stadiums);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/stadiums/:id - one stadium
router.get('/:id', async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id).populate('owner', 'username');
    if (!stadium) return res.status(404).json({ msg: 'Stadium not found' });
    res.json(stadium);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/stadiums - add a stadium (owner only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ msg: 'Only owners can add stadiums' });
    }

    const { name, description, location, photos } = req.body;
    if (!name || !location) {
      return res.status(400).json({ msg: 'Name and location are required' });
    }

    const stadium = new Stadium({
      owner: req.user.id,
      name,
      description,
      location,
      photos: photos || []
    });

    await stadium.save();
    res.json(stadium);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/stadiums/:id - owner deletes their stadium (and its slots)
router.delete('/:id', auth, async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) return res.status(404).json({ msg: 'Stadium not found' });
    if (String(stadium.owner) !== req.user.id) {
      return res.status(403).json({ msg: 'Not your stadium' });
    }

    // Remove the stadium's slots first, then the stadium itself
    await Slot.deleteMany({ stadium: stadium._id });
    await stadium.deleteOne();

    res.json({ msg: 'Stadium deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
