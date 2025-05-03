import Roastery from '../models/roastery.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const roasteriesList = asyncHandler(async (req, res, next) => {
  const allRoasteries = await Roastery.find({ userId: req.user.id }).exec()
  res.json(allRoasteries)
})

export { roasteriesList }
