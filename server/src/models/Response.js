const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
    index: true
  },
  command: {
    type: String,
    required: false
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

ResponseSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Response', ResponseSchema);
