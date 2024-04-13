import Roastery from '../models/roastery.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const roasteries_list = asyncHandler(async (req, res, next) => {
  const allRoasteries = await Roastery.find({}).exec()
  res.json(allRoasteries)
})

export { roasteries_list }