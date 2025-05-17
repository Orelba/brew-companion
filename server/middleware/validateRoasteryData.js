import { body } from 'express-validator'

const validateRoasteryData = [
  body('name')
    .isString()
    .withMessage('Roastery name must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Roastery name is required')
    .isLength({ max: 50 })
    .withMessage("Roastery name can't be longer than 50 characters"),
  body('country')
    .isString()
    .withMessage('Roastery country must be a string')
    .trim(),
  body('rating', 'Rating must be between 0 to 5').isInt({ min: 0, max: 5 }),
]

export default validateRoasteryData
