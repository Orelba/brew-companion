const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RoasterySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String },
})

module.exports = mongoose.model('Roastery', RoasterySchema)
