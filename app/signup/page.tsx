'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveAuth } from '@/lib/store';
import { Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 1000));
    saveAuth({ name: form.name, email: form.email });
    router.push('/plan');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    saveAuth({ name: 'Business Owner', email: 'owner@mybusiness.com' });
    router.push('/plan');
  };

  const perks = ['Free compliance tracking', 'AI chatbot (10 queries/day)', 'GST deadline reminders', 'Government scheme alerts'];

  return (
    <div className="mesh-bg grid-pattern min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left */}
        <div className="hidden lg:block animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse-glow">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>MSME Copilot</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Start Your Free<br /><span className="gradient-text">Business Journey</span>
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">Join 50,000+ Indian businesses managing compliance stress-free with AI.</p>
          <div className="flex flex-col gap-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 glass rounded-xl border border-indigo-500/10">
            <p className="text-slate-300 text-sm italic mb-3">"MSME Copilot saved us from a ₹50,000 GST penalty. The AI reminded us 2 weeks before the deadline!"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm">R</div>
              <div>
                <p className="text-white text-xs font-medium">Ramesh Kumar</p>
                <p className="text-slate-500 text-xs">Restaurant Owner, Pune</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="animate-fade-up delay-100">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>MSME Copilot</span>
          </div>

          <div className="glass rounded-2xl p-8 border border-indigo-500/10">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Create Account</h2>
            <p className="text-slate-400 text-sm mb-6">Free forever — no credit card required</p>

            {error && <div className="alert-urgent rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Ramesh Kumar" className="input-glass w-full px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="you@business.com" className="input-glass w-full px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                    placeholder="Min. 6 characters" className="input-glass w-full px-4 py-3 pr-12 text-sm" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium block mb-2">Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)}
                  placeholder="Repeat password" className="input-glass w-full px-4 py-3 text-sm" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {loading ? 'Creating account...' : 'Create Free Account →'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button onClick={handleGoogle} disabled={loading} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.116 17.64 11.836 17.64 9.2z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-slate-500 text-xs mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
