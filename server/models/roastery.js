import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RoasterySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Roastery', RoasterySchema)
