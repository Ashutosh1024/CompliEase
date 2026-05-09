'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { apiLogin } from '@/lib/apiClient';
import { Eye, EyeOff, ArrowRight, Shield, Zap, TrendingUp, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

const FEATURES = [
  { icon: Shield,      title: 'GST & Compliance',    desc: 'Automated deadline tracking for every return' },
  { icon: Zap,         title: 'AI-Powered Help',     desc: 'Groq AI answers your queries instantly 24/7' },
  { icon: TrendingUp,  title: 'Scheme Matcher',      desc: 'MUDRA, PMEGP, GeM matched to your business' },
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
    try {
      await apiLogin(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputS: React.CSSProperties = {
    width:'100%', padding:'12px 14px', fontSize:14, color:'#fff',
    background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:10, outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    transition:'border-color 0.18s, box-shadow 0.18s', backdropFilter:'blur(4px)',
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', display:'flex', background:'linear-gradient(135deg,#06080f 0%,#0d1128 50%,#0a0e1f 100%)' }}>

      {/* Three.js background */}
      <ThreeBackground />

      {/* Radial glows */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:'55vw', height:'55vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,94,244,0.12) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:'45vw', height:'45vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* LEFT: hero panel */}
      <div className="login-left" style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 64px', position:'relative', zIndex:10 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:56 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(91,94,244,0.5)' }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:19, color:'#fff', letterSpacing:'-0.02em' }}>CompliEase</span>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.08em', fontWeight:500, marginTop:1 }}>AI COMPLIANCE PLATFORM</div>
          </div>
        </div>

        {/* AI badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:99, background:'rgba(91,94,244,0.15)', border:'1px solid rgba(91,94,244,0.3)', marginBottom:24, alignSelf:'flex-start' }}>
          <Zap size={11} color="#818cf8" />
          <span style={{ fontSize:11, fontWeight:700, color:'#818cf8', letterSpacing:'0.04em' }}>INDIA'S AI COMPLIANCE PLATFORM</span>
        </div>

        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'clamp(28px,3vw,44px)', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:16, letterSpacing:'-0.03em' }}>
          Your Business's<br />
          <span style={{ background:'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            AI Compliance
          </span>
          <br />Engine
        </h1>

        <p style={{ fontSize:15, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:40, maxWidth:420 }}>
          Stop losing sleep over GST deadlines, missed registrations, and penalties. Let AI handle compliance.
        </p>

        {/* Features */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:44 }}>
          {FEATURES.map(({ icon:Icon, title, desc }) => (
            <div key={title} style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'rgba(91,94,244,0.15)', border:'1px solid rgba(91,94,244,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={16} color="#818cf8" />
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.85)' }}>{title}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:32 }}>
          {[['50K+','Businesses'],['₹2.3Cr','Avg. unlocked'],['12+','Govt Schemes']].map(([v,l]) => (
            <div key={l}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:800, background:'linear-gradient(135deg,#818cf8,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{v}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: form */}
      <div style={{ flex:'0 0 460px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 40px', borderLeft:'1px solid rgba(255,255,255,0.07)', position:'relative', zIndex:10, backdropFilter:'blur(12px)', background:'rgba(255,255,255,0.02)' }} className="login-right">
        <div style={{ width:'100%', maxWidth:370 }}>

          {/* Mobile logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32, justifyContent:'center' }} className="login-mobile-logo">
            <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ShieldCheck size={17} color="#fff" />
            </div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:17, color:'#fff' }}>CompliEase</span>
          </div>

          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Welcome back</h2>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:28 }}>Sign in to your compliance dashboard</p>

          {error && (
            <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontSize:13, marginBottom:18 }}>{error}</div>
          )}

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:6, letterSpacing:'0.02em' }}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@business.com" style={inputS} autoComplete="email"
                onFocus={e => { e.target.style.borderColor='rgba(91,94,244,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(91,94,244,0.18)'; }}
                onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.12)'; e.target.style.boxShadow='none'; }} />
            </div>

            <div>
              <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:6, letterSpacing:'0.02em' }}>PASSWORD</label>
              <div style={{ position:'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputS, paddingRight:44 }} autoComplete="current-password"
                  onFocus={e => { e.target.style.borderColor='rgba(91,94,244,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(91,94,244,0.18)'; }}
                  onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.12)'; e.target.style.boxShadow='none'; }} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign:'right' }}>
              <button type="button" style={{ fontSize:12, color:'#818cf8', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', fontSize:14, fontWeight:700, borderRadius:12, border:'none', cursor: loading ? 'not-allowed' : 'pointer', background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', color:'#fff', transition:'opacity 0.2s, transform 0.15s', opacity: loading ? 0.75 : 1, fontFamily:'inherit' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; }}>
              {loading ? <><Loader2 size={15} style={{ animation:'spin 0.7s linear infinite' }} /> Signing in…</> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>or</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
          </div>

          <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>
            No account?{' '}
            <Link href="/signup" style={{ color:'#818cf8', fontWeight:600 }}>Start free →</Link>
          </p>

          {/* Trust badges */}
          <div style={{ display:'flex', justifyContent:'center', gap:18, marginTop:28 }}>
            {['🔐 JWT Secured','☁️ MongoDB Atlas','🤖 Groq AI'].map(t => (
              <span key={t} style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .login-left  { display: none !important; }
          .login-right { flex: 1 !important; border-left: none !important; background: transparent !important; }
          .login-mobile-logo { display: flex !important; }
        }
        @media (min-width: 901px) { .login-mobile-logo { display: none !important; } }
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
}
