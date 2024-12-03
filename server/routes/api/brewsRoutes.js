import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  brew_list,
  brew_list_recent,
  brew_create_post,
  brew_update_get,
  brew_update_put,
  brew_delete_post,
} from '../../controllers/brewsController.js'

// GET all brews
router.get('/', authenticate, brew_list)

// GET recent brews in a minimal format
router.get('/recent', authenticate, brew_list_recent)

// POST request to create brew
router.post('/create', authenticate, brew_create_post)

// GET one brew details for update (Unpopulated)
router.get('/:id/update', authenticate, brew_update_get)

// PUT request to update existing brew
router.put('/:id/update', authenticate, brew_update_put)

// DELETE existing brew
router.delete('/:id/delete', authenticate, brew_delete_post)

export default router
