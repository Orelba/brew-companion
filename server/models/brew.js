import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BrewSchema = new Schema({
  coffee: { type: Schema.Types.ObjectId, ref: 'Coffee', required: true },
  method: {
    type: Schema.Types.ObjectId,
    ref: 'BrewingMethod',
    required: true,
  },
  grind_setting: { type: String, required: true },
  time: { type: String },
  dose: { type: Number, min: 1 },
  yield: { type: Number, min: 1 },
  temperature: { type: Number, min: 1, max: 100 },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  date: { type: Date, default: Date.now },
})

export default mongoose.model('Brew', BrewSchema)
