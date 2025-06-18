import passport from 'passport'

const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, _info) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Remove password from the user object to ensure sensitive information is not exposed
    user.password = undefined

    // Attach the authenticated user to the request object
    req.user = user

    next()
  })(req, res, next) // Immediately invoke the authenticate function
}

export default authenticate
