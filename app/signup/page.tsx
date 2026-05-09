'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { apiSignup } from '@/lib/apiClient';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Zap, Building2 } from 'lucide-react';

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

const PERKS = [
  { icon: ShieldCheck, text: 'GST & compliance tracking' },
  { icon: Zap,         text: 'AI assistant powered by Groq' },
  { icon: Building2,   text: 'Government scheme matcher' },
  { icon: CheckCircle2,text: 'Smart deadline alerts' },
];

export default function SignupPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await apiSignup(form.name, form.email, form.password);
      router.push('/plan');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const inputS: React.CSSProperties = {
    width:'100%', padding:'11px 14px', fontSize:14, color:'var(--text1)',
    background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:10, outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    transition:'border-color 0.18s, box-shadow 0.18s', backdropFilter:'blur(4px)',
  };

  return (
    <div style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'linear-gradient(135deg,#06080f 0%,#0d1128 50%,#0a0e1f 100%)' }}>

      {/* Three.js background */}
      <ThreeBackground />

      {/* Radial glows */}
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:'60vw', height:'60vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,94,244,0.12) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      {/* Content */}
      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:900, display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }} className="signup-grid">

        {/* Left */}
        <div className="signup-left">
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36 }}>
            <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(91,94,244,0.5)' }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:19, color:'#fff', letterSpacing:'-0.02em' }}>CompliEase</span>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', letterSpacing:'0.08em', fontWeight:500, marginTop:1 }}>AI COMPLIANCE PLATFORM</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:38, fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:14, letterSpacing:'-0.035em' }}>
            Start Your Free<br />
            <span style={{ background:'linear-gradient(135deg,#818cf8,#a78bfa,#38bdf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Compliance Journey
            </span>
          </h1>

          <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.7, marginBottom:32, maxWidth:360 }}>
            Join 50,000+ Indian businesses simplifying compliance with AI. No CA needed.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'rgba(91,94,244,0.2)', border:'1px solid rgba(91,94,244,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={14} color="#818cf8" />
                </div>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:36, padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            {['🔐 JWT Secured','☁️ MongoDB Atlas','🤖 Groq AI'].map(b => (
              <span key={b} style={{ fontSize:12, color:'rgba(255,255,255,0.45)', fontWeight:500 }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:22, padding:'36px 32px', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>

          {/* Mobile logo */}
          <div className="signup-mobile-logo" style={{ display:'none', alignItems:'center', gap:10, marginBottom:24 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ShieldCheck size={16} color="#fff" />
            </div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:16, color:'#fff' }}>CompliEase</span>
          </div>

          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>Create Account</h2>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:24 }}>Free forever — no credit card required</p>

          {error && (
            <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171', fontSize:13, marginBottom:18 }}>{error}</div>
          )}

          <form onSubmit={handleSignup} style={{ display:'flex', flexDirection:'column', gap:15 }}>
            {[
              { k:'name',    label:'Full Name',        type:'text',     ph:'Ramesh Kumar' },
              { k:'email',   label:'Email Address',    type:'email',    ph:'you@business.com' },
              { k:'password',label:'Password',         type:'password', ph:'Min. 6 characters', pw:true },
              { k:'confirm', label:'Confirm Password', type:'password', ph:'Repeat password' },
            ].map(({ k, label, type, ph, pw }) => (
              <div key={k}>
                <label style={{ display:'block', fontSize:12.5, fontWeight:600, color:'rgba(255,255,255,0.65)', marginBottom:6, letterSpacing:'0.02em' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={pw ? (showPw ? 'text' : 'password') : type}
                    value={form[k as keyof typeof form]}
                    onChange={e => upd(k, e.target.value)}
                    placeholder={ph}
                    style={{ ...inputS, paddingRight: pw ? 44 : 14 }}
                    onFocus={e => { e.target.style.borderColor='rgba(91,94,244,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(91,94,244,0.18)'; }}
                    onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.12)'; e.target.style.boxShadow='none'; }}
                  />
                  {pw && (
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.35)', display:'flex', alignItems:'center' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px', fontSize:14, fontWeight:700, borderRadius:12, border:'none', cursor: loading ? 'not-allowed' : 'pointer', background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', color:'#fff', marginTop:4, transition:'opacity 0.2s, transform 0.15s', opacity: loading ? 0.75 : 1, fontFamily:'inherit' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform=''; }}>
              {loading ? <><Loader2 size={15} style={{ animation:'spin 0.7s linear infinite' }} /> Creating account…</> : <>Create Free Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:20 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color:'#818cf8', fontWeight:600 }}>Sign in →</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) {
          .signup-grid { grid-template-columns: 1fr !important; max-width: 440px !important; }
          .signup-left { display: none !important; }
          .signup-mobile-logo { display: flex !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
