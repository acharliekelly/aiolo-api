
import { Schema, model } from 'mongoose'

const tokenSchema = new Schema({
  tokenId: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  }},
{
  timestamps: true
})

const Token = model('Token', tokenSchema)

export default Token
