import express from 'express'
import cookieParser from 'cookie-parser'
import apiLimiter from './config/rateLimit.js'
import logger from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import createError from 'http-errors'
import passport from 'passport'
import passportConfig from './config/passport.js'

// API Router
import indexRouter from './routes/api/index.js'

const app = express()

// Trust the first proxy, needed for reverse proxy setups (e.g., Fly.io, Railway, Heroku)
// Allows correct handling of secure cookies and req.ip / req.secure
app.set('trust proxy', 1)

// mongoDB connection setup
mongoose.set('strictQuery', false)
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(mongoDB)
}

app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Set secure HTTP response headers
app.use(
  helmet({
    // Disable CSP for simplicity as no assests are served
    contentSecurityPolicy: false,
  })
)

// Compress response bodies for all requests
app.use(compression())

// Initialize Passport and configure it
passportConfig(passport)
app.use(passport.initialize())

// Warn if not in production (cookies are not secure in dev mode)
if (process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  Warning: Running in development mode. Cookies are not marked secure.'
  )
}

// Main API router, uses rate limiting to prevent abuse
app.use('/api', apiLimiter, indexRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Error handler
app.use((err, req, res, next) => {
  // Determine if in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = isDevelopment
    ? { message: err.message, stack: err.stack }
    : {}

  // If the request is for an API endpoint, respond with JSON
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({
      message: err.message,
      error: isDevelopment ? { message: err.message, stack: err.stack } : {},
    })
  } else {
    // Otherwise, render the error page or send a plain text response
    res.status(err.status || 500).send(err.message || 'Internal Server Error')
  }
})

export default app
