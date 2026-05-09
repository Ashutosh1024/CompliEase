'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, saveAuth } from '@/lib/store';
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';

const FREE_FEATURES = [
  'Compliance tracking (5 items)',
  'AI Assistant (10 queries/day)',
  'Basic deadline reminders',
  'Government scheme overview',
  'Document vault (5 files)',
];

const PREMIUM_FEATURES = [
  'Unlimited compliance tracking',
  'Unlimited AI Assistant queries',
  'Smart proactive alerts',
  'All government scheme recommendations',
  'Priority deadline notifications',
  'Document vault (unlimited)',
  'State-wise personalized rules',
];

export default function PlanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'free'|'premium'>('free');
  const [loading,  setLoading]  = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    const auth = getAuth();
    if (auth) saveAuth({ ...auth });
    localStorage.setItem('msme_plan', selected);
    await new Promise(r => setTimeout(r, 600));
    router.push('/onboarding');
  };

  const isFreeSel     = selected === 'free';
  const isPremiumSel  = selected === 'premium';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '48px 20px',
      background: 'radial-gradient(ellipse 60% 40% at 20% 20%, rgba(91,94,244,0.1) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(124,58,237,0.07) 0%, transparent 55%), var(--bg)',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-fade-up">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(91,94,244,0.4)' }}>
            <Building2 size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--text1)' }}>CompliEase</span>
        </div>

        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, color: 'var(--text1)', letterSpacing: '-0.03em', marginBottom: 10 }}>
          Choose Your{' '}
          <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Plan</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 440 }}>
          Start free and upgrade anytime. No credit card required.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 780, marginBottom: 24 }} className="plan-grid animate-fade-up delay-100">

        {/* Free Plan */}
        <div onClick={() => setSelected('free')} style={{
          borderRadius: 20, padding: '28px 24px', cursor: 'pointer',
          background: 'var(--card)',
          border: `2px solid ${isFreeSel ? 'var(--accent)' : 'var(--border)'}`,
          boxShadow: isFreeSel ? '0 0 0 4px rgba(91,94,244,0.12)' : 'none',
          transition: 'all 0.2s ease', position: 'relative',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(91,94,244,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={19} color="var(--accent)" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--text1)', lineHeight: 1.2 }}>Free Plan</h2>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Perfect to get started</p>
              </div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: isFreeSel ? 'var(--accent)' : 'var(--bg3)', border: `2px solid ${isFreeSel ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              {isFreeSel && <Check size={13} color="#fff" />}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 22 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, color: 'var(--text1)' }}>₹0</span>
            <span style={{ fontSize: 14, color: 'var(--text2)', marginLeft: 5 }}>/&nbsp;month</span>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FREE_FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Check size={11} color="var(--green)" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 14, color: 'var(--text1)', fontWeight: 500, lineHeight: 1.3 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Plan */}
        <div onClick={() => setSelected('premium')} style={{
          borderRadius: 20, padding: '28px 24px', cursor: 'pointer',
          background: isPremiumSel
            ? 'linear-gradient(145deg,rgba(91,94,244,0.15),rgba(124,58,237,0.12))'
            : 'linear-gradient(145deg,rgba(91,94,244,0.07),rgba(124,58,237,0.05))',
          border: `2px solid ${isPremiumSel ? '#7c3aed' : 'rgba(124,58,237,0.35)'}`,
          boxShadow: isPremiumSel ? '0 0 0 4px rgba(124,58,237,0.12)' : 'none',
          transition: 'all 0.2s ease', position: 'relative',
        }}>
          {/* POPULAR badge */}
          <div style={{ position: 'absolute', top: 16, right: 16, padding: '4px 12px', borderRadius: 99, background: 'linear-gradient(135deg,#f59e0b,#f97316)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
            POPULAR
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(124,58,237,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={19} color="#a78bfa" />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--text1)', lineHeight: 1.2 }}>Premium Plan</h2>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>For serious business owners</p>
              </div>
            </div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: isPremiumSel ? '#7c3aed' : 'var(--bg3)', border: `2px solid ${isPremiumSel ? '#7c3aed' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
              {isPremiumSel && <Check size={13} color="#fff" />}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 22 }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, color: 'var(--text1)' }}>₹999</span>
            <span style={{ fontSize: 14, color: 'var(--text2)', marginLeft: 5 }}>/&nbsp;month</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 10, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--green)' }}>🎉 1st month FREE</span>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PREMIUM_FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(167,139,250,0.35)' }}>
                  <Check size={11} color="#a78bfa" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 14, color: 'var(--text1)', fontWeight: 500, lineHeight: 1.3 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ width: '100%', maxWidth: 780 }} className="animate-fade-up delay-200">
        <button onClick={handleContinue} disabled={loading} className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '15px 24px', fontSize: 15, borderRadius: 14 }}>
          {loading
            ? <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> Setting up…</>
            : <>Continue with {isFreeSel ? 'Free' : 'Premium'} Plan <ArrowRight size={17} /></>
          }
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 12 }}>
          You can upgrade or downgrade anytime from your dashboard
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .plan-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
