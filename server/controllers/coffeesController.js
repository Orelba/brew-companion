import Coffee from '../models/coffee.js'
import Brew from '../models/brew.js'
import mongoose from 'mongoose'

import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import validateCoffeeData from '../middleware/validateCoffeeData.js'
import validateMongoDBObjectId from '../middleware/validateMongoDBObjectId.js'

const coffeeList = asyncHandler(async (req, res, next) => {
  const allCoffees = await Coffee.find({ userId: req.user.id })
    .populate('roastery')
    .sort({ createdAt: -1 })
    .exec()

  res.json(allCoffees)
})

const coffeeCreatePost = [
  validateCoffeeData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are validation errors in the form
      return res.status(422).json({
        message: 'There are validation errors in the form',
        ...errors,
      })
    }

    const coffee = new Coffee({
      name: req.body.name,
      roastery: req.body.roastery,
      rating: req.body.rating,
      userId: req.user.id,
    })

    // Form data is valid
    await coffee.save()
    res.json({ message: 'Coffee has been saved' })
  }),
]

const coffeeUpdateGet = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res, next) => {
    const coffeeId = req.params.id
    const userId = req.user.id

    const coffee = await Coffee.findOne({ _id: coffeeId, userId })
      .populate('roastery')
      .exec()

    if (!coffee) {
      return res
        .status(404)
        .json({ message: 'Coffee not found or unauthorized' })
    }

    return res.json(coffee)
  }),
]

const coffeeUpdatePut = [
  validateMongoDBObjectId,
  validateCoffeeData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    }

    const coffeeId = req.params.id
    const userId = req.user.id

    // Attempt to find and update the coffee document that belongs to the user
    const updatedCoffee = await Coffee.findOneAndUpdate(
      { _id: coffeeId, userId }, // Ensure the coffee belongs to the current user
      {
        name: req.body.name,
        roastery: req.body.roastery,
        rating: req.body.rating,
      },
      // Run schema validations during update
      { runValidators: true }
    )

    // Handle case where coffee doesn't exist or doesn't belong to the user
    if (!updatedCoffee) {
      return res
        .status(404)
        .json({ message: 'Coffee not found or unauthorized' })
    }

    // Success
    res.json({ message: 'Coffee has been updated' })
  }),
]

const coffeeToggleArchiveStatusPatch = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res) => {
    const coffeeId = req.params.id
    const userId = req.user.id
    const { archived } = req.body

    // Validate that archived is either true or false
    if (typeof archived !== 'boolean') {
      console.log('Archived type: ', typeof archived)
      return res
        .status(400)
        .json({ message: '`archived` must be true or false' })
    }

    // Find the coffee document by ID and user ID, and update the archived status
    const coffee = await Coffee.findOneAndUpdate(
      { _id: coffeeId, userId }, // Ensure the coffee belongs to the authenticated user
      { archived } // Update the archived field
    )

    // If coffee not found or unauthorized, return an error
    if (!coffee) {
      return res
        .status(404)
        .json({ message: 'Coffee not found or unauthorized' })
    }

    // Return a success message
    res.json({
      message: `Coffee has been ${archived ? 'archived' : 'unarchived'}`,
    })
  }),
]

const coffeeDeleteWithBrews = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res, next) => {
    const coffeeId = req.params.id
    const userId = req.user.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const coffee = await Coffee.findOne({
        _id: coffeeId,
        userId,
      }).session(session)
      if (!coffee) {
        await session.abortTransaction()
        return res
          .status(404)
          .json({ message: 'Coffee not found or unauthorized' })
      }

      await Brew.deleteMany({ coffee: coffeeId }).session(session)
      await Coffee.findByIdAndDelete(coffeeId).session(session)

      await session.commitTransaction()
      return res
        .status(200)
        .json({ message: 'Coffee and related brews deleted' })
    } catch (error) {
      await session.abortTransaction()
      console.error('Transaction aborted due to error:', error)
      return res.status(500).json({ message: 'Error deleting coffee' })
    } finally {
      session.endSession()
    }
  }),
]

export {
  coffeeList,
  coffeeCreatePost,
  coffeeUpdateGet,
  coffeeUpdatePut,
  coffeeToggleArchiveStatusPatch,
  coffeeDeleteWithBrews,
}
