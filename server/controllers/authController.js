import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// TODO: Consider changing the messages sent and use the i18n translation instead

const register = async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ password: 'Password must be at least 8 characters long' })
    }

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] })

    if (user) {
      if (user.email === email) {
        return res.status(400).json({ email: 'Email already exists' })
      }

      if (user.username === username) {
        return res.status(400).json({ username: 'Username already exists' })
      }
    }

    // Create a new user
    user = new User({ username, email, password })

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Save the user to the database
    await user.save()

    // Remove password from the response
    user.password = undefined

    // Respond with the created user
    res.status(201).json(user)
  } catch (error) {
    // Handle server errors
    next(error)
  }
}

// Check about refresh and access tokens
const login = async (req, res, next) => {
  const { username, password } = req.body

  try {
    // Find the user by username
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({ username: 'User not found' })
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ password: 'Incorrect password' })
    }

    // Create a JWT payload
    const payload = { id: user.id, username: user.username, email: user.email }

    // Sign the JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d', // valid for 1 month
    })

    // Respond with the token
    res.json({ success: true, token: `Bearer ${token}` })
  } catch (error) {
    // Handle server errors
    next(error)
  }
}

export { register, login }
