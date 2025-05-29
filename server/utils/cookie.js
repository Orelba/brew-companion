import ms from 'ms'

// refresh token time-to-live (TTL) configuration
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL || '30d' // fallback to 30 days
const refreshTokenTTLInMs = ms(refreshTokenTTL)

// Refresh token options for consistency when setting and clearing the cookie
const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // cross-site safe in prod, relaxed in dev
  secure: process.env.NODE_ENV === 'production', // secure only in prod
  path: '/', // cookie is valid for the entire site
  maxAge: refreshTokenTTLInMs, // used when setting the cookie
}

export { refreshTokenCookieOptions }
