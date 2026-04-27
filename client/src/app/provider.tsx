'use client';

import { AuthProvider } from './context/AuthContext';
import Header from '@/component/header/Header';
import Footer from '@/component/footer/Footer';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Header />
      {children}
      <Footer />
    </AuthProvider>
  );
}
