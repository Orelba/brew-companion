import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  coffee_list,
  coffee_create_post,
} from '../../controllers/coffeesController.js'

router.get('/', authenticate, coffee_list)

router.post('/create', authenticate, coffee_create_post)

export default router
