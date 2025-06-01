import { Router } from 'express'
import authenticate from '../../middleware/authenticate.js'
import { brewingMethodsList } from '../../controllers/brewingMethodsController.js'

const router = Router()

// Get a list of all brewing methods
router.get('/', authenticate, brewingMethodsList)

export default router
