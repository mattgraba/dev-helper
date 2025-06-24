const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  aiResponse: { type: String, required: true },
  userId: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
