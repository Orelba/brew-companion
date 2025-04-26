import { Router } from 'express'
import authenticate from '../../middleware/authenticate.js'
import { getLiveStats } from '../../controllers/statsController.js'

const router = Router()

router.get('/', authenticate, getLiveStats)

export default router
