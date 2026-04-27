import { Router } from 'express'
import { 
  getAllChallenges, 
  getChallengeBySlug,
  createChallenge,
  updateChallenge,
  deleteChallenge
} from '../controllers/challengesController.js'
import { authMiddleware } from '../middlewares/auth.js'
import { optionalAuth } from '../middlewares/optionalAuth.js'

const router = Router()

router.get('/:slug', optionalAuth, getChallengeBySlug)
router.get('/', getAllChallenges)
router.post('/', authMiddleware, createChallenge)
router.patch('/:id', authMiddleware, updateChallenge)
router.delete('/:id', authMiddleware, deleteChallenge)

export default router