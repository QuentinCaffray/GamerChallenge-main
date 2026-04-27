import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { challengeIdParamSchema } from '../schemas/participationSchemas.js';

// POST
export async function voteParticipation(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Valider participationId
    const { id } = challengeIdParamSchema.parse(req.params);

    // 2. Récupérer userId
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // 3. Vérifier que la participation existe
    const participation = await prisma.participation.findUnique({
      where: { id }
    });

    if (!participation) {
      throw new AppError('Participation not found', 404);
    }

    const existingVote = await prisma.participationVote.findUnique({
      where: {
        userId_participationId: {
          userId,
          participationId: id
        }
      }
    });

    if (existingVote) {
      throw new AppError('You already voted for this participation', 409);
    }

    const vote = await prisma.participationVote.create({
      data: {
        userId,
        participationId: id
      }
    });

    res.status(201).json({ vote });
  } catch (error) {
    next(error);
  }
}

// DELETE
export async function unvoteParticipation(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Valider participationId
    const { id } = challengeIdParamSchema.parse(req.params);

    // 2. Récupérer userId
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const existingVote = await prisma.participationVote.findUnique({
      where: {
        userId_participationId: {
          userId,
          participationId: id
        }
      }
    });

    if (!existingVote) {
      throw new AppError("You didn't voted for this participation", 404);
    }

    await prisma.participationVote.delete({
      where: {
        userId_participationId: {
          userId,
          participationId: id
        }
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
