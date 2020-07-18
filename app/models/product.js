const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Original Artwork'
  },
  price: {
    type: Number,
    required: true
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  },
  productImageUri: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Product', productSchema)
