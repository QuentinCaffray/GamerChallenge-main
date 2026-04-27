import Link from 'next/link';

type ChallengeCardProps = {
  gameTitle: string;
  gameSlug: string;
  title: string;
  description: string;
  voteCount: number;
  slug: string;
};

export default function ChallengeCard({
  gameTitle,
  gameSlug,
  title,
  description,
  voteCount,
  slug
}: ChallengeCardProps) {
  const formatVotes = (n: number) => `${n}`;

  return (
    <div className="rounded-2xl  shrink-0 snap-center bg-(--button-area) ring-1 ring-background/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)] w-80 lg:w-100 h-50 hover:outline-double outline-(--button-select) delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
      <div className="p-5 flex flex-col h-full">
        {/* Tag / jeu avec lien */}
        <Link
          href={`/games/${gameSlug}`}
          className="text-xs font-semibold tracking-widest text-(--button-select) mb-2 hover:underline"
        >
          {gameTitle.toUpperCase()}
        </Link>

        {/* Titre du challenge */}
        <div className="text-2xl font-semibold leading-tight mb-2">{title}</div>

        {/* Description */}
        <div className="text-foreground/70 leading-relaxed mb-4">{description}</div>

        {/* Footer : votes + bouton Details */}
        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Zone votes */}
          <div className="items-center gap-2 text-foreground/70">
            <span className="text-sm font-semibold">{formatVotes(voteCount)}</span>
            <span className="text-sm"> likes</span>
          </div>

          {/* Bouton Details */}
          <Link
            href={`/challenges/${slug}`}
            className="px-4 py-2 rounded-xl bg-(--button-game-challenge) text-sm font-semibold shadow-[0_10px_20px_rgba(0,0,0,0.35)] hover:bg-(--button-game-challenge-hover)"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
