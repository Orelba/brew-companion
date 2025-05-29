import { body } from 'express-validator'

const validateUserPassword = body('password')
  .notEmpty()
  .withMessage('Missing password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')

const validateUserPasswordConfirmation = body('confirmPassword')
  .notEmpty()
  .withMessage('Password confirmation is required')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  })

export { validateUserPassword, validateUserPasswordConfirmation }
