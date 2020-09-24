import { Schema, model } from 'mongoose';

const progressListSchema = new Schema({
  artworkId: {
    type: String,
    required: true
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ]
}, {
  timestamps: true
});

export default model('ProgressList', progressListSchema);
