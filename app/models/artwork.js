import { Schema, model } from 'mongoose';

const artworkSchema = new Schema({
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  publicId: {
    type: String,
    required: true,
    alias: 'cloudId'
  },
  artworkType: {
    type: String,
    default: 'picture'
  },
  copyProtect: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  medium: {
    type: String
  },
  surface: {
    type: String,
    default: 'paper'
  },
  completed: {
    type: Date
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    depth: {
      type: Number
    },
    units: {
      type: String,
      default: 'inches'
    }
  },
  location: {
    place: {
      type: String
    },
    description: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  galleries: [{ type: Schema.Types.ObjectId, ref: 'Gallery' }],
  filters: {
    subject: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    location: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    style: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    season: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    color: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    period: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    medium: { type: Schema.Types.ObjectId, ref: 'Gallery' },
    album: { type: Schema.Types.ObjectId, ref: 'Gallery' }
  }
}, {
  timestamps: true
});

/**
 * Material: <medium> on <surface>
 */
artworkSchema.virtual('material')
  .get(function () {
    let material = '';

    if (this.medium && this.surface) {
      material = this.medium + ' on ' + this.surface;
    } else if (this.medium) {
      // give medium alone, but not surface alone
      material = this.medium;
    }
    return material;
  })
  .set(function (material) {
    const expr = /(.+) on (.+)/i;
    let mtch = expr.exec(material);
    if (mtch) {
      this.medium = mtch[1];
      this.surface = mtch[0];
    }
  });

/**
 * Size: w" x h"
 */
artworkSchema.virtual('size')
  .get(function () {
    let size = '';
    // const units = this.dimensions.units === 'inches' ? '"' : this.dimensions.units;
    if (this.dimensions) {
      const w = this.dimensions.width;
      const h = this.dimensions.height;
      if (this.dimensions.width && this.dimensions.height) {
        size = `${w}" x ${h}"`;

        if (this.dimensions.depth) {
          size += ` ${this.dimensions.depth}"`;
        }
      }
    }
    return size;
  })
  .set(function (size) {
    const expr = /(\d+)"\s?x\s?(\d+)"/i;
    let mtch = expr.exec(size);
    if (mtch) {
      this.dimensions.width = mtch[1];
      this.dimensions.height = mtch[2];
    }
  });

artworkSchema.statics.findByCloudId = function (cloudId) {
  return this.find({ publicId: cloudId })
};

artworkSchema.statics.findByTitle = function (title) {
  return this.find({ title: new RegExp(title, 'i') });
};

export default model('Artwork', artworkSchema);
