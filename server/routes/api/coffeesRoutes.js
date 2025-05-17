import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  coffeeList,
  coffeeCreatePost,
  coffeeUpdateGet,
  coffeeUpdatePut,
  coffeeToggleArchiveStatusPatch,
  coffeeDeleteWithBrews,
} from '../../controllers/coffeesController.js'

// GET all coffees
router.get('/', authenticate, coffeeList)

// POST request to create coffee
router.post('/create', authenticate, coffeeCreatePost)

// GET one coffee details for update
router.get('/:id/update', authenticate, coffeeUpdateGet)

// PUT request to update existing coffee
router.put('/:id/update', authenticate, coffeeUpdatePut)

// PATCH request to toggle the archive or unarchive status on existing coffee
router.patch('/:id/archive', authenticate, coffeeToggleArchiveStatusPatch)

// DELETE request to delete coffee with brews
router.delete('/:id/delete', authenticate, coffeeDeleteWithBrews)

export default router
