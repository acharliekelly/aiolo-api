import { Schema, model } from 'mongoose';

const progressListSchema = new Schema({
  artworkId: {
    type: String,
    required: true
  },
  progressImages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProgressImage'
    }
  ]
}, {
  timestamps: true
});

progressListSchema.methods.sortBySequence = async function () {
  try {
    if (!this.populated('progressImages')) {
      await this.populate('progressImages');
    }
    this.progressImages.sort((imgA, imgB) => {
      return imgA.sequenceOrder - imgB.sequenceOrder
    })
  } catch (err) {
    console.log(err);
  }
};

progressListSchema.methods.sortByDate = async function () {
  try {
    if (!this.populated('progressImages')) {
      await this.populate('progressImages');
    }
    this.progressImages.sort((imgA, imgB) => {
      return imgA.dateTaken - imgB.dateTaken
    })
  } catch (err) {
    console.log(err);
  }
};

progressListSchema.statics.findByArtwork = function (artworkId) {
  return this.findOne({ artworkId })
};

export default model('ProgressList', progressListSchema);
