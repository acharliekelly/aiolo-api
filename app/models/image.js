/**
 * separated image model from artwork model to avoid getting
 * locked into one image source provider
 */

import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  // ID string that can be used to obtain image URI
  publicId: {
    type: String,
    required: true
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'ImageHost',
    required: true
  },
  format: {
    type: String,
    default: 'jpg'
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  // when image was added to host, as
  // opposed to when added to database
  created_at: {
    type: Date
  }
}, {
  timestamps: true
});

export default model('Image', imageSchema);
