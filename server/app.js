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

// Environment validation - critical variables
const requiredEnvVars = [
  'NODE_ENV',
  'FRONTEND_URL',
  'CORS_ORIGINS',
  'MONGODB_URI',
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET',
  'SMTP_USER',
  'SMTP_PASS',
]

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ ${envVar} environment variable is required`)
    process.exit(1)
  }
})

const app = express()

// Trust the first proxy, needed for reverse proxy setups (e.g., Fly.io, Railway, Heroku)
// Allows correct handling of secure cookies and req.ip / req.secure
app.set('trust proxy', 1)

// mongoDB connection setup
mongoose.set('strictQuery', false)
const mongoDB = process.env.MONGODB_URI

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected')
})

main().catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err)
  process.exit(1)
})

async function main() {
  await mongoose.connect(mongoDB)
}

app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Set secure HTTP response headers
app.use(
  helmet({
    // Disable CSP for simplicity as no assets are served
    contentSecurityPolicy: false,
  })
)

// Compress response bodies for all requests
app.use(compression())

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS.split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .map((value) => new URL(value).origin)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

// Body parsing and cookies
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

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
app.use((err, req, res, _next) => {
  // Determine if in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'
  const errorDetails = isDevelopment
    ? { message: err.message, stack: err.stack }
    : {}

  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = errorDetails

  // If the request is for an API endpoint, respond with JSON
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({
      message: err.message,
      error: errorDetails,
    })
  } else {
    // Otherwise, render the error page or send a plain text response
    res.status(err.status || 500).send(err.message || 'Internal Server Error')
  }
})

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...')
  try {
    await mongoose.connection.close()
    console.log('✅ MongoDB connection closed')
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error)
  }
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received (Ctrl+C), shutting down gracefully...')
  try {
    await mongoose.connection.close()
    console.log('✅ MongoDB connection closed')
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error)
  }
  process.exit(0)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

export default app
