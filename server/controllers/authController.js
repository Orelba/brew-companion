import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/token.js'
import { refreshTokenCookieOptions } from '../utils/cookie.js'
import { createSession } from '../utils/session.js'
import { sendEmail } from '../utils/email.js'
import { createHash } from 'node:crypto'

import asyncHandler from 'express-async-handler'
import { body, validationResult } from 'express-validator'
import { validateUserEmail } from '../middleware/validateUserEmail.js'
import {
  validateUserPassword,
  validateUserPasswordConfirmation,
} from '../middleware/validateUserPassword.js'

const register = [
  body('username', 'Username must be at least 3 characters long')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  validateUserEmail,
  validateUserPassword('password'),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ ...errors })
    }

    const { username, email, password } = req.body

    // Check if user already exists
    const duplicate = await User.findOne({ $or: [{ email }, { username }] })
    if (duplicate) {
      const duplicateErrors = []

      if (duplicate.email === email) {
        duplicateErrors.push({
          message: 'Email already exists',
          path: 'email',
        })
      }

      if (duplicate.username === username) {
        duplicateErrors.push({
          message: 'Username already exists',
          path: 'username',
        })
      }

      return res.status(409).json({ errors: duplicateErrors })
    }

    // Create a new user
    const user = new User({ username, email, password })

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save the user to the database
    await user.save()

    // Respond with the created user
    res.status(201).json({ message: 'The user was created successfully' })
  }),
]

const login = [
  validateUserEmail,
  validateUserPassword('password'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ ...errors })
    }

    const { email, password } = req.body

    // Find the user by username
    const user = await User.findOne({ email })

    if (!user) {
      // User not found
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      // Invalid password
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create a JWT payload
    const payload = { id: user.id, username: user.username, email: user.email }

    // Sign the JWT tokens
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Limit to max 5 sessions
    if (user.sessions.length >= 5) {
      user.sessions.sort((a, b) => a.createdAt - b.createdAt)
      user.sessions.shift()
    }

    // Create a new session and add it to the user's sessions
    // This function creates a session object with the refresh token and other details
    user.sessions.push(createSession(req, refreshToken))
    await user.save()

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    // Respond with the token
    res.json({ success: true, accessToken })
  }),
]

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.refreshToken) {
    return res.sendStatus(204)
  }
  const refreshToken = cookies.refreshToken
  const { maxAge, ...clearCookieOptions } = refreshTokenCookieOptions

  const user = await User.findOne({ 'sessions.token': refreshToken }).exec()
  if (!user) {
    res.clearCookie('refreshToken', clearCookieOptions)
    return res.sendStatus(204)
  }

  // Remove the session with the matching token
  user.sessions = user.sessions.filter(
    (session) => session.token !== refreshToken
  )
  await user.save()

  res.clearCookie('refreshToken', clearCookieOptions)
  res.sendStatus(204)
})

const forgotPassword = [
  validateUserEmail,
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ ...errors })
    }

    // Find the user by email
    const { email } = req.body
    const user = await User.findOne({ email })

    // Ensures consistent messaging to prevent email enumeration
    const successResponseMessage =
      'If an account with that email exists, a reset link has been sent.'

    if (user) {
      const resetToken = user.createResetPasswordToken()

      await user.save()

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

      const emailMessage = `We received a request to reset your password. Use the link below to set a new password:\n\n${resetUrl}\n\nThis link is valid for 10 minutes.`

      // Try sending the email with the token
      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset Request',
          message: emailMessage,
        })

        return res.status(200).json({
          success: true,
          message: successResponseMessage,
        })
      } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        await user.save()

        console.error('Error sending password reset email:', error)
        return next(
          new Error(
            'Failed to send the password reset email. Please try again later.'
          )
        )
      }
    }

    res.status(200).json({
      message: successResponseMessage,
    })
  }),
]

const validatePasswordResetToken = asyncHandler(async (req, res, next) => {
  // Hash the provided token using SHA-256
  const token = createHash('sha256').update(req.params.token).digest('hex')

  // Search for a user with the hashed token and check if the token has not expired
  const user = await User.findOne({
    passwordResetToken: token, // Check for the token in the database
    passwordResetTokenExpires: { $gt: Date.now() }, // Ensure the token has not expired
  })

  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired.' })
  }

  res.status(200).json({ message: 'Token is valid.' })
})

const resetPassword = [
  validateUserPassword('password'),
  validateUserPasswordConfirmation('confirmPassword', 'password'),
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ ...errors })
    }

    // Hash the provided token using SHA-256
    const token = createHash('sha256').update(req.params.token).digest('hex')

    // Search for a user with the hashed token and check if the token has not expired
    const user = await User.findOne({
      passwordResetToken: token, // Check for the token in the database
      passwordResetTokenExpires: { $gt: Date.now() }, // Ensure the token has not expired
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Token is invalid or has expired.' })
    }

    // Hash the password before saving the user
    const { password } = req.body
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Clear the password reset token and expiration, and update the password change timestamp
    user.passwordResetToken = undefined
    user.passwordResetTokenExpires = undefined
    user.passwordChangedAt = Date.now()

    // Clear and invalidate all sessions for the user
    user.sessions = []

    user.save()

    return res.status(200).json({
      success: true,
      message: 'The password has been changed successfully.',
    })
  }),
]

const refresh = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies

  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' })
  }

  const oldRefreshToken = cookies.refreshToken

  // Find the user who has a session with this refresh token
  const user = await User.findOne({ 'sessions.token': oldRefreshToken }).exec()
  if (!user) {
    // Refresh token not associated with any user
    return res.status(403).json({ message: 'Invalid refresh token' })
  }

  // Find the index of the session with the old refresh token
  const oldSessionIndex = user.sessions.findIndex(
    (session) => session.token === oldRefreshToken
  )

  // If the session is not found, return an error
  if (oldSessionIndex === -1) {
    return res.status(403).json({ message: 'Session not found' })
  }

  // Get the session object from the user's sessions
  const session = user.sessions[oldSessionIndex]

  // Database-level session expiry check (for proactive cleanup)
  // Without this, expired sessions would live in the DB forever until manually cleaned up
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    user.sessions.splice(oldSessionIndex, 1) // remove expired session
    await user.save()
    return res.status(403).json({ message: 'Session expired' })
  }

  // Verify the refresh token signature and payload
  jwt.verify(
    oldRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || String(user.id) !== String(decoded.id)) {
        return res.status(403).json({ message: 'Invalid refresh token' })
      }

      // Create a payload for the new tokens based on the decoded data
      const payload = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      }

      const newAccessToken = generateAccessToken(payload)
      const newRefreshToken = generateRefreshToken(payload)

      // Replace the old session with a new one
      const previousCreatedAt = session.createdAt
      user.sessions[oldSessionIndex] = {
        ...createSession(req, newRefreshToken),
        createdAt: previousCreatedAt, // Keep the original session creation time
      }

      // Save the user with the updated session
      try {
        await user.save()
      } catch (error) {
        console.error('Failed to save user session:', error)
        return res.status(500).json({ message: 'Failed to update session' })
      }

      // Send new refresh token in cookie
      res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)

      res.json({ accessToken: newAccessToken })
    }
  )
})

export {
  register,
  login,
  logout,
  forgotPassword,
  validatePasswordResetToken,
  resetPassword,
  refresh,
}
