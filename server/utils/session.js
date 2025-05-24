import ms from 'ms'

// refresh token time-to-live (TTL) configuration
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || '30d' // fallback to 30 days
const refreshTokenTTLInMs = ms(refreshTokenTTL)

const createSession = (req, refreshToken) => {
  return {
    token: refreshToken,
    ip:
      req.ip ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      null,
    userAgent: req.headers['user-agent'] || null,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + refreshTokenTTLInMs),
    lastUsedAt: new Date(),
  }
}

export { createSession }
