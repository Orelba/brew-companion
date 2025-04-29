import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RoasterySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Roastery', RoasterySchema)
