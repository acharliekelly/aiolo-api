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
      type: String,
      default: 'completed'
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

/**
 * findByTag
 *  @param {String} tagStr the tag
 */
gallerySchema.statics.findByTag = function (tagStr) {
  return this.find({ tag: tagStr })
};

export default model('Gallery', gallerySchema);
