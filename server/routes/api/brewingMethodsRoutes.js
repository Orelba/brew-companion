import { Router } from 'express'
const router = Router()

import { brewingMethodsList } from '../../controllers/brewingMethodsController.js'

router.get('/', brewingMethodsList)

export default router
