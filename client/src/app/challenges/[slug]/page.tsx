'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import PopUp from '@/component/Pop--up';
import LoginRegisterCard from '@/component/LoginRegisterCard';

// hook responsive
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

type Participation = {
  id: string;
  userId: string;
  name: string;
  description: string;
  scoreLabel: string;
  link?: string;
  hasVoted?: boolean;
  likes: number;
};

type User = {
  id: string;
  username: string;
  role: string;
} | null;

type ChallengeDetails = {
  id: string;
  slug: string;
  title: string;
  description: string;
  details: string[];
  scoreFormat: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdById: string;
  gameSlug?: string;
  gameId: string;
  gameTitle: string;
  gameImage: string;
  likes: number;
  hasVoted: boolean;
  participations: Participation[];
  creator: {
    id: string;
  };
};

// Description avec max 300 chars
const clamp300 = (s: string) => {
  const t = s ?? '';
  return t.length <= 300 ? t : t.slice(0, 300);
};

export default function ChallengeDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const searchParams = useSearchParams();

  const isMd = useMediaQuery('(min-width: 768px)');
  const defaultVisible = isMd ? 4 : 3;

  // core state
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // UI state
  const [challengeHasVoted, setChallengeHasVoted] = useState(false);
  const [challengeLikes, setChallengeLikes] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [isAllowToModifyOrDelete, setIsAllowToModifyOrDelete] = useState<boolean>(false);

  const [description, setDescription] = useState('');
  const [detailsPoints, setDetailsPoints] = useState<string[]>([]);

  const [participations, setParticipations] = useState<Participation[]>([]);
  const [visibleCount, setVisibleCount] = useState(defaultVisible);

  // Confirmation delete modal
  type ConfirmAction = 'delete-challenge' | 'delete-participation' | null;

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [confirmParticipationId, setConfirmParticipationId] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('view');
  const [activeParticipationId, setActiveParticipationId] = useState<string | null>(null);

  // Report
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [reportMessage, setReportMessage] = useState<string>('');
  const [reportTargetType, setReportTargetType] = useState<'CHALLENGE' | 'PARTICIPATION'>(
    'CHALLENGE'
  );
  const [reportTargetId, setReportTargetId] = useState<string>('');
  const [showSuccessReport, setShowSuccessReport] = useState<boolean>(false);
  const [reportResponseMessage, setReportResponseMessage] = useState<string>('');

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    window.setTimeout(() => setShowSuccessToast(false), 2000);
  };

  // Fonction de vérification de connexion
  const requireAuth = (message: string): boolean => {
    if (!user) {
      setReportResponseMessage(message);
      setShowSuccessReport(true);
      setTimeout(() => setShowSuccessReport(false), 4000);
      return false;
    }
    return true;
  };

  // Delete Challenge

  const confirmDeleteChallenge = async () => {
    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    const res = await fetch(`${baseUrl}/challenges/${challenge.id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to delete challenge');
      return;
    }

    // close confirm modal
    setConfirmAction(null);
    setConfirmParticipationId(null);

    // Redirection vers la liste des challenges
    router.push('/challenges');
  };

  // Champs du formulaire (create / edit)
  const [pDesc, setPDesc] = useState('');
  const [pLink, setPLink] = useState('');

  // Fetch challenge
  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${baseUrl}/challenges/${slug}`, {
          cache: 'no-store',
          credentials: 'include'
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Failed to load challenge (${res.status})`);
        }

        const data = await res.json();

        const raw = (data?.challenge ?? data) as any;

        // Normalisation
        const normalized: ChallengeDetails = {
          id: raw.id,
          slug: raw.slug,
          title: raw.title ?? '',
          description: raw.description ?? '',
          details: Array.isArray(raw.details) ? raw.details : [],
          scoreFormat: raw.scoreFormat ?? '',
          createdAt: raw.createdAt ?? '',
          updatedAt: raw.updatedAt ?? '',

          createdBy: raw.creator?.username ?? '—',
          createdById: raw.creator?.id ?? raw.createdBy ?? '',

          creator: {
            id: raw.creator?.id ?? raw.createdBy ?? ''
          },

          gameId: raw.gameId ?? raw.game?.id ?? '',
          gameTitle: raw.game?.title ?? raw.gameTitle ?? '',
          gameImage: raw.game?.imageUrl ?? raw.gameImage ?? '',
          gameSlug: raw.game?.slug ?? raw.gameSlug ?? raw.game?.id ?? raw.gameId ?? '',

          likes: raw.voteCount ?? raw.likes ?? 0,
          hasVoted: Boolean(raw.hasVoted),

          participations: (raw.participations ?? []).map((p: any) => ({
            id: p.id,
            userId: p.userId,
            name: p.user?.username ?? p.user?.name ?? p.username ?? '—',
            description: p.description ?? '',
            scoreLabel: p.scoreLabel ?? '-', // pas en seed -> placeholder
            link: p.submissionUrl ?? p.link ?? undefined,
            likes: p.voteCount ?? p.likes ?? 0,
            hasVoted: Boolean(p.hasVoted)
          }))
        };

        if (!cancelled) {
          setChallenge(normalized);
        }
      } catch (e: any) {
        if (!cancelled) {
          setLoadError(e?.message ?? 'Failed to load');
          setChallenge(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setChallengeHasVoted(Boolean(challenge.hasVoted));
    setChallengeLikes(challenge.likes);

    setIsAllowToModifyOrDelete(user?.id === challenge.createdById);

    setIsEditing(false);
    setTitle(challenge.title);
    setImageUrl(undefined); // API n’a pas image custom dans la seed

    setDescription(challenge.description ?? '');
    setDetailsPoints(challenge.details ?? []);

    setParticipations(challenge.participations ?? []);
  }, [challenge]);

  useEffect(() => {
    setVisibleCount(defaultVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMd]);

  const activeParticipation = useMemo(() => {
    if (!activeParticipationId) {
      return null;
    }
    return participations.find((p) => p.id === activeParticipationId) ?? null;
  }, [activeParticipationId, participations]);

  const currentUserId = user?.id ?? ''; // à revoir avec l'auth
  const isOwnActiveParticipation = Boolean(
    activeParticipation && activeParticipation.userId === currentUserId
  );

  useEffect(() => {
    const participationId = searchParams.get('participationId');
    if (!participationId) {
      return;
    }

    const p = participations.find((x) => x.id === participationId);
    if (!p) {
      return;
    }

    setModalMode('view');
    setActiveParticipationId(participationId);
    setPDesc(p.description ?? '');
    setPLink(p.link ?? '');
    setIsModalOpen(true);
  }, [searchParams, participations]);

  // Helpers UI
  const headerImage = imageUrl?.trim()
    ? imageUrl
    : challenge?.gameImage?.trim()
      ? challenge.gameImage
      : '/real-rat.png';

  const formatLikes = (n: number) => `${n}`;

  const displayedParticipations = participations.slice(0, visibleCount);
  const canViewMore = visibleCount < participations.length;

  const saveEdits = async () => {
    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const payload = {
      title: title.trim(),
      scoreFormat: challenge.scoreFormat,
      description: clamp300(description),
      details: detailsPoints.filter((d) => d.trim())
    };

    const res = await fetch(`${baseUrl}/challenges/${challenge.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to save');
      return;
    }

    setChallenge((prev) =>
      prev
        ? {
            ...prev,
            title: payload.title,
            description: payload.description,
            details: payload.details
          }
        : prev
    );

    setIsEditing(false);
  };

  const cancelEdits = () => {
    if (!challenge) {
      return;
    }
    setTitle(challenge.title);
    setDescription(challenge.description ?? '');
    setDetailsPoints(challenge.details ?? []);
    setIsEditing(false);
  };

  const addBullet = (kind: 'desc' | 'details') => {
    setDetailsPoints((p) => [...p, '']);
  };

  const updateBullet = (kind: 'desc' | 'details', idx: number, val: string) => {
    setDetailsPoints((p) => p.map((x, i) => (i === idx ? val : x)));
  };

  const removeBullet = (kind: 'desc' | 'details', idx: number) => {
    setDetailsPoints((p) => p.filter((_, i) => i !== idx));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMode('view');
    setActiveParticipationId(null);
    setPDesc('');
    setPLink('');
  };

  const openCreateModal = () => {
    setModalMode('create');
    setActiveParticipationId(null);
    setPDesc('');
    setPLink('');
    setIsModalOpen(true);
  };

  const openViewModal = (pId: string) => {
    const p = participations.find((x) => x.id === pId);
    setModalMode('view');
    setActiveParticipationId(pId);
    setPDesc(p?.description ?? '');
    setPLink(p?.link ?? '');
    setIsModalOpen(true);
  };

  const openEditModalForActive = () => {
    if (!activeParticipation) {
      return;
    }
    setModalMode('edit');
    setPDesc(activeParticipation.description ?? '');
    setPLink(activeParticipation.link ?? '');
  };

  // Ces 3 actions nécessitent des routes côté Express (participations)
  const submitCreate = async () => {
    if (!challenge) {
      return;
    }
    const desc = pDesc.trim();
    const link = pLink.trim();
    if (!desc) {
      return;
    }

    // POST /challenges/:id/participations
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/challenges/${challenge.id}/participations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ submissionUrl: link || undefined, description: desc })
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to create participation');
      return;
    }

    const data = await res.json().catch(() => null);
    const created = (data?.participation ?? data) as any;

    const newP: Participation = {
      id: created?.id ?? `p_${Date.now()}`,
      userId: created?.userId ?? currentUserId,
      name: created?.user?.username ?? user?.username ?? 'Username',
      scoreLabel: '-',
      description: created?.description ?? desc,
      link: created?.submissionUrl ?? (link || undefined),
      hasVoted: false,
      likes: 0
    };

    setParticipations((prev) => [newP, ...prev]);
    triggerSuccessToast();
    closeModal();
  };

  const saveEdit = async () => {
    if (!activeParticipation) {
      return;
    }
    const desc = pDesc.trim();
    const link = pLink.trim();
    if (!desc) {
      return;
    }

    // PATCH /participations/:id
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${activeParticipation.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ description: desc, submissionUrl: link || null })
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to update participation');
      return;
    }

    setParticipations((prev) =>
      prev.map((x) =>
        x.id === activeParticipation.id ? { ...x, description: desc, link: link || undefined } : x
      )
    );

    setModalMode('view');
  };

  const deleteActiveParticipation = async () => {
    if (!activeParticipation) {
      return;
    }

    // DELETE /participations/:id
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${activeParticipation.id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to delete participation');
      return;
    }

    setParticipations((prev) => prev.filter((x) => x.id !== activeParticipation.id));
    closeModal();
  };

  // Like challenge
  const toggleChallengeLike = async () => {
    // ⬇️ VÉRIFICATION AJOUTÉE ICI
    if (!requireAuth('❤️ Please login to like this challenge')) {
      return; // Stop si pas connecté
    }

    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (challengeHasVoted) {
      await fetch(`${baseUrl}/challengeVote/challenges/${challenge.id}/vote`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setChallengeHasVoted(false);
      setChallengeLikes(challengeLikes - 1);
    } else {
      await fetch(`${baseUrl}/challengeVote/challenges/${challenge.id}/vote`, {
        method: 'POST',
        credentials: 'include'
      });
      setChallengeHasVoted(true);
      setChallengeLikes(challengeLikes + 1);
    }
  };

  const toggleParticipationLike = async (p: Participation) => {
    // ⬇️ VÉRIFICATION AJOUTÉE ICI
    if (!requireAuth('❤️ Please login to like this participation')) {
      return; // Stop si pas connecté
    }

    if (!challenge) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      if (p.hasVoted) {
        // Unlike
        await fetch(`${baseUrl}/participationVote/participations/${p.id}/vote`, {
          method: 'DELETE',
          credentials: 'include'
        });

        setParticipations((prev) =>
          prev.map((participation) =>
            participation.id === p.id
              ? {
                  ...participation,
                  hasVoted: false,
                  likes: Math.max(0, participation.likes - 1)
                }
              : participation
          )
        );
      } else {
        // Like
        await fetch(`${baseUrl}/participationVote/participations/${p.id}/vote`, {
          method: 'POST',
          credentials: 'include'
        });

        setParticipations((prev) =>
          prev.map((participation) =>
            participation.id === p.id
              ? {
                  ...participation,
                  hasVoted: true,
                  likes: participation.likes + 1
                }
              : participation
          )
        );
      }
    } catch (error) {
      console.error('Error toggling participation vote:', error);
    }
  };

  const onToggleChallengeLike = () => {
    toggleChallengeLike();
  };

  const onToggleParticipationLike = (pId: string) => {
    const p = participations.find((x) => x.id === pId);
    if (!p) {
      return;
    }
    toggleParticipationLike(p);
  };

  const removeParticipation = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${baseUrl}/participation/participations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      alert(msg || 'Failed to delete participation');
      return;
    }

    setParticipations((prev) => prev.filter((x) => x.id !== id));
    if (activeParticipationId === id) {
      closeModal();
    }
  };

  const confirmDelete = async () => {
    if (confirmAction === 'delete-challenge' && challenge) {
      await confirmDeleteChallenge();
    }

    if (confirmAction === 'delete-participation' && confirmParticipationId) {
      await removeParticipation(confirmParticipationId);
    }

    setConfirmAction(null);
    setConfirmParticipationId(null);
  };

  const cancelDelete = () => {
    setConfirmAction(null);
    setConfirmParticipationId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen   flex items-center justify-center">
        <div className="foreground/70">Loading...</div>
      </div>
    );
  }

  if (loadError || !challenge) {
    return (
      <div className="min-h-screen   flex items-center justify-center px-6">
        <div className="text-center">
          <div className=" font-semibold">Challenge not found</div>
          <div className="foreground/60 mt-2">
            {loadError ? loadError : 'No data returned from API.'}
          </div>
        </div>
      </div>
    );
  }

  const autoResizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  // Modal report a person

  function modalReport() {
    return (
      <div>
        {openReportModal ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 px-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setOpenReportModal(false);
                setReportMessage('');
              }
            }}
          >
            <div className="w-full max-w-107.5 md:max-w-xl rounded-3xl bg-(--button-area) ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="px-5 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="font-semibold">
                  Report {reportTargetType === 'CHALLENGE' ? 'Challenge' : 'Participation'}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpenReportModal(false);
                    setReportMessage('');
                  }}
                  className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-foreground/80 mb-2">
                    Why are you reporting this content?{' '}
                    <span className="opacity-25">Minimum 10 character</span>
                  </div>
                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    className="w-full rounded-2xl bg-background/30 ring-1 ring-background/10 p-3 text-sm text-foreground/90 focus:outline-none resize-none min-h-30"
                    placeholder="Please describe the reason for your report..."
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-foreground/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenReportModal(false);
                    setReportMessage('');
                  }}
                  className="px-4 py-2 rounded-2xl bg-(--error-text-message) hover:bg-(--error-text-message)/60 ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={sendReportMessage}
                  disabled={!reportMessage.trim()}
                  className="px-8 py-2.5 rounded-full bg-(--button-delete) hover:bg-(--button-delete-hover) font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // Check connected on press button
  function userConnectedCheck(
    user: User,
    p: Participation | ChallengeDetails,
    reportType: 'PARTICIPATION' | 'CHALLENGE',
    e: React.SyntheticEvent<EventTarget>
  ) {
    if (!user) {
      setReportResponseMessage('⚠️ Please login to report');
      PopUp('pouet');
      const triggerSuccessReport = () => {
        setShowSuccessReport(true);
        window.setTimeout(() => setShowSuccessReport(false), 2000);
      };
      triggerSuccessReport();
    } else if (reportType === 'PARTICIPATION') {
      e.stopPropagation();
      setReportTargetType('PARTICIPATION');
      setReportTargetId(p.id);
      setOpenReportModal(true);
    } else {
      e.stopPropagation();
      setReportTargetType('CHALLENGE');
      setReportTargetId(p.id);
      setOpenReportModal(true);
    }
  }

  // POST report a person

  const sendReportMessage = async () => {
    if (!reportMessage.trim()) {
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

    try {
      const res = await fetch(`${baseUrl}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          targetType: reportTargetType,
          targetId: reportTargetId,
          reason: reportMessage.trim()
        })
      });
      const triggerSuccessReport = () => {
        setShowSuccessReport(true);
        window.setTimeout(() => setShowSuccessReport(false), 2000);
      };
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setReportResponseMessage(data.message);
        triggerSuccessReport();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setReportResponseMessage(data.message);

      triggerSuccessReport();
      setOpenReportModal(false);
      setReportMessage('');
      setReportTargetType('CHALLENGE');
      setReportTargetId('');
    } catch (error) {
      PopUp('');
    }
  };

  const isDescriptionValid = description.trim().length > 0;

  return (
    <div className="min-h-screen ">
      <main className="mx-auto w-full max-w-107.5 md:max-w-5xl px-4 md:px-8 py-5 md:py-8">
        {showSuccessToast ? PopUp('✅ Your participation is registered !') : null}
        {showSuccessReport ? PopUp(`${reportResponseMessage}`) : null}
        <div className="rounded-3xl bg-(--background-header)/70 ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="relative h-32 md:h-48 lg:h-64 w-full bg-(--button-area)">
            <Image src={headerImage} alt={title} fill sizes="430px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-tfrom-foreground/65 via-foreground/15 to-transparent" />
          </div>

          <div className="p-5 md:p-8">
            <div className="flex items-start justify-between gap-3">
              {!isEditing ? (
                <h1 className="text-2xl md:text-4xl font-semibold leading-tight">{title}</h1>
              ) : (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-2xl font-semibold focus:outline-none"
                  placeholder="Challenge title"
                />
              )}
              <div className="flex">
                <button
                  type="button"
                  onClick={(e) => {
                    userConnectedCheck(user, challenge, 'CHALLENGE', e);
                  }}
                  className="mr-5 rounded-2xl px-2 -translate-y-3 hover:scale-150 transition-transform duration-200 cursor-pointer"
                >
                  ⚠️
                </button>
                <div className="flex flex-col items-center leading-none">
                <button
                  type="button"
                  onClick={onToggleChallengeLike}
                  className={`
                    relative w-10 h-10 shrink-0 cursor-pointer
                    transition-transform duration-200
                    hover:scale-125
                    ${!user ? 'opacity-40' : 'opacity-100'}
                  `}
                  aria-pressed={challengeHasVoted}
                  aria-label={
                    !user 
                      ? 'Sign in to like this challenge' 
                      : (challengeHasVoted ? 'Unlike challenge' : 'Like challenge')
                  }
                >
                    <Image
                      src={challengeHasVoted ? '/like 0.png' : '/like 1.png'}
                      alt={challengeHasVoted ? 'Voted' : 'Not Voted'}
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </button>
                  <div className="mt-1 text-xs text-foreground/70">
                    {formatLikes(challengeLikes)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-foreground/80">
                <div className="text-sm">
                  <span className="text-foreground/60">Game :</span>{' '}
                  <Link
                    href={`/games/${challenge.gameSlug ?? challenge.gameId}`}
                    className="text-xs font-semibold tracking-widest text-(--button-select)/90 mb-2 hover:underline"
                  >
                    {challenge.gameTitle}
                  </Link>
                </div>
                <div className="text-sm">
                  <span className="text-foreground/60">Created by</span>{' '}
                  <span className="font-semibold">{challenge.createdBy}</span>
                </div>
              </div>

              {!isEditing ? (
                isAllowToModifyOrDelete ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  >
                    Modify
                  </button>
                ) : (
                  <div></div>
                )
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEdits}
                    className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdits}
                    className={`
                      px-4 py-2
                      rounded-2xl
                      text-sm font-semibold
                      shadow-[0_10px_20px_rgba(0,0,0,0.35)]
                      transition
                      ${
                        isDescriptionValid
                          ? 'bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover)'
                          : 'bg-(--button-game-challenge)/40 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-4">
                <div className="text-sm font-semibold text-foreground/80 mb-2">Image URL</div>
                <input
                  value={imageUrl ?? ''}
                  onChange={(e) => setImageUrl(e.target.value || undefined)}
                  className="w-full bg-foreground/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  placeholder="https://..."
                />
                <div className="text-xs text-foreground/50 mt-2">
                  Laisse vide pour afficher l’image du jeu par défaut.
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Description :</div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-(--searchbar-color) ring-1 ring-background/10 p-3">
                {!isEditing ? (
                  <div className="text-foreground/85 whitespace-pre-wrap wrap-break-word">
                    {description}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <textarea
                      value={description}
                      maxLength={300}
                      ref={(el) => {
                        if (el) {
                          autoResizeTextarea(el);
                        }
                      }}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        autoResizeTextarea(e.target);
                      }}
                      className="
                        flex-1
                        bg-(--background-header)/40
                        ring-1 ring-background/10
                        rounded-xl
                        px-3 py-2
                        text-sm
                        focus:outline-none
                        resize-none
                        overflow-hidden
                        min-h-11
                      "
                      placeholder={
                        isDescriptionValid ? 'Description (max 300 chars)' : 'Description required'
                      }
                    />
                    <div className="text-xs text-foreground/50 w-12 text-right pt-2">
                      {description.length}/300
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-(--button-select)" />
                  <div className="font-semibold">Challenge Rules :</div>
                </div>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => addBullet('details')}
                    className="text-sm text-foreground/70 hover:text-foreground"
                  >
                    + Add
                  </button>
                ) : null}
              </div>

              <div className="mt-3 rounded-2xl bg-(--searchbar-color) ring-1 ring-background/10 p-3">
                <ul className="space-y-2">
                  {detailsPoints.map((txt, idx) => (
                    <li key={`det-${idx}`} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-foreground/70 shrink-0" />
                      {!isEditing ? (
                        <div className="text-foreground/85">{txt}</div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            value={txt}
                            onChange={(e) => updateBullet('details', idx, e.target.value)}
                            className="flex-1 bg-(--background-header)/40 ring-1 ring-background/10 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet('details', idx)}
                            className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                            aria-label="Remove detail item"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {isAllowToModifyOrDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmAction('delete-challenge')}
                  className="
                    px-4 py-2
                    rounded-2xl
                    bg-(--button-delete)
                    hover:bg-(--button-delete-hover)
                    ring-1 ring-background/10
                    text-sm font-semibold
                    shadow-[0_10px_20px_rgba(0,0,0,0.35)]
                  "
                  aria-label="Delete challenge"
                >
                  🗑 Delete challenge
                </button>
              ) : (
                <div />
              )}

              {user ? (
                <button
                  type="button"
                  className="group relative px-10 py-3 rounded-full bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) font-semibold shadow-lg shadow-(--button-game-challenge-hover)/30 hover:shadow-[0_0_40px_rgba(133,84,218,1)] hover:scale-110 transition-all duration-300 overflow-hidden animate-pulse-glow"
                  onClick={openCreateModal}
                >
                  {/* Effet shimmer au hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-transparent via-foreground/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

                  {/* Texte */}
                  <span className="relative z-10">Participate</span>
                </button>
              ) : (
                <LoginRegisterCard message="Sign up to participate in this challenge" />
              )}
            </div>
          </div>
        </div>

        {/* Participations list */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedParticipations.map((p) => (
            <div
              key={p.id}
              onClick={() => openViewModal(p.id)}
              className="cursor-pointer rounded-2xl bg-(--button-area) ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-(--button-select)">{p.name}</div>
                  <div className="foreground/70 text-sm line-clamp-2 wrap-break-word min-h-10">
                    {p.description}
                  </div>
                  {p.link ? (
                    <div className="opacity-60 text-sm line-clamp-1 wrap-break-word">
                      <span className="foreground/60 ">Link :</span> {p.link}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex flex-col items-center leading-none"
                  >
                    <div className="flex">
                      {p.userId !== currentUserId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            userConnectedCheck(user, p, 'PARTICIPATION', e);
                          }}
                          className="mr-5 rounded-2xl px-2 -translate-y-3 hover:scale-150 transition-transform duration-200 cursor-pointer"
                          aria-label="Report participation"
                        >
                          ⚠️
                        </button>
                      )}
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => onToggleParticipationLike(p.id)}
                          className={`
                            relative w-8 h-8 cursor-pointer
                            transition-transform duration-200
                            hover:scale-125
                            ${!user ? 'opacity-40' : 'opacity-100'}
                          `}
                          aria-pressed={!!p.hasVoted}
                          aria-label={
                            !user 
                              ? 'Sign in to like this participation' 
                              : (p.hasVoted ? 'Unlike participation' : 'Like participation')
                          }
                        >
                          <Image
                            src={p.hasVoted ? '/like 0.png' : '/like 1.png'}
                            alt={p.hasVoted ? 'Voted' : 'Not Voted'}
                            fill
                            sizes="32px"
                            className="object-contain"
                          />
                        </button>
                        <div className="mt-1 text-xs text-center foreground/70">
                          {formatLikes(p.likes)}
                        </div>
                      </div>
                    </div>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmAction('delete-participation');
                          setConfirmParticipationId(p.id);
                        }}
                        className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                        aria-label="Remove participation"
                      >
                        🗑
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canViewMore ? (
          <div className="mt-5 flex justify-center pb-8">
            <button
              type="button"
              className="px-6 py-2 rounded-full bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold"
              onClick={() =>
                setVisibleCount((v) => Math.min(v + defaultVisible, participations.length))
              }
            >
              View more
            </button>
          </div>
        ) : null}

        {/* Modals */}
        {isModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 px-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="w-full max-w-107.5 md:max-w-xl rounded-3xl bg-(--button-area) ring-1 ring-background/10 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="px-5 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="font-semibold">
                  {modalMode === 'create' ? 'New participation' : 'Participation'}
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-foreground/80 mb-2">Description</div>
                  {modalMode === 'view' ? (
                    <div className="rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3 text-foreground/85 whitespace-pre-wrap wrap-break-word max-h-[50vh] overflow-auto">
                      {activeParticipation?.description ?? ''}
                    </div>
                  ) : (
                    <textarea
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950/30 ring-1 ring-background/10 p-3 text-sm text-foreground/90 focus:outline-none resize-none min-h-25"
                      placeholder="Your participation description..."
                    />
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground/80 mb-2">Link</div>
                  {modalMode === 'view' ? (
                    <div className="rounded-2xl bg-background/30 ring-1 ring-background/10 p-3 text-foreground/85 break-all">
                      {activeParticipation?.link ? activeParticipation.link : '—'}
                    </div>
                  ) : (
                    <input
                      value={pLink}
                      onChange={(e) => setPLink(e.target.value)}
                      className="w-full rounded-2xl bg-slate-950/30 ring-1 ring-background/10 px-3 py-3 text-sm text-foreground/90 focus:outline-none"
                      placeholder="https://..."
                    />
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-foreground/10 flex items-center justify-end gap-2">
                {modalMode === 'view' ? (
                  <>
                    {isOwnActiveParticipation ? (
                      <>
                        <button
                          type="button"
                          onClick={openEditModalForActive}
                          className="px-4 py-2 rounded-2xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                        >
                          Modify
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction('delete-participation');
                            setConfirmParticipationId(activeParticipation?.id ?? null);
                          }}
                          className="px-4 py-2 rounded-2xl bg-(--button-delete) hover:bg-(--button-delete-hover) ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                          aria-label="Delete participation"
                          title="Delete"
                        >
                          🗑 Delete
                        </button>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (modalMode === 'edit') {
                          setModalMode('view');
                        } else {
                          closeModal();
                        }
                      }}
                      className="px-4 py-2 rounded-2xl bg-(--error-text-message) hover:bg-(--error-text-message)/60 ring-1 ring-background/10 text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={modalMode === 'create' ? submitCreate : saveEdit}
                      className="px-8 py-2.5 rounded-full bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) font-semibold shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
        {openReportModal ? modalReport() : <p></p>}
      </main>

      {/* Delete modal */}
      {confirmAction ? (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-foreground/50 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              cancelDelete();
            }
          }}
        >
          <div
            className="
              w-full max-w-md
              rounded-3xl
              bg-(--button-area)
              ring-1 ring-background/10
              shadow-[0_20px_60px_rgba(0,0,0,0.65)]
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-background/10 flex items-center justify-between">
              <div className="font-semibold text-lg">Delete</div>

              <button
                type="button"
                onClick={cancelDelete}
                className="px-3 py-2 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover)"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center space-y-4">
              <div className="text-foreground/90 text-lg font-semibold">Are you sure?</div>
              <div className="text-foreground/70 text-sm">This action is irreversible.</div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-foreground/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                className="
                    px-4 py-2
                    rounded-2xl
                    bg-(--button-delete)
                    hover:bg-(--button-delete-hover)
                    ring-1 ring-background/10
                    text-sm font-semibold
                    shadow-[0_10px_20px_rgba(0,0,0,0.35)]
                  "
              >
                🗑 Confirm delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
