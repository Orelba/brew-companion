const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')

const indexRouter = require('./routes/index')
const newRouter = require('./routes/new')

const app = express()

// mongoDB connection setup
mongoose.set('strictQuery', false)
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err))
async function main() {
  await mongoose.connect(mongoDB)
}

app.use(logger('dev'))
app.use(cors(
  // {
  //   origin: [''], // TODO: Change to frontend address
  //   methods: ['POST', 'GET'],
  //   credentials: true,
  // }
))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Set secure HTTP response headers, allow Google fonts to be loaded
app.use(
  helmet(
    // {
    //   contentSecurityPolicy: {
    //     directives: {
    //       'font-src': ['self', ''] // TODO: Add CSP Directives
    //     }
    //   }
    // }
  )
)

// Compress response bodies for all requests
app.use(compression())

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', newRouter)

module.exports = app
