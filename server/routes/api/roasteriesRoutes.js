import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import { roasteriesList } from '../../controllers/roasteriesController.js'

router.get('/', authenticate, roasteriesList)

export default router
