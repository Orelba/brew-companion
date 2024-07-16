import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import createError from 'http-errors'

// API Router
import indexRouter from './routes/api/index.js'

const app = express()

// mongoDB connection setup
mongoose.set('strictQuery', false)
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(mongoDB)
}

app.use(logger('dev'))
app.use(
  cors()
  // {
  //   origin: [''], // TODO: Change to frontend address
  //   methods: ['POST', 'GET', 'PUT', 'DELETE'],
  //   credentials: true,
  // }
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Set secure HTTP response headers, allow Google fonts to be loaded
app.use(
  helmet()
  // {
  //   contentSecurityPolicy: {
  //     directives: {
  //       'font-src': ['self', ''] // TODO: Add CSP Directives
  //     }
  //   }
  // }
)

// Compress response bodies for all requests
app.use(compression())

app.use('/api', indexRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Error handler
app.use((err, req, res, next) => {
  // Determine if in development mode
  const isDevelopment = req.app.get('env') === 'development'

  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = isDevelopment ? err : {}

  // If the request is for an API endpoint, respond with JSON
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.status || 500).json({
      message: err.message,
      error: isDevelopment ? err : {},
    })
  } else {
    // Otherwise, render the error page or send a plain text response
    res.status(err.status || 500).send(err.message || 'Internal Server Error')
  }
})

export default app
