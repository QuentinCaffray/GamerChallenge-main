type PageBannerProps = {
  title: string;
};

export default function PageBanner({ title }: PageBannerProps) {
  const patternSVG = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c39ed' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`;

  return (
    <section className="relative flex items-center justify-center py-12 md:py-16 overflow-hidden">
      {/* Pattern léger */}
      <div
        className="absolute inset-0 opacity-30"

        style={{ backgroundImage: `url("${patternSVG}")` }}
      />

      {/* Image du rat en position absolue à gauche */}
      {/* <div className="absolute left-4 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-0">
        <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80">
          <Image 
            src="/real-rat.png"
            alt="ChallengeArena mascot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div> */}

      {/* Titre centré */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
          <span className="bg-linear-to-r from-[#7c39ed] via-[#d4af37] to-[#7c39ed] bg-size-[200%_auto] bg-clip-text text-transparent animate-rainbow">
            {title}
          </span>
        </h1>
      </div>

      {/* Image du rat en position absolue à droite (optionnel, pour symétrie) */}
      {/* <div className="absolute right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-0 hidden md:block">
        <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-80 scale-x-[-1]">
          <Image 
            src="/real-rat.png"
            alt="ChallengeArena mascot"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div> */}
    </section>
  );
}
