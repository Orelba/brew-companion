import { Router } from 'express'
import { sendContactMessage } from '../../controllers/contactController.js'
import { authenticateOptional } from '../../middleware/authenticate.js'

const router = Router()

// POST contact message
router.post('/', authenticateOptional, sendContactMessage)

export default router
