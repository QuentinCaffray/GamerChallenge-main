// Gestion des reports
// createReport : permet a un utilisateur connecté de signaler un challenge ou une participation

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';

// User connecté signale un contenu
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { targetType, targetId, reason } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Vérifier que le contenu ciblé existe
    if (targetType === 'CHALLENGE') {
      const challenge = await prisma.challenge.findUnique({ where: { id: targetId } });
      if (!challenge) {
        throw new AppError('Challenge not found', 404);
      }
    } else if (targetType === 'PARTICIPATION') {
      const participation = await prisma.participation.findUnique({ where: { id: targetId } });
      if (!participation) {
        throw new AppError('Participation not found', 404);
      }
    }

    // Créer le signalement (la contrainte unique empêche les doublons)
    const report = await prisma.report.create({
      data: {
        userId,
        targetType,
        targetId,
        reason
      }
    });

    res.status(201).json({ 
      message: 'Content reported successfully',
      reportId: report.id
    });
  } catch (error: any) {
    // Gestion de l'erreur de contrainte unique (user a déjà signalé ce contenu)
    if (error.code === 'P2002') {
      return next(new AppError('You have already reported this content', 400));
    }
    next(error);
  }
};