const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  public_id: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'upload'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  context: {
    custom: [
      {
        type: Map,
        of: String
      }
    ]
  }
})

module.exports = mongoose.model('CloudinaryResource', resourceSchema);
