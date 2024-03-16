import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BrewingMethodSchema = new Schema({
  name: { type: String, required: true },
})

const collectionName = 'brewing_methods'

export default mongoose.model(
  'BrewingMethod',
  BrewingMethodSchema,
  collectionName
)
