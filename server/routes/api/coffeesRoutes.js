import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  coffeeList,
  coffeeCreatePost,
} from '../../controllers/coffeesController.js'

router.get('/', authenticate, coffeeList)

router.post('/create', authenticate, coffeeCreatePost)

export default router
