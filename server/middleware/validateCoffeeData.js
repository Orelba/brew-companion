import { body } from 'express-validator'
import Roastery from '../models/roastery.js'

const validateCoffeeData = [
  body('name')
    .isString()
    .withMessage('Coffee name must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Coffee name is required')
    .isLength({ max: 70 })
    .withMessage("Coffee name can't be longer than 70 characters"),
  body('roastery')
    .trim()
    .isMongoId()
    .withMessage('Invalid roastery ID')
    .bail()
    .custom(async (value, { req }) => {
      const exists = await Roastery.findOne({ _id: value, userId: req.user.id })
      if (!exists) {
        return Promise.reject('Roastery not found or does not belong to user')
      }
      return true
    }),
  body('rating', 'Rating must be between 0 to 5').isInt({ min: 0, max: 5 }),
]

export default validateCoffeeData
