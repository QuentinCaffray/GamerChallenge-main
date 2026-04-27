import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import { challengeIdParamSchema } from '../schemas/participationSchemas.js';

// POST
export async function voteChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Valider challengeId
    const { id } = challengeIdParamSchema.parse(req.params);

    // 2. Récupérer userId
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // 3. Vérifier que le challenge existe
    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    const existingVote = await prisma.challengeVote.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: id
        }
      }
    });

    if (existingVote) {
      throw new AppError('You already voted for this challenge', 409);
    }

    const vote = await prisma.challengeVote.create({
      data: {
        userId,
        challengeId: id
      }
    });

    res.status(201).json({ vote });
  } catch (error) {
    next(error);
  }
}

// DELETE
export async function unvoteChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Valider challengeId
    const { id } = challengeIdParamSchema.parse(req.params);

    // 2. Récupérer userId
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const existingVote = await prisma.challengeVote.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: id
        }
      }
    });

    if (!existingVote) {
      throw new AppError("You didn't voted for this challenge", 404);
    }

    await prisma.challengeVote.delete({
      where: {
        userId_challengeId: {
          userId,
          challengeId: id
        }
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
