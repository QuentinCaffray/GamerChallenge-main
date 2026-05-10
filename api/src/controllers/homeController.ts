// topChallenges : par nombre de votes
// topGames : par somme des votes de leurs participations

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

// VARIABLE A MODIFIER POUR L'AFFICHAGE
const HOME_TOP_CHALLENGES = 16;
const HOME_TOP_GAMES = 8;

export const getHomeFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topChallengesPromise = prisma.challenge.findMany({
      include: {
        game: true,
        _count: { select: { votes: true } }
      },
      orderBy: { votes: { _count: 'desc' } },
      take: HOME_TOP_CHALLENGES
    });

    // SQL directement pour éviter de charger tous les jeux/challenges/participations en mémoire
    const topGamesPromise = prisma.$queryRaw<
      Array<{ id: string; title: string; slug: string; imageUrl: string; totalVotes: bigint }>
    >`
      SELECT
        g.id,
        g.title,
        g.slug,
        g.image_url AS "imageUrl",
        COALESCE(COUNT(pv.id), 0) AS "totalVotes"
      FROM games g
      LEFT JOIN challenges c ON c.game_id = g.id
      LEFT JOIN participations p ON p.challenge_id = c.id
      LEFT JOIN participation_votes pv ON pv.participation_id = p.id
      GROUP BY g.id, g.title, g.slug, g.image_url
      ORDER BY "totalVotes" DESC
      LIMIT ${HOME_TOP_GAMES}
    `;

    const [topChallenges, topGamesRaw] = await Promise.all([topChallengesPromise, topGamesPromise]);

    res.json({
      topChallenges: topChallenges.map((c) => ({
        ...c,
        voteCount: c._count.votes,
        _count: undefined
      })),
      topGames: topGamesRaw.map((g) => ({ ...g, totalVotes: Number(g.totalVotes) }))
    });
  } catch (error) {
    next(error);
  }
};
