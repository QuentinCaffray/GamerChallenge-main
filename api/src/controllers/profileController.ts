// Ici on gère le profil utilisateur
// getProfile : renvoie les infos utilisateur + ses challenges + ses participations
// updateProfile : on met à jour les champs modifiés
// deleteProfile : soft delete => isDeleted: true + anonymisation (username, email)

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../utils/AppError.js';
import argon2 from 'argon2';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Récupérer l'utilisateur avec ses challenges et participations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        createdChallenges: {
          include: {
            game: {
              select: { id: true, title: true, slug: true, imageUrl: true }
            },
            _count: {
              select: { votes: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        participations: {
          include: {
            challenge: {
              include: {
                game: {
                  select: { id: true, title: true, slug: true, imageUrl: true }
                }
              }
            },
            _count: {
              select: { votes: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Calculer les stats
    const totalChallenges = user.createdChallenges.length;
    const totalParticipations = user.participations.length;

    // Total likes (challenges + participations)
    const totalLikesOnChallenges = user.createdChallenges.reduce(
      (sum, challenge) => sum + challenge._count.votes,
      0
    );
    const totalLikesOnParticipations = user.participations.reduce(
      (sum, participation) => sum + participation._count.votes,
      0
    );
    const totalLikes = totalLikesOnChallenges + totalLikesOnParticipations;

    // Calculer le rang global (basé sur le total de likes)
    const usersWithMoreLikes = await prisma.user.count({
      where: {
        isDeleted: false,
        OR: [
          {
            createdChallenges: {
              some: {
                votes: {}
              }
            }
          },
          {
            participations: {
              some: {
                votes: {}
              }
            }
          }
        ]
      }
    });
    const rank = usersWithMoreLikes + 1;

    // Formater les challenges avec le nombre de likes
    const challenges = user.createdChallenges.map((challenge) => ({
      id: challenge.id,
      slug: challenge.slug,
      title: challenge.title,
      description: challenge.description,
      scoreFormat: challenge.scoreFormat,
      game: challenge.game,
      likes: challenge._count.votes,
      createdAt: challenge.createdAt
    }));

    // Formater les participations avec le nombre de likes
    const participations = user.participations.map((participation) => ({
      id: participation.id,
      description: participation.description,
      submissionUrl: participation.submissionUrl,
      challenge: {
        id: participation.challenge.id,
        slug: participation.challenge.slug,
        title: participation.challenge.title,
        game: participation.challenge.game
      },
      likes: participation._count.votes,
      createdAt: participation.createdAt
    }));

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      stats: {
        totalChallenges,
        totalParticipations,
        totalLikes,
        rank
      },
      challenges,
      participations
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { username, email, password } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {};
    if (username) {
      dataToUpdate.username = username;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    if (password) {
      dataToUpdate.password = await argon2.hash(password);
    }

    // Mettre à jour
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    // Gérer l'erreur Prisma de contrainte unique
    if (error.code === 'P2002') {
      // L'info est cachée dans driverAdapterError avec ton adaptateur
      const fields = error.meta?.driverAdapterError?.cause?.constraint?.fields;

      if (Array.isArray(fields)) {
        if (fields.includes('username')) {
          return next(new AppError('This username is already in use by another user', 409));
        }

        if (fields.includes('email')) {
          return next(new AppError('This email address is already in use by another user', 409));
        }
      }

      // Fallback
      return next(new AppError('This information is already in use', 409));
    }

    // Autres erreurs
    next(error);
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }

    const anonymizedEmail = `deleted-${Date.now()}@anonymized.local`;
    const anonymizedUsername = `deleted_user_${userId.slice(0, 8)}`;

    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        email: anonymizedEmail,
        username: anonymizedUsername,
        password: ''
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
