import { body } from 'express-validator'

const validateUserPassword = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`Missing ${fieldName}`)
    .isLength({ min: 8 })
    .withMessage(`${fieldName} must be at least 8 characters long`)

const validateUserPasswordConfirmation = (confirmField, originalField) =>
  body(confirmField)
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body[originalField]) {
        throw new Error('Passwords do not match')
      }
      return true
    })

export { validateUserPassword, validateUserPasswordConfirmation }
