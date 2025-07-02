const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // optional for now, but will be required with auth
    index: true
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Optional: Compound index for fast filtering
ResponseSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Response', ResponseSchema);
