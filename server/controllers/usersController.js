import User from '../models/user.js'

import asyncHandler from 'express-async-handler'

const getCurrentUser = asyncHandler((req, res, next) => {
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


export { getCurrentUser }