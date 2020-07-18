const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  cloudId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  taken: {
    type: Date
  },
  sequence: {
    type: Number,
    default: 0
  },
  isFinal: {
    type: Boolean,
    default: false
  },
  series: {
    type: String,
    required: true
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Photo', photoSchema);
