import { fetchLiveStats } from '../services/statsService.js'
import asyncHandler from 'express-async-handler'

const getLiveStats = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id
  const stats = await fetchLiveStats(userId)
  res.json(stats)
})

export { getLiveStats }
