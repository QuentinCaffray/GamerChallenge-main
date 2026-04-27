import { Router } from 'express'
import { searchGames, getAllGames, getGameBySlug } from '../controllers/gamesController.js'

const router = Router()

router.get('/search', searchGames)
router.get('/', getAllGames)
router.get('/:slug', getGameBySlug)

export default router