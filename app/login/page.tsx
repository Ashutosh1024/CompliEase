'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAuth } from '@/lib/store';
import { Eye, EyeOff, Building2, Shield, Zap, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  { icon: Shield,      title: 'GST & Compliance',    desc: 'Automated deadline tracking' },
  { icon: Zap,         title: 'AI-Powered Help',      desc: 'Instant answers 24/7' },
  { icon: TrendingUp,  title: 'Scheme Finder',        desc: 'Loans & subsidies matched to you' },
];

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 900));
    saveAuth({ name: email.split('@')[0].replace(/[._-]/g, ' '), email });
    router.push('/plan');
  };

  const googleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    saveAuth({ name: 'Business Owner', email: 'owner@mybusiness.com' });
    router.push('/plan');
  };

  const S = {
    root: {
      minHeight: '100vh', display: 'flex',
      background: 'radial-gradient(ellipse 70% 50% at 10% 20%, rgba(91,94,244,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(124,58,237,0.08) 0%, transparent 55%), var(--bg)',
    } as React.CSSProperties,
    left: {
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '60px 64px', position: 'relative',
    } as React.CSSProperties,
    right: {
      flex: '0 0 480px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '48px 40px',
      borderLeft: '1px solid var(--border)',
    } as React.CSSProperties,
  };

  return (
    <div style={S.root}>
      {/* LEFT: hero */}
      <div style={S.left} className="login-left">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--text1)' }}>
            MSME Copilot
          </span>
        </div>

        {/* Pill tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, background: 'rgba(91,94,244,0.12)', border: '1px solid rgba(91,94,244,0.22)', marginBottom: 24, alignSelf: 'flex-start' }}>
          <Zap size={11} color="#818cf8" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8' }}>India's #1 AI Compliance Platform</span>
        </div>

        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(28px,3vw,44px)', fontWeight: 800, color: 'var(--text1)', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.03em' }}>
          Your Business's<br />
          <span style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            AI Compliance
          </span>
          <br />Copilot
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 420 }}>
          Stop losing sleep over GST deadlines, missed registrations, and penalties. Let AI handle compliance — so you focus on growing.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(91,94,244,0.12)', border: '1px solid rgba(91,94,244,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="#818cf8" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{title}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[['50K+', 'Businesses'], ['₹2.3Cr', 'Avg. unlocked'], ['99.9%', 'Accuracy']].map(([v, l]) => (
            <div key={l}>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{l}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 'auto', paddingTop: 40 }}>
          <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 12 }}>
              "MSME Copilot saved us ₹4.2L in penalties and got our Mudra Loan approved in a week."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>RK</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text1)' }}>Rajesh Kumar</p>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>Founder, RK Textiles · Surat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: form */}
      <div style={S.right} className="login-right">
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }} className="login-mobile-logo">
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text1)' }}>MSME Copilot</span>
          </div>

          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28 }}>Sign in to your compliance dashboard</p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 6 }}>Email Address</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@business.com" className="input" autoComplete="email" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className="input" style={{ paddingRight: 44 }}
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button type="button" style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>

            <button type="submit" id="login-btn" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px 18px', fontSize: 14, justifyContent: 'center' }}>
              {loading
                ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} /> Signing in…</>
                : <>Sign In <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <div className="sep-line" style={{ margin: '20px 0' }}>or continue with</div>

          <button id="google-btn" onClick={googleLogin} disabled={loading} className="btn btn-secondary" style={{ width: '100%', padding: '11px 18px', fontSize: 14, justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.116 17.64 11.836 17.64 9.2z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 24 }}>
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Start free →</Link>
          </p>

          {/* Trust */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 24 }}>
            {['SSL Secure', 'SOC 2', 'DPDP Ready'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={11} color="var(--green)" />
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .login-left { display: none !important; }
          .login-right { flex: 1 !important; border-left: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
        @media (min-width: 901px) {
          .login-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
