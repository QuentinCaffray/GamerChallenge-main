'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-(--background-header) py-8 px-6">
      <div className="m-0 w-full">
        {/* Logo et titre */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div>
            <Image
              className="h-16 w-16"
              src="/icone-manette.png"
              width={80}
              height={80}
              alt="gamerchallenge logo"
            />
          </div>
          <h2 className="text-xl font-bold">ChallengeArena</h2>
        </Link>

        {/* Liens du footer */}
        <div className="grid grid-cols-2 md:flex md:justify-end md:gap-8 gap-4 mb-8">
          <Link href="/about" className="hover:text-(--button-select) transition-colors">
            About Us
          </Link>
          <Link href="/terms-of-service" className="hover:text-(--button-select) transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy-policy" className="hover:text-(--button-select) transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal-notice" className="hover:text-(--button-select) transition-colors">
            Legal Notice
          </Link>
          <Link href="/support" className="hover:text-(--button-select) transition-colors">
            Support
          </Link>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-slate-700 pt-6"></div>
      </div>
    </footer>
  );
}
