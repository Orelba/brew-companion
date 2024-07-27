import { Router } from 'express'
import { register, login } from '../../controllers/authController.js'
import authenticate from '../../middleware/authenticate.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

// TODO: DELETE
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You are authorized' })
})

export default router
