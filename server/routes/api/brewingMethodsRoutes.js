import { Router } from 'express'
const router = Router()

import { brewing_methods_list } from '../../controllers/brewingMethodsController.js'

router.get('/', brewing_methods_list)

export default router