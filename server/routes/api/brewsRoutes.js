import { Router } from 'express'
const router = Router()

import authenticate from '../../middleware/authenticate.js'

import {
  brewList,
  brewListRecent,
  brewCreatePost,
  brewUpdateGet,
  brewUpdatePut,
  brewDeletePost,
} from '../../controllers/brewsController.js'

// GET all brews
router.get('/', authenticate, brewList)

// GET recent brews in a minimal format
router.get('/recent', authenticate, brewListRecent)

// POST request to create brew
router.post('/create', authenticate, brewCreatePost)

// GET one brew details for update (Unpopulated)
router.get('/:id/update', authenticate, brewUpdateGet)

// PUT request to update existing brew
router.put('/:id/update', authenticate, brewUpdatePut)

// DELETE existing brew
router.delete('/:id/delete', authenticate, brewDeletePost)

export default router
