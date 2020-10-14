/**
 * separated image model from artwork model to avoid getting
 * locked into one image source provider
 */

import { Schema, model } from 'mongoose';
import { ORIENTATION } from '../lib/constants';

const imageSchema = new Schema({
  // ID string that can be used to obtain image URI
  publicId: {
    type: String,
    required: true,
    alias: 'cloudId'
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
  createdAt: {
    type: Date
  }
}, {
  timestamps: true
});

imageSchema.pre('save', next => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
})

/**
 * findByCloudId
 *  @param {String} cloudId
 *  @returns {Image}
 */
imageSchema.statics.findByCloudId = function (cloudId) {
  return this.find({ publicId: cloudId })
};

/**
 * Orientation
 *  @returns {number}
 */
imageSchema.virtual('orientation').get(function () {
  if (this.width > this.height) {
    return ORIENTATION.LANDSCAPE;
  } else if (this.width < this.height) {
    return ORIENTATION.PORTRAIT;
  } else {
    return ORIENTATION.SQUARE;
  }
});

export default model('Image', imageSchema);
