import { Router } from 'express';
import {
  registerController,
  loginController,
  meController,
  logOutontroller
} from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

// POST /auth/register
router.post(
  '/register',
  validate(registerSchema), // Valide les données avec Zod
  registerController // Exécute le controller
);

// POST /auth/login
router.post(
  '/login',
  validate(loginSchema), // Valide les données avec Zod
  loginController // Exécute le controller
);

// GET /auth/me - Route protégée
router.get(
  '/me',
  authMiddleware, // Vérifie le token JWT
  meController // Retourne les infos de l'utilisateur
);

// POST /auth/logout - Route protégée
router.post('/logout', logOutontroller);

export default router;
