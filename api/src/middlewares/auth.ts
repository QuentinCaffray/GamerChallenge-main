import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../../lib/prisma.js';

// Étendre le type Request pour ajouter userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extraire le token depuis les cookies
    const token = req.cookies.accessToken;

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Vérifier le JWT
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, secret) as { userId: string; username: string; role: string };

    // Vérifier que l'user existe et n'est pas supprimé ou banni
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.isDeleted) {
      throw new AppError('User account deleted or not found', 403);
    }

    if (user.isBanned) {
      throw new AppError('User account banned. Contact the support.', 403);
    }

    // Ajouter userId dans req pour l'utiliser dans les controllers
    req.userId = decoded.userId;

    // Passer au middleware/controller suivant
    next();
  } catch (error: any) {
    // Gestion des erreurs JWT spécifiques
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    // Autres erreurs
    next(error);
  }
};
