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
  'CA collaboration tools (coming soon)',
  'WhatsApp reminders (coming soon)',
];

export default function PlanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'free' | 'premium'>('free');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    const auth = getAuth();
    if (auth) saveAuth({ ...auth });
    // Store plan selection in localStorage
    localStorage.setItem('msme_plan', selected);
    await new Promise(r => setTimeout(r, 600));
    router.push('/onboarding');
  };

  return (
    <div className="mesh-bg grid-pattern min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-up">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans' }}>MSME Copilot</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          Choose Your <span className="gradient-text">Plan</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">Start free and upgrade anytime. No credit card required for free plan.</p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl animate-fade-up delay-100">
        {/* Free Plan */}
        <div
          onClick={() => setSelected('free')}
          className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${selected === 'free' ? 'border-indigo-500 glow-primary' : 'border-transparent hover:border-indigo-500/30'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Zap size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>Free Plan</h2>
                <p className="text-slate-400 text-xs">Perfect to get started</p>
              </div>
            </div>
            {selected === 'free' && (
              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="mb-5">
            <span className="text-3xl font-extrabold text-white">₹0</span>
            <span className="text-slate-400 text-sm ml-1">/ month</span>
          </div>
          <div className="flex flex-col gap-3">
            {FREE_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check size={14} className="text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Plan */}
        <div
          onClick={() => setSelected('premium')}
          className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 relative overflow-hidden ${selected === 'premium' ? 'border-violet-500 glow-primary' : 'border-violet-500/30 hover:border-violet-500/60'}`}
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}
        >
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold badge-amber">POPULAR</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/30 flex items-center justify-center">
              <Crown size={20} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Plus Jakarta Sans' }}>Premium Plan</h2>
              <p className="text-slate-400 text-xs">For serious business owners</p>
            </div>
            {selected === 'premium' && (
              <div className="ml-auto w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="mb-5">
            <span className="text-3xl font-extrabold text-white">₹999</span>
            <span className="text-slate-400 text-sm ml-1">/ month</span>
            <div className="text-green-400 text-xs mt-1">🎉 First month FREE during beta</div>
          </div>
          <div className="flex flex-col gap-3">
            {PREMIUM_FEATURES.slice(0, 7).map(f => (
              <div key={f} className="flex items-center gap-2">
                <Check size={14} className="text-violet-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 w-full max-w-3xl animate-fade-up delay-200">
        <button onClick={handleContinue} disabled={loading}
          className="btn-primary w-full py-4 text-base flex items-center justify-center gap-3">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
          {loading ? 'Setting up...' : (
            <>
              Continue with {selected === 'free' ? 'Free' : 'Premium'} Plan
              <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="text-center text-slate-500 text-xs mt-3">You can upgrade or downgrade anytime from your dashboard</p>
      </div>
    </div>
  );
}
