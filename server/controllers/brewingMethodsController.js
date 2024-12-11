import BrewingMethod from '../models/brewingMethod.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const brewingMethodsList = asyncHandler(async (req, res, next) => {
  const allBrewingMethods = await BrewingMethod.find({}).exec()
  res.json(allBrewingMethods)
})

export { brewingMethodsList }
