import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CoffeeSchema = new Schema({
  name: { type: String, required: true },
  roastery: { type: Schema.Types.ObjectId, ref: 'Roastery', required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  archived: { type: Boolean, default: false, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Coffee', CoffeeSchema)
