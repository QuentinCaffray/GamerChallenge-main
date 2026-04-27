'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginData = {
  email: string;
  password: string;
};

export default function AuthLogin() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // IMPORTANT : empêche le rechargement de la page
    setErrorMessage('');
    setIsLoading(true);

    const loginData: LoginData = {
      email: userEmail,
      password: userPassword
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      if (!response.ok) {
        // Gérer les erreurs du backend
        setErrorMessage(data.message || 'Invalid credentials');
        setIsLoading(false);

        return;
      }

      // Rediriger vers la page d'accueil (ou dashboard)
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again later.');
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      {/* Header stylé */}
      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
        {/* Glow effect */}

        {/* Contenu */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-linear-to-r ">Log In</h1>
          <p className="text-lg ">Your next challenge is waiting</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 pb-20">
        <div className="space-y-4">
          {/* Email */}
          <div className="flex flex-col p-4 bg-(--button-area) rounded-2xl border border-(--searchbar-color) focus-within:border-(--button-select) transition">
            <label htmlFor="email" className="text-sm mb-1">
              Email address
            </label>
            <input
              type="email"
              value={userEmail}
              placeholder="your@email.com"
              onChange={(e) => setUserEmail(e.target.value)}
              id="email"
              required
              className="bg-transparent  outline-none "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col p-4 bg-(--button-area) rounded-2xl border border-(--searchbar-color) focus-within:border-(--button-select) transition">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              value={userPassword}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
              className="bg-transparent  outline-none "
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-(--error-area-message) border border-(--error-border-message) rounded-lg">
            <p className="text-(--error-text-message) text-sm text-center">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-(--searchbar-color) hover:bg-(--button-select)  p-4 rounded-2xl font-semibold transition"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </main>
  );
}
