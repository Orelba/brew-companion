const Coffee = require('../models/coffee')
const Roastery = require('../models/roastery')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

exports.coffee_list = asyncHandler(async (req, res, next) => {
  const allCoffees = await Coffee.find({}).populate('roastery').exec()
  res.json(allCoffees)
})

exports.coffee_create_post = asyncHandler(async (req, res, next) => {})
