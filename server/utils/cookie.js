// Refresh token options for consistency when setting and clearing the cookie
const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (used when setting the cookie)
}

export { refreshTokenCookieOptions }
