import mongoose from 'mongoose'

const Schema = mongoose.Schema

const RoasterySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Roastery', RoasterySchema)
