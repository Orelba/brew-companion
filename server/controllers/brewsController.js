import Brew from '../models/brew.js'

import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import validateBrewData from '../middleware/validateBrewData.js'
import validateMongoDBObjectId from '../middleware/validateMongoDBObjectId.js'

const brew_list = asyncHandler(async (req, res, next) => {
  const allBrews = await Brew.find({ userId: req.user.id })
    .sort({ date: -1 })
    .populate([{ path: 'coffee', populate: 'roastery' }, 'brewingMethod'])
    .exec()

  res.json(allBrews)
})

// TODO: if a brew appears twice get only the most recent one
const brew_list_recent = asyncHandler(async (req, res, next) => {
  const recentBrews = await Brew.find({ userId: req.user.id })
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
      userId: req.user.id,
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

    // Check if the brew belongs to the authenticated user
    if (brew.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access Denied: Not your brew' })
    }

    return res.json(brew)
  }),
]

const brew_update_put = [
  validateMongoDBObjectId,
  validateBrewData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    // Find the brew by its ID to check ownership before updating
    const brewToUpdate = await Brew.findById(req.params.id)

    if (!brewToUpdate) {
      return res.status(404).json({ message: 'Brew not found' })
    }

    // Check if the brew belongs to the authenticated user
    if (brewToUpdate.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'Access Denied: This brew belongs to another user.',
      })
    }

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    }

    // If no errors, proceed with the update
    const updatedBrew = await Brew.findByIdAndUpdate(req.params.id, {
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
      userId: req.user.id, // Retaining the userId for ownership verification
      _id: req.params.id, // Ensure the same ID is used to edit the brew
    })

    if (!updatedBrew) {
      return res.status(400).json({ message: 'Brew update failed' })
    }

    // Success
    res.json({ message: 'Brew has been updated' })
  }),
]

const brew_delete_post = asyncHandler(async (req, res, next) => {
  // Find the brew to check ownership before deleting
  const brewToDelete = await Brew.findById(req.params.id)

  // If brew is not found, send the "Brew not found" message
  if (!brewToDelete) {
    return res.status(404).json({ message: 'Brew not found' })
  }

  // Check if the brew belongs to the authenticated user
  if (brewToDelete.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access Denied: Not your brew' })
  }

  // Proceed to delete the brew if ownership check passes
  await Brew.findByIdAndDelete(req.params.id)

  res.json({ message: 'Brew deleted successfully' })
})

export {
  brew_list,
  brew_list_recent,
  brew_create_post,
  brew_update_get,
  brew_update_put,
  brew_delete_post,
}
