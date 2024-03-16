const express = require('express')
const router = express.Router()

const brew_controller = require('../../controllers/brewController')

router.get('/', brew_controller.brew_list)

router.post('/create', brew_controller.brew_create_post)

module.exports = router
