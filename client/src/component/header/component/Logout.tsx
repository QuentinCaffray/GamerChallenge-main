'use client';

import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  onLogout?: () => void;
}
export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const router = useRouter();

  const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/';
    onLogout?.();
  };
  return (
    <button
      onClick={logout}
      className="m-1.5 pl-1.5 pr-1.5 rounded-full hover:bg-(--button-game-challenge-hover)"
    >
      Disconnect
    </button>
  );
}
