import { body } from 'express-validator'

const validateUserEmail = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .normalizeEmail()
  .isEmail()
  .withMessage('Invalid email')

export { validateUserEmail }
