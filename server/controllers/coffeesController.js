import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const coffee_list = asyncHandler(async (req, res, next) => {
  const allCoffees = await Coffee.find({ userId: req.user.id })
    .populate('roastery')
    .exec()

  res.json(allCoffees)
})

const coffee_create_post = asyncHandler(async (req, res, next) => {})

export { coffee_list, coffee_create_post }
