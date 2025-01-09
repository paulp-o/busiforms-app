'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { handleSignOut } from '@/app/actions/auth';

interface HeaderProps {
  pageInfo?: {
    title: string;
    description: string;
  };
}

export default function Header({ pageInfo }: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/dashboard">
              <Image
                src="/images/mainlogo.svg"
                alt="BusiForm"
                width={125}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* 우측 버튼들 */}
          <div className="flex items-center space-x-4">
            {pageInfo && (
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <Image
                  src="/images/infobutton.png"
                  alt="Info"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            )}
            
            <button
              onClick={() => handleSignOut()}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <Image
                src="/images/logoutbutton.png"
                alt="Logout"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Info 모달 */}
      {showInfo && pageInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{pageInfo.title}</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600">{pageInfo.description}</p>
          </div>
        </div>
      )}
    </header>
  );
} 