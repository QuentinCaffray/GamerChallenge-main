// Types de base
export type ScoreFormat = 'score' | 'time' | 'boolean';

// Interface pour un jeu simple
export interface GameSimple {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
}

// Interface pour un jeu complet (avec challenges)
export interface GameWithChallenges extends GameSimple {
  challenges: Challenge[];
}

// Interface pour un challenge
export interface Challenge {
  id: string;
  slug: string;
  title: string;
  scoreFormat: ScoreFormat;
  description: string;
  details: string[] | null;
  createdBy: string;
  gameId: string;
  createdAt: string;
  updatedAt: string;
  game: GameSimple;
  voteCount: number;
}

// Interface pour un challenge détaillé (avec participations)
export interface ChallengeDetails extends Omit<Challenge, 'details'> {
  details: string[];
  creator: {
    id: string;
    username: string;
  };
  participations: Participation[];
  _count: {
    votes: number;
  };
  likes: number;
}

// Interface pour une participation
export interface Participation {
  id: string;
  submissionUrl: string | null;
  description: string;
  userId: string;
  challengeId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
  voteCount: number;
  hasVoted?: boolean; // Ajouté car présent dans votre code front
}

// Interface pour le leaderboard
export interface LeaderboardByParticipations {
  username: string;
  participationCount: number;
}

export interface LeaderboardByLikes {
  id: string;
  username: string;
  totalLikes: number;
}

export interface LeaderboardResponse {
  topByParticipations: LeaderboardByParticipations[];
  topByLikes: LeaderboardByLikes[];
  currentUserRank: {
    byLikes: { rank: number; totalLikes: number };
    byParticipations: { rank: number; participationCount: number };
  } | null;
}

// Interface pour les top challenges (page d'accueil)
export interface TopChallenge extends Challenge {
  // Déjà tout inclus dans Challenge
}

// Interface pour les top games (page d'accueil)
export interface TopGame extends GameSimple {
  totalVotes: number;
}

export interface HomePageData {
  topChallenges: TopChallenge[];
  topGames: TopGame[];
}

// Réponses API
export interface GameResponse {
  game: GameWithChallenges;
}

export interface ChallengeResponse {
  challenge: ChallengeDetails;
}

export interface GamesListResponse {
  games: GameSimple[];
}

export interface ChallengesListResponse {
  challenges: Challenge[];
}
