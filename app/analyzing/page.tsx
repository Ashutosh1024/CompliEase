'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/store';
import { Brain, CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  { label: 'Business Profile Received', delay: 0 },
  { label: 'Analyzing Compliance Requirements', delay: 1200 },
  { label: 'Checking State-Specific Rules', delay: 2200 },
  { label: 'Finding Government Scheme Eligibility', delay: 3200 },
  { label: 'Generating Your Compliance Score', delay: 4000 },
];

export default function AnalyzingPage() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { router.replace('/onboarding'); return; }
    setProfile(p);

    STEPS.forEach((s, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, s.delay + 600);
    });

    setTimeout(() => {
      router.push('/dashboard');
    }, 5500);
  }, [router]);

  return (
    <div className="mesh-bg grid-pattern min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        {/* Animated Brain Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center animate-pulse-glow">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-float">
              <Brain size={32} className="text-white" />
            </div>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-3 h-3 rounded-full bg-indigo-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1" />
            <div className="w-2 h-2 rounded-full bg-violet-400 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
          AI Analyzing Your Business
        </h1>
        {profile && (
          <p className="text-slate-400 mb-8">
            <span className="text-indigo-400 font-medium">{profile.businessName}</span> · {profile.state}
          </p>
        )}

        {/* Steps */}
        <div className="flex flex-col gap-4 text-left">
          {STEPS.map((s, i) => {
            const done = completedSteps.includes(i);
            const active = !done && (i === 0 || completedSteps.includes(i - 1));
            return (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${done ? 'border-green-500/30 bg-green-500/5' : active ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5 opacity-40'}`}>
                <div className="flex-shrink-0">
                  {done ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : active ? (
                    <Loader2 size={20} className="text-indigo-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600" />
                  )}
                </div>
                <span className={`text-sm font-medium ${done ? 'text-green-300' : active ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-slate-500 text-xs mt-6 animate-pulse">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
