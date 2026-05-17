// Node entry point (NodeNpm - L10, Express - L11, Middleware - L12, Mongoose - L14)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Built-in / third-party middleware (L12)
app.use(cors());            // allow the React frontend to talk to us
app.use(express.json({ limit: '10mb' }));  // parse JSON bodies (photos as base64 can be big)

// Routes (Express Router - L11)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stadiums', require('./routes/stadiums'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/messages', require('./routes/messages'));

// Connect to MongoDB and start the server (Mongoose - L14)
// If no local MongoDB is running, fall back to an in-memory MongoDB
// (so the project can be demoed without installing MongoDB).
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to local MongoDB');
  } catch (err) {
    console.log('No local MongoDB, starting in-memory MongoDB...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
    console.log('In-memory MongoDB ready');
  }

  app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT);
  });
}

start();
