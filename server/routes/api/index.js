const express = require('express')
const router = express.Router()

const coffeeRoutes = require('./coffeeRoutes')
const brewRoutes = require('./brewRoutes')

router.use('/coffee', coffeeRoutes)
router.use('/brew', brewRoutes)

module.exports = router
