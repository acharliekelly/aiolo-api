import { Schema, model } from 'mongoose';

const progressImageSchema = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  dateTaken: {
    type: Date
  },
  sequenceOrder: {
    type: Number,
    min: 0,
    max: 99
  },
  isFinal: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

progressImageSchema.statics.findByImageId = function (imageId) {
  return this.findOne({ image: imageId })
};

progressImageSchema.methods.isInitial = function () {
  return this.sequenceOrder === 0;
};

export default model('ProgressImage', progressImageSchema);
