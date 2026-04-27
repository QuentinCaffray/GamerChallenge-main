'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  fetchAllUsers,
  banUser,
  unbanUser,
  fetchReportedChallenges,
  fetchReportedParticipations,
  approveContent,
  deleteReportedChallenge,
  deleteReportedParticipation,
  type User,
  type ReportedChallenge,
  type ReportedParticipation
} from '@/lib/api';

type Tab = 'users' | 'challenges' | 'participations';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [challenges, setChallenges] = useState<ReportedChallenge[]>([]);
  const [participations, setParticipations] = useState<ReportedParticipation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true); // ✅ Renommé pour clarté

  useEffect(() => {
    async function checkAccessAndLoadData() {
      // Attendre que le user soit chargé
      if (user === null) {
        return;
      }

      // Vérifier authentification
      if (!user) {
        router.push('/login-register/login');
        return;
      }

      // Vérifier droits admin
      if (user.role !== 'ADMIN') {
        router.push('/');
        return;
      }

      setLoading(false);

      // Charger les données une seule fois
      if (dataLoading) {
        try {
          const [usersData, challengesData, participationsData] = await Promise.all([
            fetchAllUsers(),
            fetchReportedChallenges(),
            fetchReportedParticipations()
          ]);

          setUsers(usersData);
          setChallenges(challengesData);
          setParticipations(participationsData);
          setDataLoading(false); // ✅ Mettre à false après chargement
        } catch (err: any) {
          setError(err.message || 'Failed to load data');
          setDataLoading(false); // ✅ Mettre à false même en cas d'erreur
        }
      }
    }

    checkAccessAndLoadData();
  }, [user, router, dataLoading]);

  const handleBan = async (userId: string) => {
    if (!confirm('Ban this user?')) return;

    try {
      setActionLoading(userId);
      await banUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBanned: true, bannedAt: new Date().toISOString() } : u
        )
      );
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      setActionLoading(userId);
      await unbanUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: false, bannedAt: null } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveChallenge = async (challengeId: string) => {
    try {
      setActionLoading(challengeId);
      await approveContent('CHALLENGE', challengeId);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (!confirm('Delete this challenge? (cascade)')) return;

    try {
      setActionLoading(challengeId);
      await deleteReportedChallenge(challengeId);
      setChallenges((prev) => prev.filter((c) => c.id !== challengeId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveParticipation = async (participationId: string) => {
    try {
      setActionLoading(participationId);
      await approveContent('PARTICIPATION', participationId);
      setParticipations((prev) => prev.filter((p) => p.id !== participationId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteParticipation = async (participationId: string) => {
    if (!confirm('Delete this participation? (cascade)')) return;

    try {
      setActionLoading(participationId);
      await deleteReportedParticipation(participationId);
      setParticipations((prev) => prev.filter((p) => p.id !== participationId));
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setActionLoading(null);
    }
  };

  const getUserDisplayName = (u: User) => {
    if (u.isDeleted) return 'Deleted user';
    if (u.isBanned) return 'Banned user';
    return u.username;
  };

  // Afficher loading pendant vérification accès
  if (loading || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // L'utilisateur n'a pas accès
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // Afficher erreur si le chargement a échoué
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-(--error-text-message)">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 border-l-4 border-(--button-select) pl-3">
          Moderation
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-(--button-select)'
                : 'bg-(--background-header) text-foreground/70 hover:bg-(--background-header)/50'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'challenges'
                ? 'bg-(--button-select)'
                : 'bg-(--background-header) text-foreground/70 hover:bg-(--background-header)/50'
            }`}
          >
            Reported Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('participations')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === 'participations'
                ? 'bg-(--button-select)'
                : 'bg-(--background-header) text-foreground/70 hover:bg-(--background-header)/50'
            }`}
          >
            Reported Participations ({participations.length})
          </button>
        </div>

        <div className="bg-(--background-header)/90 rounded-2xl ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden">
          {activeTab === 'users' && (
            <UsersTab
              users={users}
              loading={dataLoading} // ✅ Utiliser dataLoading au lieu de usersLoading
              actionLoading={actionLoading}
              onBan={handleBan}
              onUnban={handleUnban}
              getUserDisplayName={getUserDisplayName}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesTab
              challenges={challenges}
              loading={dataLoading} // ✅ Utiliser dataLoading
              actionLoading={actionLoading}
              onApprove={handleApproveChallenge}
              onDelete={handleDeleteChallenge}
            />
          )}

          {activeTab === 'participations' && (
            <ParticipationsTab
              participations={participations}
              loading={dataLoading} // ✅ Utiliser dataLoading
              actionLoading={actionLoading}
              onApprove={handleApproveParticipation}
              onDelete={handleDeleteParticipation}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Les composants UsersTab, ChallengesTab, ParticipationsTab restent identiques
function UsersTab({
  users,
  loading,
  actionLoading,
  onBan,
  onUnban,
  getUserDisplayName
}: {
  users: User[];
  loading: boolean;
  actionLoading: string | null;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  getUserDisplayName: (u: User) => string;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="p-6 text-center text-foreground/70">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-(--background-header)/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Challenges</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Participations</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-(--background-header)50">
              <td className="px-4 py-3">
                <span className={u.isDeleted || u.isBanned ? 'text-(--error-text-message)' : ''}>
                  {getUserDisplayName(u)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-foreground/70">{u.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.role === 'ADMIN'
                      ? 'bg-(--button-select)/20 text-(--button-select)'
                      : 'bg-(--header-button-area) text-foreground/70'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3">
                {u.isBanned ? (
                  <span className="text-(--error-text-message) text-sm">Banned</span>
                ) : u.isDeleted ? (
                  <span className="text-foreground/50 text-sm">Deleted</span>
                ) : (
                  <span className="text-(--profile-save-button) text-sm">Active</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-foreground/70">{u._count.createdChallenges}</td>
              <td className="px-4 py-3 text-sm text-foreground/70">{u._count.participations}</td>
              <td className="px-4 py-3">
                {u.role !== 'ADMIN' && (
                  <>
                    {u.isBanned ? (
                      <button
                        onClick={() => onUnban(u.id)}
                        disabled={actionLoading === u.id}
                        className="px-3 py-1 rounded-lg bg-(--profile-save-button)/80 hover:bg-(--profile-save-button) text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '...' : 'Unban'}
                      </button>
                    ) : (
                      <button
                        onClick={() => onBan(u.id)}
                        disabled={actionLoading === u.id || u.isDeleted}
                        className="px-3 py-1 rounded-lg bg-(--danger-button)/80 hover:bg-(--danger-button) text-xs font-semibold disabled:opacity-50"
                      >
                        {actionLoading === u.id ? '...' : 'Ban'}
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChallengesTab({
  challenges,
  loading,
  actionLoading,
  onApprove,
  onDelete
}: {
  challenges: ReportedChallenge[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (challenges.length === 0) {
    return <div className="p-6 text-center text-foreground/70">No reported challenges</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {challenges.map((c) => (
        <div key={c.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm">
                <span className=" font-semibold">Creator : </span>{' '}
                <span className="text-foreground/70">{c.creator.username}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Title : </span>{' '}
                <span className="text-foreground/70">{c.title}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Description : </span>{' '}
                <span className="text-foreground/70">{c.description}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Game : </span>{' '}
                <span className="text-foreground/70">{c.game.title}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Participations : </span>{' '}
                <span className="text-foreground/70">{c._count.participations}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Votes : </span>{' '}
                <span className="text-foreground/70">{c._count.votes}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-(--error-area-message) text-(--error-text-message) rounded text-xs font-semibold">
              {c.reportCount} report{c.reportCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-sm font-semibold">Reports :</p>
            {c.reports.slice(0, 3).map((r) => (
              <div key={r.id} className="text-sm text-foreground/70 pl-4">
                {r.reason} (by {r.user.username})
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(c.id)}
              disabled={actionLoading === c.id}
              className="px-3 py-1 rounded-lg bg-(--profile-save-button)/80 hover:bg-(--profile-save-button) text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === c.id ? '...' : 'Approve'}
            </button>
            <button
              onClick={() => onDelete(c.id)}
              disabled={actionLoading === c.id}
              className="px-3 py-1 rounded-lg bg-(--danger-button)/80 hover:bg-(--danger-button) text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === c.id ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ParticipationsTab({
  participations,
  loading,
  actionLoading,
  onApprove,
  onDelete
}: {
  participations: ReportedParticipation[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (participations.length === 0) {
    return <div className="p-6 text-center text-foreground/70">No reported participations</div>;
  }

  return (
    <div className="p-4 space-y-4">
      {participations.map((p) => (
        <div
          key={p.id}
          className="bg-(--background-header)/50 rounded-lg p-4 border border-(--header-button-area)"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm">
                <span className=" font-semibold">Author :</span>{' '}
                <span className="text-foreground/70">{p.user.username}</span>
              </p>
              <p className="text-sm">
                <span className=" font-semibold">Challenge :</span>{' '}
                <span className="text-foreground/70">{p.challenge.title}</span>
              </p>
              {p.description && (
                <p className="text-sm">
                  <span className=" font-semibold">Description :</span>{' '}
                  <span className="text-foreground/70">{p.description}</span>
                </p>
              )}
              <a
                href={p.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-(--button-select)/60 hover:underline"
              >
                View submission
              </a>
              <p className="text-sm">
                <span className=" font-semibold">Votes :</span>{' '}
                <span className="text-foreground/70">{p._count.votes}</span>
              </p>
            </div>
            <span className="px-2 py-1 bg-(--error-text-message)/30 text-(--error-text-message) rounded text-xs font-semibold">
              {p.reportCount} report{p.reportCount > 1 ? 's' : ''}
            </span>
          </div>

          <div className="mb-3 space-y-2">
            <p className="text-sm font-semibold">Reports :</p>
            {p.reports.slice(0, 3).map((r) => (
              <div key={r.id} className="text-sm text-foreground/70 pl-4">
                {r.reason} (by {r.user.username})
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(p.id)}
              disabled={actionLoading === p.id}
              className="px-3 py-1 rounded-lg bg-(--profile-save-button)/80 hover:bg-(--profile-save-button) text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === p.id ? '...' : 'Approve'}
            </button>
            <button
              onClick={() => onDelete(p.id)}
              disabled={actionLoading === p.id}
              className="px-3 py-1 rounded-lg bg-(--danger-button)/80 hover:bg-(--danger-button) text-xs font-semibold disabled:opacity-50"
            >
              {actionLoading === p.id ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
