import { Router } from 'express'
import authenticate from '../../middleware/authenticate.js'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteAccount,
} from '../../controllers/usersController.js'

const router = Router()

// Get the current authenticated user's information
router.get('/me', authenticate, getUserProfile)

// Update the current authenticated user's profile
router.patch('/me', authenticate, updateUserProfile)

// Change the current authenticated user's password
router.put('/me/change-password', authenticate, changePassword)

// Delete the current authenticated user's account
router.delete('/me', authenticate, deleteAccount)

export default router
