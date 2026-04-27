'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ChallengeCard from '@/component/ChallengeCard';
import SearchBar from '@/component/SearchBar';
import { useAuth } from '@/app/context/AuthContext';
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

type Game = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  slug: string;
};

type Challenge = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  gameId: string;
  voteCount: number;
  hasLiked?: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  scoreFormat: string;
  game?: {
    id: string;
    slug: string;
    title: string;
    imageUrl: string;
    description?: string;
  };
};

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

export default function GamePage() {
  const { user } = useAuth();
  const params = useParams() as { slug?: string } | undefined;
  const slug = params?.slug;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);

  const [filterModalArea, setFilterModalArea] = useState<boolean>(false);
  const [orderFilterSearchbar, setOrderFilterSearchBar] = useState<'ASC' | 'DESC'>('ASC');
  const [filterSelectorChoice, setFilterSelectorChoice] = useState<
    'Popularity' | 'Date added' | 'Alphabetical'
  >('Date added');

  const [games, setGames] = useState<Game[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const isMd = useMediaQuery('(min-width: 768px)');
  const isL = useMediaQuery('(min-width: 1464px)');
  const isXL = useMediaQuery('(min-width: 1888px)');
  const isXXL = useMediaQuery('(min-width: 2312px)');

  const itemsPerPage = isXXL ? 15 : isXL ? 12 : isL ? 9 : isMd ? 6 : 4;

  // Fetch games (for selected game card)
  useEffect(() => {
    async function fetchGames() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/games`);
      const data = await res.json();
      setGames(data.games || []);
    }
    fetchGames();
  }, []);

  // Fetch challenges
  useEffect(() => {
    async function fetchChallenges() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/challenges`);
      const data = await res.json();

      const list = (data.challenges || data || []).map((c: Partial<Challenge>) => ({
        ...c,
        voteCount: (c as any).voteCount ?? 0
      })) as Challenge[];

      setChallenges(list);
    }
    fetchChallenges();
  }, []);

  // Selected game by slug (id)
  const selectedGame = useMemo(() => {
    if (!slug) {
      return null;
    }
    return games.find((g) => g.slug === slug) ?? null;
  }, [slug, games]);

  // Reset when slug changes
  useEffect(() => {
    setSearchQuery('');
    setCurrentPage(1);
    setPageBlockStart(2);
  }, [slug]);

  // Filter challenges for selected game + search
  const filteredChallenges = useMemo(() => {
    // If no slug, return empty
    if (!slug) {
      return [];
    }

    // find the game using the slug
    const currentGame = games.find((g) => g.slug === slug);

    // Si le jeu n'existe pas, retourne tableau vide
    if (!currentGame) {
      return [];
    }

    const searchTerm = searchQuery.trim().toLowerCase();
    // Keep only the games challenge
    return challenges.filter((challenge) => {
      if (challenge.gameId !== currentGame.id) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const challengeTitle = challenge.title.toLowerCase();
      const gameTitle = (challenge.game?.title ?? currentGame.title).toLowerCase();

      return challengeTitle.includes(searchTerm) || gameTitle.includes(searchTerm);
    });
  }, [searchQuery, challenges, slug, games]);

  function extractShortDescription(raw: string) {
    const text = (raw ?? '').replace(/\r\n/g, '\n').trim();
    const idx = text.search(/\n\s*details\s*:?\s*\n/i);

    if (idx === -1) {
      return text;
    }
    return text.slice(0, idx).trim();
  }

  const sortedChallenges = useMemo(() => {
    return filterOrderingChallenges(filteredChallenges, orderFilterSearchbar, filterSelectorChoice);
  }, [filteredChallenges, orderFilterSearchbar, filterSelectorChoice]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedChallenges.length / itemsPerPage));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage !== effectivePage) {
      setCurrentPage(effectivePage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, totalPages]);

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
    setCurrentPage((p) => {
      const candidate = Math.min(pageBlockStart + 4, totalPages);
      return p === 1 ? candidate : p;
    });
  };

  return (
    <div className="min-h-screen  flex flex-col">
      <main className="px-4 md:px-8 py-6   ">
        {/* Selected Game card */}
        {selectedGame ? (
          <div className="mb-4 md:max-w-2xl mx-auto">
            <div className="relative w-full h-44 md:h-56 overflow-hidden rounded-2xl bg-(--background-header) ring-1 ring-background shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <Image
                src={selectedGame.imageUrl}
                alt={selectedGame.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain p-4"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-foreground/60 to-transparent">
                <div className="text-lg font-semibold text-center text-(--button-select)">
                  {selectedGame.title}
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
        <div className="mb-8">
          <div className="mx-auto ">
            <div className="mb-6 flex items-center justify-around gap-4">
              <h2 className="text-xl font-bold border-l-4 border-(--button-select) pl-3 ml-15 md:ml-40 mt-10 mb-10">
                Challenges
              </h2>
              {!user ? (
                <LoginRegisterCard message="Sign up to participate in this game's challenges" />
              ) : (
                <Link
                  href="/challenges/create"
                  className="group relative px-6 py-3 rounded-xl bg-(--button-game-challenge) hover:bg-(--button-game-challenge-hover) text-base font-bold shadow-lg shadow-(--button-game-challenge-hover)/30 hover:shadow-[0_0_40px_rgba(133,84,218,1)] hover:scale-110 transition-all duration-300 overflow-hidden animate-pulse-glow"
                >
                  {/* Effet shimmer au hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-transparent via-foreground/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

                  {/* Texte */}
                  <span className="relative z-10">Create a challenge</span>
                </Link>
              )}
            </div>

            {/* Cards */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6  mr-20 ml-20">
              {paginatedChallenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  gameTitle={c.game?.title ?? selectedGame?.title ?? ''}
                  gameSlug={c.game?.slug ?? selectedGame?.slug ?? ''}
                  title={c.title}
                  description={extractShortDescription(c.description)}
                  voteCount={c.voteCount}
                  slug={c.slug ?? c.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filteredChallenges.length === 0 && (
          <p className="mt-6 text-center">No challenge for this game yet</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mb-12">
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === 1
                ? 'bg-(--button-select)'
                : 'bg-(--button-area) hover:bg-(--searchbar-color)'
            }`}
            onClick={() => goToPage(1)}
          >
            1
          </button>

          {Array.from({ length: 4 }, (_, i) => pageBlockStart + i)
            .filter((p) => p <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-(--button-select)'
                    : 'bg-(--button-area) hover:bg-(--searchbar-color)'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

          {totalPages > pageBlockStart + 3 && (
            <button
              type="button"
              className="w-8 h-8 bg-(--button-area) bg-(--searchbar-color)rounded-full flex items-center justify-center"
              onClick={nextBlock}
              aria-label="Afficher les pages suivantes"
            >
              ...
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
