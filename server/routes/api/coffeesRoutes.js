import { Router } from 'express'
const router = Router()

import {
  coffee_list,
  coffee_create_post,
} from '../../controllers/coffeesController.js'

router.get('/', coffee_list)

router.post('/create', coffee_create_post)

export default router
