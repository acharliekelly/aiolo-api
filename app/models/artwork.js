const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  cloudId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  medium: {
    type: String
  },
  sizeWidth: {
    type: Number
  },
  sizeHeight: {
    type: Number
  },
  sizeUnits: {
    type: String,
    default: 'inches'
  },
  artist: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Artwork', artworkSchema);
