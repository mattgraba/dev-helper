// server/src/index.js

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';
import explainRoutes from './routes/explain.js';
import fixRoutes from './routes/fix.js';
import generateRoutes from './routes/generate.js';
import scaffoldRoutes from './routes/scaffold.js';
import terminalRoutes from './routes/terminal.js';
import historyRoutes from './routes/history.js';


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

// Start server regardless of MongoDB connection status
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Connect to MongoDB (non-blocking)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connected');
    })
    .catch((err) => {
      console.warn('⚠️  MongoDB connection failed. History features will not work.');
      console.warn('    Error:', err.message);
    });
} else {
  console.warn('⚠️  MONGO_URI not set. History features will not work.');
}
