import { Schema, model } from 'mongoose';

const artistSchema = new Schema({
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

artistSchema.virtual('url').get(function () {
  return '/artists/' + this._id;
});

export default model('Artist', artistSchema);
