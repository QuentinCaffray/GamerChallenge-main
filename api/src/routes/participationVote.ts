import { Router } from 'express';
import {
  voteParticipation,
  unvoteParticipation
} from '../controllers/participationVotesController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/participations/:id/vote', authMiddleware, voteParticipation);

router.delete('/participations/:id/vote', authMiddleware, unvoteParticipation);

export default router;
