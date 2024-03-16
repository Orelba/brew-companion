const Brew = require('../models/brew')
const Coffee = require('../models/coffee')
const Roastery = require('../models/roastery')
const BrewingMethod = require('../models/brewingMethod')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.brew_list = asyncHandler(async (req, res, next) => {
  const allBrews = await Brew.find({})
    .populate([{ path: 'coffee', populate: 'roastery' }, 'method'])
    .exec()

  res.json(allBrews)
})

exports.brew_create_post = asyncHandler(async (req, res, next) => {})
