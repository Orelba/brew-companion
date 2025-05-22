import { Router } from 'express'
const router = Router()

import authRoutes from './authRoutes.js'
import usersRoutes from './usersRoutes.js'
import coffeesRoutes from './coffeesRoutes.js'
import roasteriesRoutes from './roasteriesRoutes.js'
import brewingMethodsRoutes from './brewingMethodsRoutes.js'
import brewRoutes from './brewsRoutes.js'
import statsRoutes from './statsRoutes.js'

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/coffees', coffeesRoutes)
router.use('/roasteries', roasteriesRoutes)
router.use('/brewing-methods', brewingMethodsRoutes)
router.use('/brews', brewRoutes)
router.use('/stats', statsRoutes)

export default router
