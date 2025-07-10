// server/src/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');
const explainRoutes = require('./routes/explain');
const fixRoutes = require('./routes/fix');
const generateRoutes = require('./routes/generate');
const scaffoldRoutes = require('./routes/scaffold');
const terminalRoutes = require('./routes/terminal');
const historyRoutes = require('./routes/history');


// Mount Routes
app.use('/auth', authRoutes);
app.use('/analyze', analyzeRoutes);
app.use('/explain', explainRoutes);
app.use('/fix', fixRoutes);
app.use('/generate', generateRoutes);
app.use('/scaffold', scaffoldRoutes);
app.use('/terminal', terminalRoutes);
app.use('/history', historyRoutes);

// Server Start
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
