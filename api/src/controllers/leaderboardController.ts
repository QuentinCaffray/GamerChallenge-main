// controlleur du leaderboard
// topByParticipations : par nombre de participations
// topByLikes : par somme des likes de l'ensemble de leurs participations

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma.js';

const LEADERBOARD_TOP_PARTICIPANTS = 10;
const LEADERBOARD_TOP_LIKED = 10;

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId || null;

    const topByParticipationsPromise = prisma.user.findMany({
      where: { isDeleted: false },
      include: { _count: { select: { participations: true } } },
      orderBy: { participations: { _count: 'desc' } },
      take: LEADERBOARD_TOP_PARTICIPANTS
    });

    // SQL directement pour éviter de charger tous les users/participations/votes en mémoire
    const topByLikesPromise = prisma.$queryRaw<
      Array<{ username: string; totalLikes: bigint }>
    >`
      SELECT
        u.username,
        COALESCE(COUNT(pv.id), 0) AS "totalLikes"
      FROM users u
      LEFT JOIN participations p ON p.user_id = u.id
      LEFT JOIN participation_votes pv ON pv.participation_id = p.id
      WHERE u.is_deleted = false
      GROUP BY u.id, u.username
      ORDER BY "totalLikes" DESC
      LIMIT ${LEADERBOARD_TOP_LIKED}
    `;

    const [topByParticipations, topByLikesRaw] = await Promise.all([
      topByParticipationsPromise,
      topByLikesPromise
    ]);

    let currentUserRank = null;

    if (userId) {
      // Une seule requête SQL avec RANK() pour les deux classements en même temps
      const [userRank] = await prisma.$queryRaw<
        Array<{
          participationRank: bigint;
          participationCount: bigint;
          likesRank: bigint;
          totalLikes: bigint;
        }>
      >`
        SELECT
          participation_rank AS "participationRank",
          participation_count AS "participationCount",
          likes_rank AS "likesRank",
          total_likes AS "totalLikes"
        FROM (
          SELECT
            u.id,
            RANK() OVER (ORDER BY COUNT(DISTINCT p.id) DESC) AS participation_rank,
            COUNT(DISTINCT p.id) AS participation_count,
            RANK() OVER (ORDER BY COUNT(pv.id) DESC) AS likes_rank,
            COUNT(pv.id) AS total_likes
          FROM users u
          LEFT JOIN participations p ON p.user_id = u.id
          LEFT JOIN participation_votes pv ON pv.participation_id = p.id
          WHERE u.is_deleted = false
          GROUP BY u.id
        ) ranked
        WHERE id = ${userId}
      `;

      if (userRank) {
        currentUserRank = {
          byParticipations: {
            rank: Number(userRank.participationRank),
            participationCount: Number(userRank.participationCount)
          },
          byLikes: {
            rank: Number(userRank.likesRank),
            totalLikes: Number(userRank.totalLikes)
          }
        };
      }
    }

    res.json({
      topByParticipations: topByParticipations.map((u) => ({
        username: u.username,
        participationCount: u._count.participations
      })),
      topByLikes: topByLikesRaw.map((u) => ({
        username: u.username,
        totalLikes: Number(u.totalLikes)
      })),
      currentUserRank
    });
  } catch (error) {
    next(error);
  }
};
