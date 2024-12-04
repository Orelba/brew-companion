import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CoffeeSchema = new Schema({
  name: { type: String, required: true },
  roastery: { type: Schema.Types.ObjectId, ref: 'Roastery', required: true },
  archived: { type: Boolean, default: false, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export default mongoose.model('Coffee', CoffeeSchema)
