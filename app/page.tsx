'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, getProfile } from '@/lib/store';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth();
    if (!auth) { router.replace('/login'); return; }
    const profile = getProfile();
    if (!profile) { router.replace('/onboarding'); return; }
    router.replace('/dashboard');
  }, [router]);
  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm">Loading MSME Copilot...</p>
      </div>
    </div>
  );
}
