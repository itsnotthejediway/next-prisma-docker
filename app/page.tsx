'use client';

import { useSession } from 'next-auth/react';
import { LoginButton } from '@/components/LoginButton';
import Link from 'next/link';
import Info from '@/components/Info';

export default function HomePage() {
  const { status } = useSession();

  return (
    <main className="flex flex-col items-center justify-start h-screen pt-20 px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6">Welcome to NextAuth Demo</h1>

      <Info />

      <LoginButton />

      <div className="mt-8 space-y-4">
        {status !== 'authenticated' && (
          <div className="flex gap-4 justify-center">
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login with Email
            </Link>
            <Link 
              href="/register" 
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
