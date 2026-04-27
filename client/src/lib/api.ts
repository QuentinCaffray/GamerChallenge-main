const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Interface qui correspond au modèle Game de Prisma
export interface Game {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  description: string;
}

// Interface pour les résultats de recherche RAWG
export interface GameSearchResult {
  id: number;
  slug: string;
  name: string;
  background_image: string;
}

/**
 * Récupère tous les jeux depuis la base de données
 */
export async function fetchGames(): Promise<Game[]> {
  try {
    const res = await fetch(`${API_URL}/games`);

    if (!res.ok) {
      throw new Error(`Failed to fetch games: ${res.status}`);
    }

    const data = await res.json();
    return data.games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

/**
 * Recherche des jeux via l'API RAWG (pour l'autocompletion)
 */
export async function searchGames(query: string): Promise<GameSearchResult[]> {
  try {
    const res = await fetch(`${API_URL}/games/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error(`Failed to search games: ${res.status}`);
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
}

/**
 * Récupère un jeu par son ID avec ses challenges
 */
export async function fetchGameById(id: string): Promise<Game> {
  try {
    const res = await fetch(`${API_URL}/games/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch game: ${res.status}`);
    }

    const data = await res.json();
    return data.game;
  } catch (error) {
    console.error('Error fetching game:', error);
    throw error;
  }
}

// ✅ Types pour la page challenge details
export interface ChallengeParticipation {
  id: string;
  userId: string;
  name: string;
  description: string;
  scoreLabel: string;
  link?: string;
  hasLiked?: boolean;
  likes: number;
}

export interface ChallengeDetails {
  id: string;
  slug: string;
  title: string;
  gameId: string;
  gameTitle: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  gameImage: string;
  description: string[];
  details: string[];
  hasLiked?: boolean;
  likes: number;
  participations: ChallengeParticipation[];
}

// -----------------------------
// ✅ Challenge details
// -----------------------------
export async function fetchChallengeBySlug(slug: string): Promise<ChallengeDetails> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Challenge like toggle
// -----------------------------
export async function toggleChallengeLike(
  slug: string
): Promise<{ ok: true; hasLiked: boolean; likes: number }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Update challenge (title/image/details/description)
// -----------------------------
export async function updateChallenge(
  slug: string,
  payload: {
    title?: string;
    imageUrl?: string | null;
    description?: string | string[];
    details?: string[];
  }
): Promise<{ ok: true }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Create participation
// -----------------------------
export async function createParticipation(
  slug: string,
  payload: { description: string; submissionUrl?: string }
): Promise<{ ok: true; participation: ChallengeParticipation }> {
  const res = await fetch(`${API_URL}/api/challenges/${slug}/participations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Update participation
// -----------------------------
export async function updateParticipation(
  id: string,
  payload: { description?: string; submissionUrl?: string }
): Promise<{ ok: true; participation: ChallengeParticipation }> {
  const res = await fetch(`${API_URL}/api/participations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Delete participation
// -----------------------------
export async function deleteParticipation(id: string): Promise<{ ok: true }> {
  const res = await fetch(`${API_URL}/api/participations/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// -----------------------------
// ✅ Participation like toggle
// -----------------------------
export async function toggleParticipationLike(
  id: string
): Promise<{ ok: true; hasLiked: boolean; likes: number }> {
  const res = await fetch(`${API_URL}/api/participations/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => `Failed (${res.status})`));
  }
  return res.json();
}

// ==================== MODERATION API ====================

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isDeleted: boolean;
  deletedAt: string | null;
  isBanned: boolean;
  bannedAt: string | null;
  createdAt: string;
  _count: {
    createdChallenges: number;
    participations: number;
  };
}

/**
 * Récupère tous les users (admin only)
 */
export async function fetchAllUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_URL}/moderation/users`, {
      credentials: 'include' // Important : envoie les cookies (accessToken)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status}`);
    }

    const data = await res.json();
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Bannir un utilisateur (admin only)
 */
export async function banUser(userId: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/moderation/users/${userId}/ban`, {
      method: 'PATCH',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to ban user: ${res.status}`);
    }
  } catch (error) {
    console.error('Error banning user:', error);
    throw error;
  }
}

/**
 * Débannir un utilisateur (admin only)
 */
export async function unbanUser(userId: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/moderation/users/${userId}/unban`, {
      method: 'PATCH',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to unban user: ${res.status}`);
    }
  } catch (error) {
    console.error('Error unbanning user:', error);
    throw error;
  }
}

// ==================== REPORTED CONTENT ====================

export interface ReportedChallenge {
  id: string;
  title: string;
  description: string;
  slug: string;
  game: {
    id: string;
    title: string;
  };
  creator: {
    id: string;
    username: string;
    email: string;
  };
  reports: Array<{
    id: string;
    reason: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
    };
  }>;
  reportCount: number;
  _count: {
    participations: number;
    votes: number;
  };
}

export interface ReportedParticipation {
  id: string;
  submissionUrl: string;
  description: string | null;
  user: {
    id: string;
    username: string;
    email: string;
  };
  challenge: {
    id: string;
    title: string;
    slug: string;
  };
  reports: Array<{
    id: string;
    reason: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
    };
  }>;
  reportCount: number;
  _count: {
    votes: number;
  };
}

/**
 * Récupère tous les challenges signalés
 */
export async function fetchReportedChallenges(): Promise<ReportedChallenge[]> {
  try {
    const res = await fetch(`${API_URL}/moderation/challenges`, {
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reported challenges: ${res.status}`);
    }

    const data = await res.json();
    return data.challenges;
  } catch (error) {
    console.error('Error fetching reported challenges:', error);
    throw error;
  }
}

/**
 * Récupère toutes les participations signalées
 */
export async function fetchReportedParticipations(): Promise<ReportedParticipation[]> {
  try {
    const res = await fetch(`${API_URL}/moderation/participations`, {
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reported participations: ${res.status}`);
    }

    const data = await res.json();
    return data.participations;
  } catch (error) {
    console.error('Error fetching reported participations:', error);
    throw error;
  }
}

/**
 * Approuver un contenu (supprime les signalements)
 */
export async function approveContent(
  targetType: 'CHALLENGE' | 'PARTICIPATION',
  targetId: string
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/moderation/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ targetType, targetId })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to approve content: ${res.status}`);
    }
  } catch (error) {
    console.error('Error approving content:', error);
    throw error;
  }
}

/**
 * Supprimer un challenge signalé
 */
export async function deleteReportedChallenge(challengeId: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/moderation/challenge/${challengeId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to delete challenge: ${res.status}`);
    }
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
}

/**
 * Supprimer une participation signalée
 */
export async function deleteReportedParticipation(participationId: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/moderation/participation/${participationId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || `Failed to delete participation: ${res.status}`);
    }
  } catch (error) {
    console.error('Error deleting participation:', error);
    throw error;
  }
}
