const mongoose = require('mongoose')

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
  notes: { type: String },
  date: { type: Date, default: Date.now },
})



module.exports = mongoose.model('Brew', BrewSchema)
