'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/store';
import { Brain, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { label: 'Business Profile Received',             delay: 0    },
  { label: 'Analyzing Compliance Requirements',      delay: 1100 },
  { label: 'Checking State-Specific Rules',          delay: 2100 },
  { label: 'Finding Government Scheme Eligibility',  delay: 3100 },
  { label: 'Generating Your Compliance Score',       delay: 3900 },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [done,    setDone]    = useState<number[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.replace('/onboarding'); return; }
    setProfile(p);
    STEPS.forEach((s, i) => setTimeout(() => setDone(d => [...d, i]), s.delay + 600));
    setTimeout(() => router.push('/dashboard'), 5400);
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      background: 'radial-gradient(ellipse 60% 40% at 20% 20%, rgba(91,94,244,0.1) 0%, transparent 55%), var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>

        {/* Animated icon */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(91,94,244,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'float 3s ease-in-out infinite', boxShadow: '0 8px 28px rgba(91,94,244,0.5)' }}>
              <Brain size={30} color="#fff" />
            </div>
          </div>
          {/* Orbiting ring */}
          <div style={{ position: 'absolute', width: 112, height: 112, borderRadius: '50%', border: '1.5px dashed rgba(91,94,244,0.3)', animation: 'spinRing 6s linear infinite' }} />
        </div>

        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--text1)', marginBottom: 8, letterSpacing: '-0.025em' }}>
          AI Analyzing Your Business
        </h1>
        {profile && (
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 32 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{profile.businessName}</span> · {profile.state}
          </p>
        )}

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', marginBottom: 28 }}>
          {STEPS.map((s, i) => {
            const isDone   = done.includes(i);
            const isActive = !isDone && (i === 0 || done.includes(i - 1));
            const color    = isDone ? 'var(--green)' : isActive ? 'var(--accent)' : 'var(--border)';
            const bgColor  = isDone ? 'rgba(16,185,129,0.06)' : isActive ? 'rgba(91,94,244,0.07)' : 'transparent';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, border: `1px solid ${color}50`, background: bgColor, transition: 'all 0.5s ease', opacity: !isDone && !isActive ? 0.4 : 1 }}>
                <div style={{ flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle2 size={20} color="var(--green)" />
                  ) : isActive ? (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid rgba(91,94,244,0.3)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border)' }} />
                  )}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: isDone ? 'var(--green)' : isActive ? 'var(--text1)' : 'var(--text3)' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 12, color: 'var(--text3)', animation: 'fadeIn 1s ease infinite alternate' }}>
          Redirecting to your dashboard…
        </p>
      </div>

      <style>{`
        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes spinRing  { to { transform: rotate(360deg); } }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 16px rgba(91,94,244,0.3)} 50%{box-shadow:0 0 36px rgba(91,94,244,0.55)} }
        @keyframes fadeIn    { from{opacity:0.4} to{opacity:0.9} }
      `}</style>
    </div>
  );
}
