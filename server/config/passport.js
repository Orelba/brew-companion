import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user.js'

const opts = {
  // Extract JWT from the authorization header as a Bearer token
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // The secret key to verify the JWT
  secretOrKey: process.env.JWT_SECRET,
}

const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        // Find the user by the ID in the JWT payload
        const user = await User.findById(payload.id)

        // If the user is found, return the user object
        if (user) {
          return done(null, user)
        }
        // If the user is not found, return false (unsuccessful authentication)
        return done(null, false)
      } catch (error) {
        // If an error occurs, pass the error to done
        return done(error)
      }
    })
  )
}

export default passportConfig
