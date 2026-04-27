'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { LogoutButton } from './Logout';
import ThemeToggle from './light-dark-button';

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  const pathname = usePathname();
  const pathActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
  const { user } = useAuth();

  // Détecte les clics en dehors du menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav ref={menuRef} className="text-right pr-3 relative z-50">
      <button
        type="button"
        className="bg-transparent border-2 border-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] p-2 rounded-xl cursor-pointer relative z-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#7c39ed]/50"
        onClick={toggleMenu}
      >
        <svg
          className="w-10 h-10 text-white transition-colors duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <ul
        className={`
    mr-1
    mt-9
    bg-(--button-area) rounded-xl text-center p-3
    fixed right-0 top-16 w-50
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
  `}
      >
        <li
          className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
        >
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>

        <li
          className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/games') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
        >
          <Link href="/games" onClick={() => setIsOpen(false)}>
            Games
          </Link>
        </li>

        <li
          className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/challenges') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
        >
          <Link href="/challenges" onClick={() => setIsOpen(false)}>
            Challenges
          </Link>
        </li>

        <li
          className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/leaderboard') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
        >
          <Link href="/leaderboard" onClick={() => setIsOpen(false)}>
            Leaderboard
          </Link>
        </li>

        {user ? (
          <li
            className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/challenges/create') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
          >
            <Link href="/challenges/create" onClick={() => setIsOpen(false)}>
              Create challenge
            </Link>
          </li>
        ) : (
          <li
            className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/login-register/login') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
          >
            <Link href="/login-register/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </li>
        )}

        {user ? (
          <li
            className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/profile') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
          >
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
          </li>
        ) : (
          <li
            className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/login-register/register') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
          >
            <Link href="/login-register/register" onClick={() => setIsOpen(false)}>
              Register
            </Link>
          </li>
        )}

        <li
          className={`m-1.5 pl-1.5 pr-1.5 ${pathActive('/support') ? 'bg-(--button-select) bg-origin-padding p-1.5' : ''} rounded-full hover:bg-(--button-game-challenge-hover) hover:scale-105 hover:shadow-lg hover:shadow-[#7c39ed]/50 transition-all duration-300`}
        >
          <Link href="/support" onClick={() => setIsOpen(false)}>
            Support
          </Link>
        </li>

        <li>
          <ThemeToggle />
        </li>

        {user && (
          <li className="m-1.5 pl-1.5 pr-1.5">
            <LogoutButton onLogout={() => setIsOpen(false)} />
          </li>
        )}
      </ul>
    </nav>
  );
}
