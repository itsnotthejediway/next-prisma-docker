'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>👋 Hey, {session.user?.name}</p>
        <button onClick={() => signOut()} className="border px-4 py-1 rounded cursor-pointer">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn('github')} className="border px-4 py-1 rounded cursor-pointer">
      Sign in with GitHub
    </button>
  );
}
