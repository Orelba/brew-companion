import jwt from 'jsonwebtoken'

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m', // valid for 15 minutes
  })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d', // valid for 30 days
  })
}

export { generateAccessToken, generateRefreshToken }
