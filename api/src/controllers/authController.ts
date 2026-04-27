import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authServices.js';
import jwt from 'jsonwebtoken';
import { getAuthCookieOptions } from '../utils/cookie.js';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //   Récupérer les données du body (déjà validées par le middleware)
    const userData = req.body;

    //   Appeler le service register
    const user = await authService.register(userData);

    //   Retourner la réponse HTTP 201 Created
    res.status(201).json({
      message: 'User successfully created',
      user
    });
  } catch (error) {
    //   Passer l'erreur au middleware d'erreur
    next(error);
  }
};

// Appelle le service login(), génère un JWT, retourne le token + user
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = req.body;

    // Appeler le service login (retourne user sans password)
    const user = await authService.login(loginData);

    // ➕ NOUVELLE VÉRIFICATION : si l'utilisateur est banni
    if (user.isBanned) {
      return res.status(403).json({
        error: 'Account banned',
        message: 'Account banned, for any request please contact the support'
      });
    }

    // Générer le JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Définir le cookie avec le token
    res.cookie('accessToken', token, {
      ...getAuthCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Retourner la réponse HTTP 200 OK avec user
    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Retourne les infos de l'utilisateur connecté (route protégée)
export const meController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Le userId est ajouté par le middleware auth
    const userId = req.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    // Récupérer l'utilisateur depuis la DB
    const user = await authService.getUserById(userId);

    res.status(200).json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const logOutontroller = async (req: Request, res: Response) => {
  res.clearCookie('accessToken', getAuthCookieOptions());
  return res.status(200).json({ message: 'logged out successfully' });
};
