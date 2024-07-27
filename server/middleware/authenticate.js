import passport from 'passport'

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user
    next()
  })(req, res, next)
}

export default authenticate
