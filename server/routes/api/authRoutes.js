import { Router } from 'express'
import authenticate from '../../middleware/authenticate.js'
import {
  register,
  login,
  logout,
  forgotPassword,
  validatePasswordResetToken,
  resetPassword,
  refresh,
  users,
} from '../../controllers/authController.js'

const router = Router()

// Register a new user
router.post('/register', register)

// Log in an existing user
router.post('/login', login)

// Log out the current user
router.get('/logout', logout)

// Request a password reset link
router.post('/reset-password', forgotPassword)

// Verify a password reset token
router.post('/reset-password/validate/:token', validatePasswordResetToken)

// Reset password using the provided token
router.post('/reset-password/:token', resetPassword)

// Refresh the access token
router.post('/refresh', refresh)

// TODO: CHECK IF NEEDED. Retrieve a list of users.
router.get('/users', authenticate, users)

export default router
