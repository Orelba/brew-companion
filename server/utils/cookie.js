// Refresh token options for consistency when setting and clearing the cookie
const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // cross-site safe in prod, relaxed in dev
  secure: process.env.NODE_ENV === 'production', // secure only in prod
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (used when setting the cookie)
}

export { refreshTokenCookieOptions }
