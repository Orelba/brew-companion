import { Router } from 'express'
const router = Router()

import { roasteries_list } from '../../controllers/roasteriesController.js'

router.get('/', roasteries_list)

export default router