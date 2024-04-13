import { Router } from 'express'
const router = Router()

import { roasteries_list } from '../../controllers/roasteryController.js'

router.get('/', roasteries_list)

export default router