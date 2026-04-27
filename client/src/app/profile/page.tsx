'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

type Stats = {
  totalChallenges: number;
  totalParticipations: number;
  totalLikes: number;
  rank: number | string;
};

type Challenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  likes: number;
  createdAt: string;
  game?: {
    title: string;
  };
};

type Participation = {
  id: string;
  description: string;
  likes: number;
  createdAt: string;
  challenge?: {
    slug: string;
    title: string;
    game?: {
      title: string;
    };
  };
};

// Hook custom pour récupérer le profil
function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      credentials: 'include'
    })
      .then((res) => (res.ok ? res.json() : Promise.reject('Erreur')))
      .then((data) => {
        setUser(data.user);
        setStats(data.stats);
        setChallenges(data.challenges);
        setParticipations(data.participations);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { user, setUser, stats, challenges, participations, loading, error };
}

export default function ProfilePage() {
  // ← ICI : récupère stats, challenges, participations
  const { user, setUser, stats, challenges, participations, loading, error } = useProfile();
  const router = useRouter();

  // Suppression du profil
  const handleDeleteProfile = async () => {
    if (
      !window.confirm(
        '⚠️ WARNING: Are you sure you want to permanently delete your profile?\n\n' +
          'This action will delete:\n' +
          '- Your user account\n' +
          '- All your created challenges\n' +
          '- All your participations\n\n' +
          'This action is IRREVERSIBLE!'
      )
    ) {
      return;
    }
    setFormError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error deleting profile');
      }
      router.push('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during deletion';
      setFormError(errorMessage);
    }
  };

  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [showAllParticipations, setShowAllParticipations] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Chargement du profil...</div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Tu n&apos;es pas connecté</p>
          <Link
            href="/login-register/login"
            className="bg-(--button-game-challenge) hover:(--button-game-challenge-hover) px-6 py-3 rounded-lg inline-block"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const updates: Partial<{ username: string; email: string; password: string }> = {};
    if (username !== user.username) {
      updates.username = username;
    }
    if (email !== user.email) {
      updates.email = email;
    }
    if (password) {
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error during backup');
      }

      const data = await response.json();

      setUser({
        ...user,
        username: data.user.username,
        email: data.user.email
      });

      setUsername(data.user.username);
      setEmail(data.user.email);
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error has occurred';
      setFormError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(user.username);
    setEmail(user.email);
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  };

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative mx-5 my-8 max-w-5xl lg:mx-auto border-b border-foreground/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 rounded-full bg-(--button-select)" />
          <div>
            <h1 className="text-5xl md:text-6xl font-black">{user.username}</h1>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select)/50 shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Challenges</p>
            <p className="text-4xl font-black text-(--button-select)">
              {stats?.totalChallenges || 0}
            </p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select)/50 shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Participations</p>
            <p className="text-4xl font-black text-(--button-select)">
              {stats?.totalParticipations || 0}
            </p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select)/50 shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Total Likes</p>
            <p className="text-4xl font-black text-(--button-select)">{stats?.totalLikes || 0}</p>
          </div>
          <div className="rounded-xl bg-(--button-area) ring-1 ring-(--button-select)/50 shadow-lg p-4 hover:ring-(--button-select) transition-all">
            <p className="text-sm mb-1">Global Rank</p>
            <p className="text-4xl font-black text-(--button-select)">#{stats?.rank || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8">
        <div
          className={`relative rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6 ${isEditing ? 'pb-20' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-4 w-full max-w-md">
              <div>
                <span className="text-sm">Username:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mt-1 text-lg font-semibold bg-(--profile-modify-text-area) border border-(--header-button-area) rounded px-3 py-2 focus:outline-none focus:border-(--button-game-challenge-hover)"
                  />
                ) : (
                  <p className="text-lg font-semibold mt-1">{user.username}</p>
                )}
              </div>

              <div>
                <span className="text-sm">Mail:</span>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 text-lg bg-(--profile-modify-text-area) border border-(--header-button-area) rounded px-3 py-2 focus:outline-none focus:border-(--button-game-challenge-hover)"
                  />
                ) : (
                  <p className="text-lg mt-1 break-all">{user.email}</p>
                )}
              </div>

              <div>
                <span className="text-sm">Password:</span>
                {isEditing ? (
                  <>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full mt-1 text-lg bg-(--profile-modify-text-area) border border-(--header-button-area) rounded px-3 py-2 focus:outline-none focus:border-(--button-game-challenge-hover)"
                    />
                    <p className="text-xs text-red-600 mt-1">
                      Password must be at least 8 characters, contain an uppercase letter and a
                      special character.
                    </p>
                  </>
                ) : (
                  <p className="text-lg mt-1">••••••••</p>
                )}
              </div>

              {isEditing && (
                <div>
                  <span className="text-sm">Confirm Password:</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full mt-1 text-lg bg-(--profile-modify-text-area) border border-(--header-button-area) rounded px-3 py-2 focus:outline-none focus:border-(--button-game-challenge-hover)"
                  />
                </div>
              )}

              <div>
                <span className="text-sm">Registered since:</span>
                <p className="text-lg mt-1">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-(--profile-save-button) hover:bg-(--profile-save-button)/70 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-foreground/60 hover:bg-(--header-button-area) font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg ml-4"
              >
                Modify
              </button>
            )}
          </div>

          {isEditing && formError && (
            <div className="bg-(--error-area-message) border border-(--error-border-message) rounded-lg p-4 mt-4">
              <p className="text-(--error-text-message) text-sm">{formError}</p>
            </div>
          )}

          {isEditing && (
            <div className="absolute left-6 bottom-6">
              <button
                onClick={handleDeleteProfile}
                className="bg-(--danger-button) hover:bg-(--danger-button)/50 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Delete Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Challenges and Participations */}
      <div className="max-w-5xl mx-5 lg:mx-auto my-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* My Last Challenges */}
        <div className="rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-6">My Last Created Challenges</h2>
          <div className="space-y-4">
            {challenges.length === 0 ? (
              <p className="text-center text-foreground/50 py-8">No challenges created yet</p>
            ) : (
              <>
                {challenges.slice(0, showAllChallenges ? challenges.length : 1).map((challenge) => (
                  <div
                    key={challenge.id}
                    className="rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="text-xs font-semibold tracking-widest mb-2">
                        {challenge.game?.title?.toUpperCase() || 'GAME'}
                      </div>
                      <div className="text-2xl font-semibold leading-tight mb-2">
                        {challenge.title}
                      </div>
                      <div className="leading-relaxed mb-4">{challenge.description}</div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-baseline gap-1">
                            <p className="text-sm font-semibold">{challenge.likes} Likes</p>
                          </div>
                          <span className="text-xs">
                            {new Date(challenge.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <Link
                          href={`/challenges/${challenge.slug}`}
                          className="px-4 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {challenges.length > 1 && (
            <button
              onClick={() => setShowAllChallenges(!showAllChallenges)}
              className="mt-4 w-full bg-(--button-select) hover:bg-(--button-select)/50 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {showAllChallenges ? 'Show Less' : `View All (${challenges.length})`}
            </button>
          )}
        </div>

        {/* My Last Participations */}
        <div className="rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden p-6">
          <h2 className="text-2xl font-bold mb-6">My Last Participations</h2>
          <div className="space-y-4">
            {participations.length === 0 ? (
              <p className="text-center text-background/50 py-8">No participations yet</p>
            ) : (
              <>
                {participations
                  .slice(0, showAllParticipations ? participations.length : 1)
                  .map((participation) => (
                    <div
                      key={participation.id}
                      className="rounded-2xl bg-(--button-area) ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden"
                    >
                      <div className="p-5 flex flex-col h-full">
                        <div className="text-xs font-semibold tracking-widest mb-2">
                          {participation.challenge?.game?.title?.toUpperCase() || 'GAME'}
                        </div>
                        <div className="text-2xl font-semibold leading-tight mb-2">
                          {participation.challenge?.title || 'Challenge'}
                        </div>
                        <div className="leading-relaxed mb-4">{participation.description}</div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-sm font-semibold">
                                {participation.likes} Likes
                              </span>
                            </div>
                            <span className="text-xs">
                              {new Date(participation.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <Link
                            href={`/challenges/${participation.challenge?.slug}?participationId=${participation.id}`}
                            className="px-4 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-sm font-semibold"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          {participations.length > 1 && (
            <button
              onClick={() => setShowAllParticipations(!showAllParticipations)}
              className="mt-4 w-full bg-(--button-select) hover:bg-(--button-select)/50 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {showAllParticipations ? 'Show Less' : `View All (${participations.length})`}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
