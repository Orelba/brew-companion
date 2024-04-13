import { Router } from 'express'
const router = Router()

import coffeeRoutes from './coffeeRoutes.js'
import roasteriesRoutes from './roasteriesRoutes.js'
import brewRoutes from './brewRoutes.js'

router.use('/coffee', coffeeRoutes)
router.use('/roasteries', roasteriesRoutes)
router.use('/brew', brewRoutes)

export default router
