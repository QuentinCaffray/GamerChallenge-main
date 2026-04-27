import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import {
  createParticipationBodySchema,
  participationIdParamSchema,
  updateParticipationBodySchema
} from '../schemas/participationSchemas.js';
// POST
export async function createParticipation(req: Request, res: Response, next: NextFunction) {
  try {
    // Valider challengeId

    const { id } = participationIdParamSchema.parse(req.params);

    // Valider body

    const { submissionUrl, description } = createParticipationBodySchema.parse(req.body);

    // Récupérer userId
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Vérifier que le challenge existe
    const challenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    // Créer la participation
    const participation = await prisma.participation.create({
      data: {
        submissionUrl: submissionUrl?.trim() ? submissionUrl.trim() : '',
        description: description?.trim() || '',
        userId,
        challengeId: challenge.id
      },
      include: { user: true }
    });

    // Réponse 201
    res.status(201).json({ participation });
  } catch (error) {
    next(error);
  }
}

// PATCH
export async function updateParticipation(req: Request, res: Response, next: NextFunction) {
  try {
    // Valider participationId
    const { id } = participationIdParamSchema.parse(req.params);

    // Valider body
    const { submissionUrl, description } = updateParticipationBodySchema.parse(req.body);

    // Récupérer userId
    const userId = req.userId;

    // Trouver la participation
    const participation = await prisma.participation.findUnique({
      where: { id }
    });

    // Vérifier qu'elle existe
    if (!participation) {
      throw new AppError('Participation not found', 404);
    }

    // Vérifier ownership
    if (participation.userId !== userId) {
      throw new AppError('Unauthorized: you can only edit your own participations', 403);
    }

    // Construire l'objet de mise à jour (seulement les champs fournis)
        const updateData: Record<string, any> = {};
        if (submissionUrl !== undefined) {
          // Si la valeur est null, utiliser la forme Prisma { set: null } pour les champs nullable
          updateData.submissionUrl = submissionUrl === null ? { set: null } : submissionUrl;
        }
        if (description !== undefined) {
          updateData.description = description === null ? { set: null } : description;
        }
    
        // Mettre à jour
        const updatedParticipation = await prisma.participation.update({
          where: { id },
          data: updateData as any,
          include: { user: true }
        });

    // Réponse
    res.json({ participation: updatedParticipation });
  } catch (error) {
    next(error);
  }
}

// DELETE
export async function deleteParticipation(req: Request, res: Response, next: NextFunction) {
  try {
    // Valider participationId
    const { id } = participationIdParamSchema.parse(req.params);

    // Récupérer userId
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Trouver la participation
    const participation = await prisma.participation.findUnique({
      where: { id }
    });

    // Vérifier qu'elle existe
    if (!participation) {
      throw new AppError('Participation not found', 404);
    }

    // Vérifier ownership
    if (participation.userId !== userId) {
      throw new AppError('Unauthorized: you can only delete your own participations', 403);
    }

    // Supprimer la participation
    await prisma.participation.delete({
      where: { id }
    });

    // Réponse 204 (No Content)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
