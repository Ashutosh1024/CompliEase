'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/store';
import { GOVERNMENT_SCHEMES } from '@/lib/compliance-data';
import { GovernmentScheme } from '@/lib/types';
import { Landmark, ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';

const CAT_BADGE: Record<string, string> = { Loan: 'badge-indigo', Subsidy: 'badge-green', Registration: 'badge-cyan', Grant: 'badge-amber' };
const CATS = ['all', 'Loan', 'Subsidy', 'Registration', 'Grant'];

function SchemeCard({ s }: { s: GovernmentScheme }) {
  const [open, setOpen] = useState(false);
  const eligColor = s.eligibilityScore >= 80 ? 'var(--green)' : s.eligibilityScore >= 60 ? 'var(--amber)' : 'var(--accent)';
  const progBg    = s.eligibilityScore >= 80 ? 'linear-gradient(90deg,var(--green),var(--cyan))' : s.eligibilityScore >= 60 ? 'linear-gradient(90deg,var(--amber),#f97316)' : 'linear-gradient(90deg,var(--accent),var(--accent2))';
  return (
    <div className="scheme-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            <span className={`badge ${CAT_BADGE[s.category]}`}>{s.category}</span>
            <span className="badge badge-green">{s.eligibilityScore}% Eligible</span>
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15, fontWeight: 700, color: 'var(--text1)', marginBottom: 3 }}>{s.name}</h3>
          <p style={{ fontSize: 12, color: 'var(--text3)' }}>{s.ministry}</p>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(91,94,244,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Landmark size={20} color="var(--accent)" />
        </div>
      </div>

      {/* Eligibility bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: 'var(--text2)' }}>Your Eligibility</span>
          <span style={{ fontWeight: 700, color: eligColor }}>{s.eligibilityScore}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${s.eligibilityScore}%`, background: progBg }} />
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }} className="truncate-2">{s.description}</p>

      {/* Benefits */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {s.benefits.slice(0, 2).map(b => (
          <span key={b} style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text1)' }}>✓ {b}</span>
        ))}
      </div>

      {/* Expand */}
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 500, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {open ? <><ChevronUp size={13} /> Hide details</> : <><ChevronDown size={13} /> View documents</>}
      </button>

      {open && (
        <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }} className="anim-scale-in">
          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <FileText size={12} /> Required Documents
          </p>
          {s.requiredDocuments.map(d => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text2)', marginBottom: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} /> {d}
            </div>
          ))}
        </div>
      )}

      <a href={s.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
        Apply Now <ExternalLink size={13} />
      </a>
    </div>
  );
}

export default function GovernmentSchemesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [filter,  setFilter]  = useState('all');
  useEffect(() => { setProfile(getProfile()); }, []);

  const filtered = GOVERNMENT_SCHEMES.filter(s => filter === 'all' || s.category === filter);

  return (
    <div className="page-content">
      <div style={{ marginBottom: 24 }} className="animate-fade-up">
        <h1 className="page-title"><Landmark size={22} color="var(--green)" /> Government Schemes</h1>
        <p className="page-subtitle">Personalized scheme recommendations for your business</p>
      </div>

      {profile && (
        <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 14, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }} className="animate-fade-up delay-100">
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)', marginBottom: 3 }}>🎯 {GOVERNMENT_SCHEMES.length} schemes found for {profile.businessName}</p>
          <p style={{ fontSize: 12, color: 'var(--text2)' }}>{profile.industryCategory} · {profile.state} · {profile.annualTurnover || 'Turnover not set'}</p>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }} className="animate-fade-up delay-150">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '7px 18px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter===c ? 'var(--accent)' : 'var(--border)'}`, background: filter===c ? 'var(--accent)' : 'transparent', color: filter===c ? '#fff' : 'var(--text2)', transition: 'all 0.15s', outline: 'none' }}>
            {c === 'all' ? `All (${GOVERNMENT_SCHEMES.length})` : c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="schemes-grid animate-fade-up delay-200">
        {filtered.map(s => <SchemeCard key={s.id} s={s} />)}
      </div>

      {/* Tip */}
      <div style={{ marginTop: 28, padding: '20px 24px', borderRadius: 16, background: 'rgba(91,94,244,0.07)', border: '1px solid rgba(91,94,244,0.18)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <span style={{ fontSize: 24 }}>💡</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 5 }}>Udyam Registration unlocks more schemes</p>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>Registering on the Udyam portal (free, ~10 min) increases your eligibility for most government schemes and gives priority in bank lending.</p>
        </div>
      </div>

      <style>{`@media (max-width: 1100px) { .schemes-grid { grid-template-columns: repeat(2,1fr) !important; } } @media (max-width: 700px) { .schemes-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
