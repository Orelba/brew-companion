import { body } from 'express-validator'

const validateBrewData = [
  body('coffee', 'Coffee must be specified.').trim().isMongoId(),
  body('brewingMethod', 'Brewing method must be specified.').trim().isMongoId(),
  body('grindSetting', 'Grind setting must be specified.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('time', 'Time must be in the format of MM:SS or HH:MM:SS')
    .optional({ checkFalsy: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/),
  body('dose', 'Dose must be bigger than 0')
    .optional({ values: 'falsy' })
    .isNumeric()
    .withMessage('Dose must be a number')
    .isInt({ min: 1 })
    .toInt(),
  body('yield', 'Yield must be bigger than 0')
    .optional({ values: 'falsy' })
    .isNumeric()
    .withMessage('Yield must be a number')
    .isInt({ min: 1 })
    .toInt(),
  body('temperature', 'Temperature must be between 1 and 100 (Celsius)')
    .optional({ values: 'falsy' })
    .isNumeric()
    .withMessage('Temperature must be a number')
    .isInt({ min: 0, max: 100 })
    .toInt(),
  body('rating', 'Rating must be between 0 to 5').isInt({ min: 0, max: 5 }),
  body('notes').optional({ values: 'falsy' }).trim().escape(),
]

export default validateBrewData
