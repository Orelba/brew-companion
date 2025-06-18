import BrewingMethod from '../models/brewingMethod.js'

import asyncHandler from 'express-async-handler'

const brewingMethodsList = asyncHandler(async (req, res, _next) => {
  const allBrewingMethods = await BrewingMethod.find({}).exec()
  res.json(allBrewingMethods)
})

export { brewingMethodsList }
