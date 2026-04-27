'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ChallengeCard from '@/component/ChallengeCard';
import SearchBar from '@/component/SearchBar';
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

type Game = { id: string; title: string; imageUrl: string };
type Challenge = {
  createdAt: string;
  createdBy: string;
  description: string;
  game: {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    slug: string;
  };
  gameId: string;
  id: string;
  // optional slug used for links
  slug?: string;
  scoreFormat: string;
  title: string;
  updatedAt: string;
  voteCount: number;
  // optional flag indicating whether the current user has liked the challenge
  hasLiked?: boolean;
};

// Search filter function
function filterOrderingChallenges(
  challenges: Challenge[],
  orderFilterSearchbar: string,
  filterSelectorChoice: string
) {
  const sorted = [...challenges];
  if (filterSelectorChoice === 'Popularity') {
    sorted.sort((a, b) => {
      if (orderFilterSearchbar === 'ASC') {
        return a.voteCount - b.voteCount;
      } else {
        return b.voteCount - a.voteCount;
      }
    });
  } else if (filterSelectorChoice === 'Date added') {
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (orderFilterSearchbar === 'ASC') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  } else {
    sorted.sort((a, b) => {
      if (orderFilterSearchbar === 'ASC') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }
  return sorted;
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filterModalArea, setFilterModalArea] = useState<boolean>(false);

  const [orderFilterSearchbar, setOrderFilterSearchBar] = useState<'ASC' | 'DESC'>('ASC');
  const [filterSelectorChoice, setFilterSelectorChoice] = useState<
    'Popularity' | 'Date added' | 'Alphabetical'
  >('Date added');

  const isMd = useMediaQuery('(min-width: 768px)');
  const isL = useMediaQuery('(min-width: 1464px)');
  const isXL = useMediaQuery('(min-width: 1888px)');
  const isXXL = useMediaQuery('(min-width: 2312px)');

  const itemsPerPage = isXXL ? 15 : isXL ? 12 : isL ? 9 : isMd ? 6 : 4;

  /* ======================
    API CALLS
  ====================== */

  useEffect(() => {
    async function fetchGames() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/games`);
      const data = await res.json();
      setGames(data.games || []);
    }

    fetchGames();
  }, []);

  useEffect(() => {
    async function fetchChallenges() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/challenges`);
      const data = await res.json();

      // on s'assure que voteCount existe
      const list = (data.challenges || data || []).map((c: Partial<Challenge>) => ({
        ...c,
        voteCount: c.voteCount ?? 0
      })) as Challenge[];

      setChallenges(list);
    }

    fetchChallenges();
  }, []);

  function extractShortDescription(raw: string) {
    const text = (raw ?? '').replace(/\r\n/g, '\n').trim();

    // coupe dès qu’on voit une ligne "Details" (avec ou sans :)
    const idx = text.search(/\n\s*details\s*:?\s*\n/i);

    if (idx === -1) {
      return text;
    }
    return text.slice(0, idx).trim();
  }

  /* ======================
    FILTERING
  ====================== */

  const filteredChallenges = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return challenges.filter((c) => {
      const matchesGame = !selectedGameId || c.gameId === selectedGameId;

      if (!q) {
        return matchesGame;
      }

      const matchesQuery =
        c.title.toLowerCase().includes(q) || c.game.title.toLowerCase().includes(q);

      return matchesGame && matchesQuery;
    });
  }, [searchQuery, selectedGameId, challenges]);

  /* ======================
    SORTING
  ====================== */

  const sortedChallenges = useMemo(() => {
    return filterOrderingChallenges(filteredChallenges, orderFilterSearchbar, filterSelectorChoice);
  }, [filteredChallenges, orderFilterSearchbar, filterSelectorChoice]);

  /* ======================
    PAGINATION
  ====================== */

  const totalPages = Math.max(1, Math.ceil(sortedChallenges.length / itemsPerPage));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (effectivePage - 1) * itemsPerPage;
  const paginatedChallenges = sortedChallenges.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    if (page === 1) {
      setPageBlockStart(2);
      return;
    }
    if (page < pageBlockStart) {
      setPageBlockStart(page);
    }
    if (page > pageBlockStart + 3) {
      setPageBlockStart(page - 3);
    }
  };

  const nextBlock = () => {
    const maxStart = Math.max(2, totalPages - 3);
    setPageBlockStart((s) => Math.min(s + 4, maxStart));
    setCurrentPage((p) => (p === 1 ? Math.min(pageBlockStart + 4, totalPages) : p));
  };

  /* ======================
    RENDER
  ====================== */

  return (
    <div className="min-h-screen flex flex-col ml-10 mr-20">
      <main className="px-4 md:px-8 py-6  mx-auto w-full ">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
          setPageBlockStart={setPageBlockStart}
          filterModalArea={filterModalArea}
          setFilterModalArea={setFilterModalArea}
          setOrderFilterSearchBar={setOrderFilterSearchBar}
          setFilterSelectorChoice={setFilterSelectorChoice}
          page='challenge'
        />
        {/* Challenges Section */}
        <div className="mb-8 ">
          <div className="mx-auto">
            <div className="flex items-center justify-around gap-4 mt-10 mb-10">
              <h2 className="text-xl font-bold border-l-4 border-(--button-select) pl-3">
                Challenges
              </h2>
              {user ? (
                <Link
                  href="/challenges/create"
                  className="group relative px-6 py-3 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-base font-bold shadow-lg shadow-(--button-game-challenge-hover)/30 hover:shadow-[0_0_40px_rgba(133,84,218,1)] hover:scale-110 transition-all duration-300 overflow-hidden animate-pulse-glow"
                >
                  {/* Effet shimmer au hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

                  {/* Texte */}
                  <span className="relative z-10">Create a challenge</span>
                </Link>
              ) : (
                <LoginRegisterCard message="Create your first challenge and compete with the community" />
              )}
            </div>

            {/* Cards de challenges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 ml-8 mg:mr-20 mg:ml-20 ">
              {paginatedChallenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  gameTitle={c.game?.title ?? ''}
                  gameSlug={c.game?.slug ?? ''}
                  title={c.title}
                  description={extractShortDescription(c.description)}
                  voteCount={c.voteCount}
                  slug={c.slug ?? c.id}
                />
              ))}
            </div>

            {/* Message si aucun challenge */}
            {filteredChallenges.length === 0 && (
              <p className="mt-6 text-center ">
                {selectedGameId ? 'No challenge for this game yet' : 'No challenge found.'}
              </p>
            )}
          </div>{' '}
          {/* Fin de .mx-auto max-w-md md:max-w-4xl */}
        </div>{' '}
        {/* Fin de .mb-8 (Challenges Section) */}
        {/* Pages */}
        <div className="flex justify-center gap-2 mb-12">
          {/* Page 1 toujours visible */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentPage === 1
                ? 'bg-(--button-select) shadow-lg shadow-[#7c39ed]/50 scale-110'
                : 'bg-(--button-area) border-2 border-transparent hover:bg-(--button-select) hover:border-(--button-game-challenge-hover) hover:shadow-lg hover:shadow-[#7c39ed]/50 hover:scale-110'
            }`}
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {/* Les 4 pages du bloc */}
          {Array.from({ length: 4 }, (_, i) => pageBlockStart + i)
            .filter((p) => p <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-(--button-select) shadow-lg shadow-[#7c39ed]/50 scale-110'
                    : 'bg-(--button-area) border-2 border-transparent hover:bg-(--button-select)hover:border-(--button-game-challenge-hover) hover:shadow-lg hover:shadow-[#7c39ed]/50 hover:scale-110'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

          {/* Bouton ... : passe au bloc suivant */}
          {totalPages > pageBlockStart + 3 && (
            <button
              type="button"
              className="w-8 h-8 bg-(--button-area) hover:bg-(--button-select) rounded-full flex items-center justify-center border-2 border-transparent hover:border-(--button-game-challenge-hover) hover:shadow-lg hover:shadow-[#7c39ed]/50 hover:scale-110 transition-all duration-300"
              onClick={nextBlock}
              aria-label="Afficher les pages suivantes"
            >
              ...
            </button>
          )}
        </div>{' '}
        {/* Fin de pagination */}
      </main>
    </div>
  );
}
