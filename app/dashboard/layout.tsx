'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getStoredUser } from '@/lib/apiClient';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [ready,        setReady]        = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.replace('/login'); return; }

    // Try to get profile for sidebar name
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.profile) {
          setBusinessName(d.profile.businessName || '');
          setReady(true);
        } else {
          // No profile yet — redirect to onboarding
          router.replace('/onboarding');
        }
      })
      .catch(() => { router.replace('/login'); });
  }, [router]);

  if (!ready) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid var(--border2)', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'var(--text3)', fontSize:13 }}>Loading…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  return (
    <div className="page-root">
      <Sidebar businessName={businessName} />
      <main className="page-main">
        {children}
      </main>
    </div>
  );
}
