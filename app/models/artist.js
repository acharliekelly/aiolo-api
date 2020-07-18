const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  living: {
    type: Boolean,
    default: true
  },
  birthYear: {
    type: Number
  },
  deathYear: {
    type: Number
  },
  bio: {
    type: String
  },
  gender: {
    type: String
  },
  nationality: {
    type: String
  }
});

module.exports = mongoose.model('Artist', artistSchema);
