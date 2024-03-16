const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BrewingMethodSchema = new Schema({
  name: { type: String, required: true },
})

const collectionName = 'brewing_methods'

module.exports = mongoose.model(
  'BrewingMethod',
  BrewingMethodSchema,
  collectionName
)
