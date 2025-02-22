import Brew from '../models/brew.js'

import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import validateBrewData from '../middleware/validateBrewData.js'
import validateMongoDBObjectId from '../middleware/validateMongoDBObjectId.js'

const brewList = asyncHandler(async (req, res, next) => {
  const allBrews = await Brew.find({ userId: req.user.id })
    .sort({ date: -1 })
    .populate([{ path: 'coffee', populate: 'roastery' }, 'brewingMethod'])
    .exec()

  res.json(allBrews)
})

const brewListRecent = asyncHandler(async (req, res, next) => {
  const recentBrews = await Brew.aggregate([
    // Step 1: Match user by userId
    {
      $match: {
        userId: mongoose.Types.ObjectId.createFromHexString(req.user.id),
      },
    },

    // Step 2: Sort by date in descending order (most recent first)
    {
      $sort: {
        date: -1,
      },
    },

    // Step 3: Group by coffee and brewing method, keeping only the latest brew for each
    {
      $group: {
        _id: { coffee: '$coffee', brewingMethod: '$brewingMethod' }, // Unique pair of coffee and brewing method
        brewId: { $first: '$_id' }, // Keep the latest brewId
        coffee: { $first: '$coffee' }, // Keep the coffee reference
        brewingMethod: { $first: '$brewingMethod' }, // Keep the brewing method reference
      },
    },

    // Step 4: Lookup the coffee details (populate coffee and brewing method)
    {
      $lookup: {
        from: 'coffees', // The collection where coffee data is stored
        localField: 'coffee',
        foreignField: '_id',
        as: 'coffeeDetails',
      },
    },

    // Step 5: Lookup the brewing method details
    {
      $lookup: {
        from: 'brewing_methods', // The collection where brewing method data is stored
        localField: 'brewingMethod',
        foreignField: '_id',
        as: 'brewingMethodDetails',
      },
    },

    // Step 6: Project to format the output (custom format)
    {
      $project: {
        _id: '$brewId', // Use the _id from the grouped brew (latest brew)
        coffee: {
          _id: { $arrayElemAt: ['$coffeeDetails._id', 0] }, // Get coffee ID
          name: { $arrayElemAt: ['$coffeeDetails.name', 0] }, // Get coffee name
        },
        brewingMethod: {
          _id: { $arrayElemAt: ['$brewingMethodDetails._id', 0] }, // Get brewing method ID
          name: { $arrayElemAt: ['$brewingMethodDetails.name', 0] }, // Get brewing method name
          image: { $arrayElemAt: ['$brewingMethodDetails.image', 0] }, // Get brewing method image
        },
      },
    },
    // Step 7: Limit to the latest 10 unique combinations
    {
      $limit: 10,
    },
  ])

  res.json(recentBrews)
})

const brewCreatePost = [
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

const brewUpdateGet = [
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

const brewUpdatePut = [
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

const brewDeletePost = asyncHandler(async (req, res, next) => {
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
  brewList,
  brewListRecent,
  brewCreatePost,
  brewUpdateGet,
  brewUpdatePut,
  brewDeletePost,
}
