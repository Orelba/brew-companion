const express = require('express')
const router = express.Router()

const coffee_controller = require('../../controllers/coffeeController')

/* GET home page. */
router.get('/', coffee_controller.coffee_list)

router.post('/create', coffee_controller.coffee_create_post)

module.exports = router
