/**
 * Cloud source for image files
 * (ie Cloudinary)
 */

import { Schema, model } from 'mongoose';

const hostSchema = new Schema({
  hostId: {
    type: String,
    required: true
  },
  hostName: {
    type: String
  },
  baseUri: {
    type: String,
    required: true
  }
})

export default model('ImageHost', hostSchema);
