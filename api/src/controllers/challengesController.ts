// getAllChallenges : liste tous les challenges avec leurs jeux associés, triés par date de création (plus récent en premier).
// getChallengeById : récupère un challenge avec son jeu et ses participations
// getChallengeBySlug : récupère un challenge avec son jeu et ses participations
// createChallenge : avec les infos du front, on créer un challenge, on insère le jeu en BDD s'il n'existe pas
// updateChallenge : modofie un challenge

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';

export const getAllChallenges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challenges = await prisma.challenge.findMany({
      include: {
        game: true,
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      challenges: challenges.map((c) => ({
        ...c,
        voteCount: c._count.votes,
        _count: undefined
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getChallengeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        game: true,
        participations: {
          include: { user: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    res.json({ challenge });
  } catch (error) {
    next(error);
  }
};

export const getChallengeBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const userId = req.userId;

    const challenge = await prisma.challenge.findUnique({
      where: { slug },
      include: {
        game: true,
        creator: {
          select: {
            id: true,
            username: true
          }
        },
        participations: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            },
            votes: userId
              ? {
                  where: { userId },
                  select: { userId: true }
                }
              : false,
            _count: {
              select: { votes: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { votes: true }
        },
        votes: userId
          ? {
              where: { userId },
              select: { userId: true }
            }
          : false
      }
    });

    if (!challenge) {
      throw new AppError('Challenge not found', 404);
    }

    const parsedChallenge = {
      ...challenge,
      details: challenge.details ? JSON.parse(challenge.details) : [],
      // Normalisation des votes (optionnel mais cohérent avec ton front)
      hasVoted: challenge.votes && challenge.votes.length > 0,
      likes: challenge._count.votes,
      participations: challenge.participations.map((p) => ({
        ...p,
        hasVoted: p.votes && p.votes.length > 0,
        voteCount: p._count?.votes || 0
      }))
    };

    res.json({ challenge: parsedChallenge });
  } catch (error) {
    next(error);
  }
};

export const createChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, scoreFormat, description, details, gameId, gameTitle, gameSlug, gameImageUrl } =
      req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Vérifie que les champs essentiels sont présents
    if (!title || !scoreFormat || !description || !gameId || !gameTitle || !gameSlug) {
      throw new AppError('Missing required fields', 400);
    }

    // Générer le slug du challenge depuis le titre
    const challengeSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Remplace caractères spéciaux par -
      .replace(/^-+|-+$/g, ''); // Enlève les - au début/fin

    // Convertir gameId en string (car RAWG renvoie un Number)
    const gameIdString = String(gameId);

    const detailsJson =
      details && Array.isArray(details) && details.length > 0 ? JSON.stringify(details) : null;
    // 1. Vérifier si le jeu existe déjà en base
    let game = await prisma.game.findUnique({ where: { id: gameIdString } });

    // 2. Si non, le créer avec les infos de l'autocomplete
    if (!game) {
      game = await prisma.game.create({
        data: {
          id: gameIdString,
          slug: gameSlug,
          title: gameTitle,
          imageUrl: gameImageUrl || ''
        }
      });
    }

    // 3. Créer le challenge
    const challenge = await prisma.challenge.create({
      data: {
        title,
        slug: challengeSlug,
        scoreFormat,
        description,
        details: detailsJson,
        gameId: game.id,
        createdBy: userId
      },
      include: {
        game: true
      }
    });

    res.status(201).json({ challenge });
  } catch (error) {
    next(error);
  }
};

// Modifie un challenge. Vérifie que l'user authentifié est le créateur (auth + ownership requis).
export const updateChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, scoreFormat, description, details } = req.body;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // 1. Vérifier que le challenge existe
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      throw new AppError('Challenge not found', 404);
    }

    // 2. Vérifier que l'user est le créateur
    if (existingChallenge.createdBy !== userId) {
      throw new AppError('Unauthorized: you can only edit your own challenges', 403);
    }

    // 3. Mettre à jour
    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(scoreFormat && { scoreFormat }),
        ...(description && { description }),
        ...(details && { details: JSON.stringify(details) })
      },
      include: { game: true }
    });

    res.json({ challenge: updatedChallenge });
  } catch (error) {
    next(error);
  }
};

// Supprime un challenge. Vérifie que l'user authentifié est le créateur (auth + ownership requis).
export const deleteChallenge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // 1. Vérifier que le challenge existe
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id }
    });

    if (!existingChallenge) {
      throw new AppError('Challenge not found', 404);
    }

    // 2. Vérifier que l'user est le créateur
    if (existingChallenge.createdBy !== userId) {
      throw new AppError('Unauthorized: you can only delete your own challenges', 403);
    }

    // 3. Supprimer
    await prisma.challenge.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
