import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BrewSchema = new Schema({
  coffee: { type: Schema.Types.ObjectId, ref: 'Coffee', required: true },
  brewingMethod: {
    type: Schema.Types.ObjectId,
    ref: 'BrewingMethod',
    required: true,
  },
  grindSetting: { type: String, required: true },
  time: { type: String },
  dose: { type: Schema.Types.Mixed, min: 1 },
  yield: { type: Schema.Types.Mixed, min: 1 },
  temperature: { type: Schema.Types.Mixed, min: 0, max: 100 },
  rating: { type: Number, min: 0, max: 5 },
  notes: { type: String },
  date: { type: Date, default: Date.now },
})

export default mongoose.model('Brew', BrewSchema)
