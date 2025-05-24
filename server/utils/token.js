import jwt from 'jsonwebtoken'

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '30m', // fallback to 30 minutes
  })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_TTL || '30d', // fallback to 30 days
  })
}

export { generateAccessToken, generateRefreshToken }
