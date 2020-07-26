const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  cloudId: {
    type: String,
    required: true
  },
  cloudFolder: {
    type: String,
    required: true
  },
  copyProtect: {
    type: Boolean,
    default: true
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
  completed: {
    type: Date
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    depth: {
      type: Number,
      default: 0.1
    },
    units: {
      type: String,
      default: 'inches'
    }
  },
  location: {
    name: {
      type: String
    },
    description: {
      type: String
    },
    geolat: {
      type: Number
    },
    geolng: {
      type: Number
    }
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gallery'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Artwork', artworkSchema);
