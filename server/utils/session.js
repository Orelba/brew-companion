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
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    lastUsedAt: new Date(),
  }
}

export { createSession }
