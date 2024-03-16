import { Router } from 'express'
const router = Router()

import {
  brew_list,
  brew_create_post,
} from '../../controllers/brewController.js'

router.get('/', brew_list)

router.post('/create', brew_create_post)

export default router
