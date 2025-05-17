import Roastery from '../models/roastery.js'
import Coffee from '../models/coffee.js'
import Brew from '../models/brew.js'
import mongoose from 'mongoose'

import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import validateRoasteryData from '../middleware/validateRoasteryData.js'
import validateMongoDBObjectId from '../middleware/validateMongoDBObjectId.js'

const roasteriesList = asyncHandler(async (req, res, next) => {
  const allRoasteries = await Roastery.find({ userId: req.user.id }).exec()
  res.json(allRoasteries)
})

const roasteryCreatePost = [
  validateRoasteryData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // There are validation errors in the form
      return res.status(422).json({
        message: 'There are validation errors in the form',
        ...errors,
      })
    }

    const userId = req.user.id

    const roastery = new Roastery({
      name: req.body.name,
      country: req.body.country,
      rating: req.body.rating,
      userId,
    })

    // Form data is valid
    await roastery.save()
    res.json({ message: 'Roastery has been saved' })
  }),
]

const roasteryUpdateGet = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res, next) => {
    const roasteryId = req.params.id
    const userId = req.user.id

    const roastery = await Roastery.findOne({ _id: roasteryId, userId })

    if (!roastery) {
      return res
        .status(404)
        .json({ message: 'Roastery not found or unauthorized' })
    }

    return res.json(roastery)
  }),
]

const roasteryUpdatePut = [
  validateMongoDBObjectId,
  validateRoasteryData,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    // If there are validation errors, return them
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'There are validation errors in the form', ...errors })
    }

    const roasteryId = req.params.id
    const userId = req.user.id

    // Attempt to find and update the roastery document that belongs to the user
    const updatedRoastery = await Roastery.findOneAndUpdate(
      { _id: roasteryId, userId }, // Ensure the coffee belongs to the current user
      {
        name: req.body.name,
        country: req.body.country,
        rating: req.body.rating,
      },
      // Run schema validations during update
      { runValidators: true }
    )

    // Handle case where roastery doesn't exist or doesn't belong to the user
    if (!updatedRoastery) {
      return res
        .status(404)
        .json({ message: 'Roastery not found or unauthorized' })
    }

    // Success
    res.json({ message: 'Roastery has been updated' })
  }),
]

const roasteryDeleteWithCoffeesAndBrews = [
  validateMongoDBObjectId,
  asyncHandler(async (req, res, next) => {
    const roasteryId = req.params.id
    const userId = req.user.id

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const roastery = await Roastery.findOne({
        _id: roasteryId,
        userId,
      }).session(session)
      if (!roastery) {
        await session.abortTransaction()
        return res
          .status(404)
          .json({ message: 'Roastery not found or unauthorized' })
      }

      // Find all coffee IDs from this roastery
      const coffees = await Coffee.find(
        { roastery: roasteryId },
        '_id'
      ).session(session)

      // Extract only the _id values from the coffee documents to use in $in query
      const coffeeIds = coffees.map((coffee) => coffee._id)

      // Delete brews that reference those coffees
      await Brew.deleteMany({ coffee: { $in: coffeeIds } }).session(session)

      // Delete coffees
      await Coffee.deleteMany({ roastery: roasteryId }).session(session)

      // Delete the roastery
      await Roastery.deleteOne({ _id: roasteryId }).session(session)

      await session.commitTransaction()
      return res
        .status(200)
        .json({ message: 'Roastery and related coffees and brews deleted' })
    } catch (error) {
      await session.abortTransaction()
      console.error('Transaction aborted due to error:', error)
      return res.status(500).json({ message: 'Error deleting roastery' })
    } finally {
      session.endSession()
    }
  }),
]

export {
  roasteriesList,
  roasteryCreatePost,
  roasteryUpdateGet,
  roasteryUpdatePut,
  roasteryDeleteWithCoffeesAndBrews,
}
