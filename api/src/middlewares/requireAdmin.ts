// Ici on vérifie le rôle du l'utilisateur

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../../lib/prisma.js';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Récupérer l'user pour vérifier son rôle
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isDeleted: true }
    });

    if (!user || user.isDeleted) {
      throw new AppError('User not found', 404);
    }

    if (user.role !== 'ADMIN') {
      throw new AppError('Access forbidden: admin privileges required', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};