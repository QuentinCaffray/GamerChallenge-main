import { Router } from 'express'
import { getLeaderboard } from '../controllers/leaderboardController.js'
import { optionalAuth } from '../middlewares/optionalAuth.js'

const router = Router()

router.get('/', optionalAuth, getLeaderboard)

export default router