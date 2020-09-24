import { Schema, model } from 'mongoose';

const gallerySchema = new Schema({
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
    type: String
  },
  // instead of thumbnail
  coverImage: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  // default sorting
  sortBy: {
    field: {
      type: String
    },
    descending: {
      type: Boolean
    }
  },
  filter: {
    type: String,
    default: 'album'
  }
}, {
  timestamps: true
});

export default model('Gallery', gallerySchema);
