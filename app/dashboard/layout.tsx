'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, getProfile } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import { BusinessProfile } from '@/lib/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getAuth()) { router.replace('/login'); return; }
    const p = getProfile();
    if (!p) { router.replace('/onboarding'); return; }
    setProfile(p);
    setReady(true);
  }, [router]);

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid var(--border2)', borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  return (
    <div className="page-root">
      <Sidebar businessName={profile?.businessName} />
      <main className="page-main">
        {children}
      </main>
    </div>
  );
}
