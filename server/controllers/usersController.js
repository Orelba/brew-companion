import User from '../models/user.js'
import Brew from '../models/brew.js'
import Coffee from '../models/coffee.js'
import Roastery from '../models/roastery.js'
import { refreshTokenCookieOptions } from '../utils/cookie.js'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import {
  validateUserPassword,
  validateUserPasswordConfirmation,
} from '../middleware/validateUserPassword.js'

const getUserProfile = asyncHandler((req, res, _next) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const user = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
  }

  res.json(user)
})

// TODO: Implement user profile update
const updateUserProfile = []

const changePassword = [
  validateUserPassword('currentPassword'),
  validateUserPassword('newPassword'),
  validateUserPasswordConfirmation('confirmNewPassword', 'newPassword'),
  asyncHandler(async (req, res, _next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ ...errors })
    }

    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(userId).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)

    await user.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  }),
]

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?.id
  const confirmation = req.body?.confirmation

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Normalize and check for "DELETE" and "מחק"
  const normalized = confirmation?.trim().toUpperCase()
  if (normalized !== 'DELETE' && normalized !== 'מחק') {
    return res
      .status(400)
      .json({ message: 'Delete confirmation word is incorrect' })
  }

  const session = await mongoose.startSession()
  try {
    // Delete all related data in a transaction
    session.startTransaction()

    await Brew.deleteMany({ userId }).session(session)
    await Coffee.deleteMany({ userId }).session(session)
    await Roastery.deleteMany({ userId }).session(session)
    await User.findByIdAndDelete(userId).session(session)

    await session.commitTransaction()

    // Clear the refresh token cookie
    const { maxAge, ...clearCookieOptions } = refreshTokenCookieOptions
    res.clearCookie('refreshToken', clearCookieOptions)

    return res
      .status(200)
      .json({ message: 'Account and all related data deleted' })
  } catch (err) {
    // If any operation fails, abort the transaction
    await session.abortTransaction()
    return res
      .status(500)
      .json({ message: 'Failed to delete account. Nothing was removed.' })
  } finally {
    session.endSession()
  }
})

export { getUserProfile, updateUserProfile, changePassword, deleteAccount }
