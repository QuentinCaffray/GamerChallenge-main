import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token depuis le cookie
    const token = req.cookies?.accessToken;
    
    if (!token) {
      // Pas de token = pas connecté = OK
      req.userId = undefined;
      return next();
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    // Token invalide = pas connecté = OK
    req.userId = undefined;
    next();
  }
};