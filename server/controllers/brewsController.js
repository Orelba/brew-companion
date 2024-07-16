import mongoose from 'mongoose'

import Brew from '../models/brew.js'
import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'
import BrewingMethod from '../models/brewingMethod.js'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'
import validateBrewData from '../middleware/validateBrewData.js'
import validateMongoDBObjectId from '../middleware/validateMongoDBObjectId.js'

const brew_list = asyncHandler(async (req, res, next) => {
  const allBrews = await Brew.find({})
    .sort({ date: -1 })
    .populate([{ path: 'coffee', populate: 'roastery' }, 'brewingMethod'])
    .exec()

  res.json(allBrews)
})

// TODO: if a brew appears twice get only the most recent one
const brew_list_recent = asyncHandler(async (req, res, next) => {
  const recentBrews = await Brew.find({})
    .sort({ date: -1 })
    .limit(10)
    .populate({
      path: 'coffee',
      select: '_id name',
    })
    .populate({
      path: 'brewingMethod',
      select: '_id name image',
    })
    .select('_id coffee brewingMethod')
    .exec()

  res.json(recentBrews)
})

const brew_create_post = [
  // Validate Data
  validateBrewData,

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req)

    // Create a brew object with escaped and trimmed data
    const brew = new Brew({
      coffee: req.body.coffee,
      brewingMethod: req.body.brewingMethod,
      grindSetting: req.body.grindSetting,
      time: req.body.time,
      dose: req.body.dose,
      yield: req.body.yield,
      temperature: req.body.temperature,
      rating: req.body.rating,
      notes: req.body.notes,
    })

    if (!errors.isEmpty()) {
      // There are errors
      res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    } else {
      // Form data is valid
      await brew.save()
      res.json({ message: 'Brew has been saved' })
    }
  }),
]

const brew_update_get = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res, next) => {
    const brew = await Brew.findById(req.params.id)

    // Handle document not found
    if (brew === null) {
      return res.status(404).json({ message: 'Brew Not Found' })
    }

    return res.json(brew)
  }),
]

const brew_update_put = [
  validateMongoDBObjectId,
  validateBrewData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const brew = new Brew({
      coffee: req.body.coffee,
      brewingMethod: req.body.brewingMethod,
      grindSetting: req.body.grindSetting,
      time: req.body.time,
      dose: req.body.dose,
      yield: req.body.yield,
      temperature: req.body.temperature,
      rating: req.body.rating,
      notes: req.body.notes,
      date: req.body.date,
      _id: req.params.id, // Use the same id to edit the brew
    })

    if (!errors.isEmpty()) {
      // There are errors
      return res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    }

    // Form data is valid, try to find the brew
    const brewToUpdate = await Brew.findByIdAndUpdate(req.params.id, brew)

    if (brewToUpdate) {
      // Success
      res.json({ message: 'Brew has been updated' })
    } else {
      // Brew doesn't exist
      res.status(404).json({ message: 'Brew not found' })
    }
  }),
]

const brew_delete_post = asyncHandler(async (req, res, next) => {
  console.log(req.params)
  const deletedBrew = await Brew.findByIdAndDelete(req.params.id)

  if (deletedBrew) {
    res.json({ message: 'Brew deleted successfuly' })
  } else {
    res.status(404).json({ message: 'Brew not found' })
  }
})

export {
  brew_list,
  brew_list_recent,
  brew_create_post,
  brew_update_get,
  brew_update_put,
  brew_delete_post,
}
