import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  roasteriesList,
  roasteryCreatePost,
  roasteryUpdateGet,
  roasteryUpdatePut,
  roasteryDeleteWithCoffeesAndBrews,
} from '../../controllers/roasteriesController.js'

// GET all roasteries
router.get('/', authenticate, roasteriesList)

// POST request to create roastery
router.post('/create', authenticate, roasteryCreatePost)

// GET one roastery details for update
router.get('/:id/update', authenticate, roasteryUpdateGet)

// PUT request to update existing roastery
router.put('/:id/update', authenticate, roasteryUpdatePut)

// DELETE request to delete roastery with coffees and brews
router.delete('/:id/delete', authenticate, roasteryDeleteWithCoffeesAndBrews)

export default router
