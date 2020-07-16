const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String,
    required: true
  },
  filter: {
    type: String,
    default: 'album'
  }
});

module.exports = mongoose.model('Gallery', gallerySchema);
