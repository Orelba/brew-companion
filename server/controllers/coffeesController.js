import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const coffeeList = asyncHandler(async (req, res, next) => {
  const allCoffees = await Coffee.find({ userId: req.user.id })
    .populate('roastery')
    .exec()

  res.json(allCoffees)
})

const coffeeCreatePost = asyncHandler(async (req, res, next) => {})

export { coffeeList, coffeeCreatePost }
