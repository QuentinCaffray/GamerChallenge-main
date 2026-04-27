// topChallenges : par nombre de votes
// topGames : par somme des votes de leurs participations

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

// VARIABLE A MODIFIER POUR L'AFFICHAGE
const HOME_TOP_CHALLENGES = 16;
const HOME_TOP_GAMES = 8;

export const getHomeFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Top challenges par nombre de votes
    const topChallenges = await prisma.challenge.findMany({
      include: {
        game: true,
        _count: {
          select: { votes: true }
        }
      },
      orderBy: {
        votes: { _count: 'desc' }
      },
      take: HOME_TOP_CHALLENGES
    });

    // On récupère : games + challenges + participations + votes
    const gamesWithVotes = await prisma.game.findMany({
      include: {
        challenges: {
          include: {
            participations: {
              include: {
                _count: {
                  select: { votes: true }
                }
              }
            }
          }
        }
      }
    });

    // Top games par somme des votes de leurs participations
    const topGames = gamesWithVotes
      .map((game) => {
        const totalVotes = game.challenges.reduce((sum, challenge) => {
          return (
            sum +
            challenge.participations.reduce((pSum, participation) => {
              return pSum + participation._count.votes;
            }, 0)
          );
        }, 0);

        return {
          id: game.id,
          title: game.title,
          slug: game.slug,
          imageUrl: game.imageUrl,
          totalVotes
        };
      })
      .sort((a, b) => b.totalVotes - a.totalVotes)
      .slice(0, HOME_TOP_GAMES);

    res.json({
      topChallenges: topChallenges.map((c) => ({
        ...c,
        voteCount: c._count.votes,
        _count: undefined
      })),
      topGames
    });
  } catch (error) {
    next(error);
  }
};
