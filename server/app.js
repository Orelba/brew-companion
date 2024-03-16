import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
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
  //   methods: ['POST', 'GET'],
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

// TODO: No public dir, Check if needed
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', indexRouter)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err)
})

export default app
