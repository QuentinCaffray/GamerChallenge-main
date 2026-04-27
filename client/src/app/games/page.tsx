'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/component/SearchBar';

// Typage pour les jeux affichés
interface Game {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string;
}

// Petit hook responsive (sans event resize manuel côté composant)
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);

    onChange(); // init
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageBlockStart, setPageBlockStart] = useState(2);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMd = useMediaQuery('(min-width: 768px)');
  const isL = useMediaQuery('(min-width: 1024px)');
  const isXL = useMediaQuery('(min-width: 1280px)');

  const itemsPerPage 
    = isXL
    ? 15
    : isL
    ? 12
    : isMd
    ? 9
    : 6;

  useEffect(() => {
    async function getAllGames() {
      const registerUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${registerUrl}/games`);
      const replyDb = await response.json();

      // Extraire le tableau games de l'objet
      setGames(replyDb.games || []);
      setLoading(false);
    }

    getAllGames();
  }, []);

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return games;
    }
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }, [searchQuery, games]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / itemsPerPage));
  const adjustedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Onn recale la page si besoin
  useEffect(() => {
    if (currentPage !== adjustedCurrentPage) {
      setCurrentPage(adjustedCurrentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, totalPages]);

  const startIndex = (adjustedCurrentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    // si on clique une page hors bloc, on recale le bloc autour
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
      // si la page actuelle était dans l'ancien bloc, on la garde,
      // sinon on met la première page du nouveau bloc
      const candidate = Math.min(pageBlockStart + 4, totalPages);
      return p === 1 ? candidate : p;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
          setPageBlockStart={setPageBlockStart}
          page='game'
        />

        {/* Games Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 border-l-4 border-(--button-select) pl-3">Games</h2>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="">Loading games...</div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex justify-center items-center py-12">
              <div className="text-(--error-text-message)">{error}</div>
            </div>
          )}

          {/* Games icons */}
          {!loading && !error && (
            <div className="
              mx-auto
              max-w-7xl
              grid
              gap-6
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            ">
              {paginatedGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="group overflow-hidden rounded-4xl bg-(--button-area) transition hover:ring-2 hover:ring-(--button-select) delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 "
                >
                  <div className="relative aspect-square w-full overflow-hidden flex-none ">
                    <Image
                      src={game.imageUrl || '/real-rat.png'}
                      alt={game.title}
                      fill
                      sizes="(max-width: 1023px) 50vw, 33vw"
                      className=" object-cover"
                    />
                  </div>
                  <div className="p-3 h-14 min-w-0 flex-none content-center">
                    <h3 className="min-w-0 overflow-hidden line-clamp-2 font-semibold leading-5 text-center ">
                      {game.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && filteredGames.length === 0 && (
          <p className="mt-6 text-center ">No game found.</p>
        )}

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
                    : 'bg-(--button-area) border-2 border-transparent hover:bg-(--button-select) hover:border-(--button-game-challenge-hover) hover:shadow-lg hover:shadow-[#7c39ed]/50 hover:scale-110'
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
        </div>
      </main>
    </div>
  );
}
