import { Router } from 'express';
import { voteChallenge, unvoteChallenge } from '../controllers/challengeVotesController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/challenges/:id/vote', authMiddleware, voteChallenge);

router.delete('/challenges/:id/vote', authMiddleware, unvoteChallenge);

export default router;
