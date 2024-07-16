import { Router } from 'express'
const router = Router()

import coffeesRoutes from './coffeesRoutes.js'
import roasteriesRoutes from './roasteriesRoutes.js'
import brewingMethodsRoutes from './brewingMethodsRoutes.js'
import brewRoutes from './brewsRoutes.js'

router.use('/coffees', coffeesRoutes)
router.use('/roasteries', roasteriesRoutes)
router.use('/brewing-methods', brewingMethodsRoutes)
router.use('/brews', brewRoutes)

export default router
