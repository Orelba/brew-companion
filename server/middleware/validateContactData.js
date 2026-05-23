import { body } from 'express-validator'
import { validateUserEmail } from './validateUserEmail.js'

const validateContactName = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')

const validateContactCategory = body('category')
  .isIn(['general', 'feedback', 'bug'])
  .withMessage('Invalid category')

const validateContactMessage = body('message')
  .trim()
  .notEmpty()
  .withMessage('Message is required')

const validateContactData = [
  validateContactName,
  validateUserEmail,
  validateContactCategory,
  validateContactMessage,
]

export { validateContactData }
