'use client';
import Image from 'next/image';
import Link from 'next/link';
import BurgerMenu from './component/BurgerMenu';
import Menu from './component/Menu';
import { useAuth } from '@/app/context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="bg-(--background-header) h-24 relative">
      <div className="h-full flex items-center justify-between px-4">
        {/* Logo à gauche */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            className="h-16 w-16 sm:h-20 sm:w-20"
            src="/icone-manette.png"
            width={100}
            height={100}
            alt="challengeArena logo"
          />
          <h1 className="ml-2 text-sm md:text-xl xl:text-2xl 2xl:text-3xl font-extrabold whitespace-nowrap">
            ChallengeArena
          </h1>
        </Link>

        {/* Menu centré (position absolue par rapport au header) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Menu />
        </div>

        {/* User info + Burger à droite */}
        <div className="flex items-center gap-2">
          {user && (
            <p
              className="
                hidden sm:block
                text-sm md:text-base
                font-semibold
                tracking-wide
                bg-gradient-to-r from-violet-400 to-fuchsia-500
                bg-clip-text text-transparent
                select-none
              "
            >
              {user.username}
            </p>
          )}
          <BurgerMenu />
        </div>
      </div>
    </div>
  );
}
