// middleware de validation avec Zod : valide req.body avec un schéma Zod et retourne une erreur 400 si invalide

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const message = error.errors?.map((e: any) => e.message).join(', ');
      next(new AppError(message || 'Validation failed', 400));
    }
  };
};
