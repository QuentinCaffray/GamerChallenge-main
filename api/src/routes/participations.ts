import { Router } from 'express';
import {
  createParticipation,
  updateParticipation,
  deleteParticipation
} from '../controllers/participationController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.post('/challenges/:id/participations', authMiddleware, createParticipation);

router.patch('/participations/:id', authMiddleware, updateParticipation);

router.delete('/participations/:id', authMiddleware, deleteParticipation);

export default router;
