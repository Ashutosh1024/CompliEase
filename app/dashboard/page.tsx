'use client';
import { useEffect, useState } from 'react';
import { getProfile, getAuth } from '@/lib/store';
import { analyzeCompliance, generateAlerts, calculateComplianceScore, GOVERNMENT_SCHEMES } from '@/lib/compliance-data';
import { BusinessProfile, ComplianceItem, SmartAlert, GovernmentScheme } from '@/lib/types';
import Link from 'next/link';
import {
  AlertTriangle, CheckCircle2, Info, Bell, Bot, Upload, Calendar,
  Building, ArrowRight, TrendingUp, FileText, Landmark, Shield,
  Users, MapPin, Zap, Sparkles, ExternalLink, Clock, ChevronRight
} from 'lucide-react';

function ComplianceRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const [display, setDisplay] = useState(0);
  const [dash,    setDash]    = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => {
      setDash(circ - (score / 100) * circ);
      let c = 0;
      const iv = setInterval(() => { c += 2; if (c >= score) { setDisplay(score); clearInterval(iv); } else setDisplay(c); }, 18);
      return () => clearInterval(iv);
    }, 300);
    return () => clearTimeout(t);
  }, [score, circ]);
  const color = score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 55 ? 'Moderate' : 'Critical';
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border)" strokeWidth="9" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * 360 - 90, rad = (a * Math.PI) / 180;
          return <line key={i} x1={70 + 62 * Math.cos(rad)} y1={70 + 62 * Math.sin(rad)} x2={70 + 66 * Math.cos(rad)} y2={70 + 66 * Math.sin(rad)} stroke="var(--border)" strokeWidth="1.5" />;
        })}
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px', transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}88)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 28, color: 'var(--text1)', lineHeight: 1 }}>{display}%</span>
        <span style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color }}>{label}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [profile,     setProfile]     = useState<BusinessProfile | null>(null);
  const [auth,        setAuth]        = useState<{ name: string; email: string } | null>(null);
  const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
  const [alerts,      setAlerts]      = useState<SmartAlert[]>([]);
  const [score,       setScore]       = useState(0);
  const [schemes,     setSchemes]     = useState<GovernmentScheme[]>([]);

  useEffect(() => {
    const a = getAuth(); const p = getProfile();
    setAuth(a); setProfile(p);
    if (p) {
      const c = analyzeCompliance(p);
      setCompliances(c);
      setAlerts(generateAlerts(p, c));
      setScore(calculateComplianceScore(c));
      setSchemes(GOVERNMENT_SCHEMES.slice(0, 3));
    }
  }, []);

  const completed = compliances.filter(c => c.status === 'completed').length;
  const missing   = compliances.filter(c => c.status === 'missing').length;
  const pending   = compliances.filter(c => c.status === 'pending').length;
  const firstName = auth?.name?.split(' ')[0] || 'there';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const STATS = [
    { label: 'Compliance Score', value: `${score}%`, sub: 'Overall health',     icon: Shield,        iconCls: 'icon-indigo', color: '#818cf8' },
    { label: 'Completed',        value: completed,   sub: 'Requirements done',  icon: CheckCircle2,  iconCls: 'icon-green',  color: '#34d399' },
    { label: 'Pending',          value: pending,     sub: 'Action needed',      icon: AlertTriangle, iconCls: 'icon-amber',  color: '#fbbf24' },
    { label: 'Missing',          value: missing,     sub: 'Not registered',     icon: FileText,      iconCls: 'icon-red',    color: '#f87171' },
  ];

  const ACTIONS = [
    { label: 'AI Assistant',  icon: Bot,      href: '/dashboard/ai-assistant',       bg: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', glow: 'rgba(91,94,244,0.3)' },
    { label: 'Upload Docs',   icon: Upload,   href: '/dashboard/documents',           bg: 'linear-gradient(135deg,#06b6d4,#3b82f6)', glow: 'rgba(6,182,212,0.3)' },
    { label: 'Deadlines',     icon: Calendar, href: '/dashboard/deadlines',           bg: 'linear-gradient(135deg,#f59e0b,#f97316)', glow: 'rgba(245,158,11,0.3)' },
    { label: 'Gov. Schemes',  icon: Landmark, href: '/dashboard/government-schemes',  bg: 'linear-gradient(135deg,#10b981,#06b6d4)', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Compliance',    icon: Shield,   href: '/dashboard/compliance-tracker',  bg: 'linear-gradient(135deg,#ec4899,#8b5cf6)', glow: 'rgba(236,72,153,0.3)' },
  ];

  const DEADLINES = [
    { name: 'GSTR-3B Filing', date: 'May 20, 2025', days: 11 },
    { name: 'GSTR-1 Filing',  date: 'May 11, 2025', days: 2  },
    { name: 'Annual ITR',     date: 'Jul 31, 2025',  days: 83 },
  ];

  const PROFILE_ROWS = [
    { label: 'GST Registration', ok: !!profile?.gstNumber,   value: profile?.gstNumber   ? 'Registered' : 'Not Registered' },
    { label: 'Udyam / MSME',    ok: !!profile?.udyamNumber, value: profile?.udyamNumber ? 'Registered' : 'Not Registered' },
    { label: 'PAN Status',       ok: !!profile?.panNumber,   value: profile?.panNumber   ? 'Verified'   : 'Missing' },
    { label: 'FSSAI License',    ok: !!profile?.hasFSSAI,    value: profile?.hasFSSAI    ? 'Licensed'   : 'N/A' },
    { label: 'Shop & Est. Act',  ok: !!profile?.hasShopAct,  value: profile?.hasShopAct  ? 'Registered' : 'Check Required' },
  ];

  const alertStyle: Record<string, string> = {
    urgent: 'alert-urgent', warning: 'alert-warning', success: 'alert-success', info: 'alert-info',
  };
  const alertColor: Record<string, string> = {
    urgent: 'var(--red)', warning: 'var(--amber)', success: 'var(--green)', info: 'var(--accent)',
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }} className="animate-fade-up">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--text1)', letterSpacing: '-0.03em' }}>
            {greeting}, {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 4 }}>
            {profile?.businessName ? `${profile.businessName} · ${profile.state} · ${profile.industryCategory}` : 'Welcome to your compliance dashboard'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Link href="/dashboard/notifications" style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)' }}>
            <Bell size={17} />
            {alerts.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: 'var(--red)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)' }}>
                {alerts.length}
              </span>
            )}
          </Link>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
            {firstName[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} color="var(--amber)" /> Smart Alerts
            </span>
            <Link href="/dashboard/notifications" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.slice(0, 3).map(a => {
              const Icon = a.type === 'success' ? CheckCircle2 : a.type === 'info' ? Info : AlertTriangle;
              return (
                <div key={a.id} className={`alert ${alertStyle[a.type]}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${alertColor[a.type]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon size={15} color={alertColor[a.type]} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: alertColor[a.type] }}>{a.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{a.message}</p>
                  </div>
                  {a.actionLabel && (
                    <button style={{ fontSize: 12, fontWeight: 600, color: alertColor[a.type], background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      {a.actionLabel} <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }} className="stats-grid">
        {STATS.map(({ label, value, sub, icon: Icon, iconCls, color }) => (
          <div key={label} className="stat-card animate-fade-up delay-100">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div className={`icon-box ${iconCls}`}>
                <Icon size={17} />
              </div>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginTop: 4 }}>{label}</p>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Three columns: ring, deadlines, profile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 28 }} className="three-col">

        {/* Compliance ring */}
        <div className="card animate-fade-up delay-150" style={{ padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
            <TrendingUp size={15} color="var(--accent)" /> Compliance Health
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <ComplianceRing score={score} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { v: completed, l: 'Done',    c: 'var(--green)' },
              { v: pending,   l: 'Pending', c: 'var(--amber)' },
              { v: missing,   l: 'Missing', c: 'var(--red)' },
            ].map(({ v, l, c }) => (
              <div key={l} style={{ borderRadius: 10, padding: '10px 6px', textAlign: 'center', background: `${c}12`, border: `1px solid ${c}25` }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
          <Link href="/dashboard/compliance-tracker" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px' }}>
            View Tracker →
          </Link>
        </div>

        {/* Deadlines */}
        <div className="card animate-fade-up delay-200" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Clock size={15} color="var(--amber)" /> Deadlines
            </p>
            <Link href="/dashboard/deadlines" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DEADLINES.map(d => {
              const urgent = d.days <= 7;
              const color  = urgent ? 'var(--red)' : 'var(--amber)';
              return (
                <div key={d.name} style={{ padding: '12px 14px', borderRadius: 12, background: `${color}0a`, border: `1px solid ${color}28`, borderLeft: `3px solid ${color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{d.name}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: `${color}18`, color, flexShrink: 0, marginLeft: 8 }}>
                      {d.days}d left
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text2)' }}>{d.date}</p>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, 100 - (d.days / 90) * 100)}%`, background: urgent ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#f59e0b,#f97316)' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/dashboard/deadlines" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '9px', marginTop: 16 }}>
            All Deadlines →
          </Link>
        </div>

        {/* Profile status */}
        <div className="card animate-fade-up delay-250" style={{ padding: 24 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 20 }}>
            <Building size={15} color="var(--cyan)" /> Business Profile
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {PROFILE_ROWS.map(({ label, ok, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, color: ok ? 'var(--green)' : 'var(--amber)' }}>
                  {ok ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />} {value}
                </span>
              </div>
            ))}
          </div>
          {profile && (
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={11} /> {profile.state} · {profile.industryCategory}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                <Users size={11} /> {profile.employeeCount || 'N/A'} employees · Est. {profile.yearEstablished || 'N/A'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <section style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Zap size={14} color="var(--accent)" /> Quick Actions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }} className="actions-grid">
          {ACTIONS.map(({ label, icon: Icon, href, bg, glow }) => (
            <Link key={label} href={href} className="action-card">
              <div className="action-icon" style={{ background: bg, boxShadow: `0 4px 14px ${glow}` }}>
                <Icon size={19} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text1)' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Schemes */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Landmark size={14} color="var(--green)" /> Recommended Schemes
          </p>
          <Link href="/dashboard/government-schemes" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>See all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }} className="schemes-grid">
          {schemes.map(s => (
            <div key={s.id} className="scheme-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${s.category === 'Loan' ? 'badge-indigo' : s.category === 'Subsidy' ? 'badge-green' : 'badge-amber'}`}>{s.category}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{s.eligibilityScore}%</span>
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 4 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }} className="truncate-2">{s.description}</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${s.eligibilityScore}%`, background: 'linear-gradient(90deg,var(--green),var(--cyan))' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>{s.ministry}</p>
                <a href={s.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: 11, gap: 4 }}>
                  Apply <ExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Banner */}
      <section>
        <div style={{ borderRadius: 20, padding: '28px 32px', background: 'linear-gradient(135deg,rgba(91,94,244,0.14),rgba(124,58,237,0.08))', border: '1px solid rgba(91,94,244,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', fontSize: 64, opacity: 0.08, pointerEvents: 'none' }}>🤖</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: 'rgba(91,94,244,0.18)', border: '1px solid rgba(91,94,244,0.28)', marginBottom: 10 }}>
                <Sparkles size={10} color="#818cf8" />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8' }}>AI-Powered</span>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Have a compliance question?</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 480, lineHeight: 1.6 }}>
                Ask our AI about GST, licenses, schemes, or any compliance topic. Instant, accurate answers 24/7.
              </p>
            </div>
            <Link href="/dashboard/ai-assistant" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 14, flexShrink: 0 }}>
              <Bot size={17} /> Chat with AI
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(4,1fr) !important; } }
        @media (max-width: 1200px) { .three-col { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 768px)  { .three-col { grid-template-columns: 1fr !important; } .actions-grid { grid-template-columns: repeat(3,1fr) !important; } .schemes-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
