import Brew from '../models/brew.js'
import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'
import BrewingMethod from '../models/brewingMethod.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'

const brew_list = asyncHandler(async (req, res, next) => {
  const allBrews = await Brew.find({})
    .populate([{ path: 'coffee', populate: 'roastery' }, 'method'])
    .exec()

  res.json(allBrews)
})

const brew_create_post = asyncHandler(async (req, res, next) => {})

export { brew_list, brew_create_post }
