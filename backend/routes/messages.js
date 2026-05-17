const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/messages - send a message
router.post('/', auth, async (req, res) => {
  try {
    const { to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ msg: 'Recipient and text are required' });
    }

    const msg = new Message({ from: req.user.id, to, text });
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/messages/with/:userId - the conversation with one user
router.get('/with/:userId', auth, async (req, res) => {
  try {
    const other = req.params.userId;
    const list = await Message.find({
      $or: [
        { from: req.user.id, to: other },
        { from: other, to: req.user.id }
      ]
    })
      .sort('createdAt')
      .populate('from', 'username')
      .populate('to', 'username');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/messages/inbox - distinct users I've talked with
router.get('/inbox', auth, async (req, res) => {
  try {
    const all = await Message.find({
      $or: [{ from: req.user.id }, { to: req.user.id }]
    })
      .populate('from', 'username')
      .populate('to', 'username')
      .sort('-createdAt');

    const seen = new Set();
    const inbox = [];
    for (const m of all) {
      const otherId = String(m.from._id) === req.user.id ? String(m.to._id) : String(m.from._id);
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const otherUser = String(m.from._id) === req.user.id ? m.to : m.from;
        inbox.push({
          id: otherUser._id,
          name: otherUser.username,
          lastMessage: m.text,
          when: m.createdAt
        });
      }
    }
    res.json(inbox);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
