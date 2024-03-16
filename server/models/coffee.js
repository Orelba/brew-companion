const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CoffeeSchema = new Schema({
  name: { type: String, required: true },
  roastery: { type: Schema.Types.ObjectId, ref: 'Roastery', required: true },
  archived: { type: Boolean, default: false, required: true },
})

module.exports = mongoose.model('Coffee', CoffeeSchema)
