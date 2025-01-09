'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="BusiForm"
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 