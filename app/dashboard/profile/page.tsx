'use client';
import { useEffect, useState } from 'react';
import { getProfile, getAuth, saveProfile } from '@/lib/store';
import { BusinessProfile } from '@/lib/types';
import { User, Save, Edit3, CheckCircle2, Building2, Phone, Mail, MapPin, BarChart3, FileText, Shield } from 'lucide-react';

const SECTIONS = [
  { title: 'Personal Details',  icon: User,       color: '#818cf8', fields: [{ l: 'Full Name', k: 'fullName' }, { l: 'Mobile', k: 'mobile' }, { l: 'Email', k: 'email' }] },
  { title: 'Business Details',  icon: Building2,  color: '#22d3ee', fields: [{ l: 'Business Name', k: 'businessName' }, { l: 'Industry', k: 'industryCategory' }, { l: 'Structure', k: 'businessStructure' }, { l: 'Nature', k: 'natureOfBusiness' }] },
  { title: 'Registrations',     icon: FileText,   color: '#34d399', fields: [{ l: 'GST Number', k: 'gstNumber' }, { l: 'PAN Number', k: 'panNumber' }, { l: 'Udyam Number', k: 'udyamNumber' }, { l: 'CIN Number', k: 'cinNumber' }] },
  { title: 'Location',          icon: MapPin,     color: '#fbbf24', fields: [{ l: 'State', k: 'state' }, { l: 'District', k: 'district' }, { l: 'PIN Code', k: 'pinCode' }, { l: 'Address', k: 'address' }] },
  { title: 'Operations',        icon: BarChart3,  color: '#f472b6', fields: [{ l: 'Annual Turnover', k: 'annualTurnover' }, { l: 'Employee Count', k: 'employeeCount' }, { l: 'Year Established', k: 'yearEstablished' }] },
] as const;

export default function ProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [auth,    setAuth]    = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => { setProfile(getProfile()); setAuth(getAuth()); }, []);

  const save = () => {
    if (!profile) return;
    saveProfile(profile); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border2)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  const initials = profile.fullName?.[0]?.toUpperCase() || 'B';
  const checks   = [!!profile.gstNumber, !!profile.udyamNumber, !!profile.panNumber, !!profile.hasFSSAI, !!profile.hasShopAct];
  const score    = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="page-content" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} className="animate-fade-up">
        <div>
          <h1 className="page-title"><User size={22} color="var(--accent)" /> My Profile</h1>
          <p className="page-subtitle">Manage your business information</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={save} className="btn btn-primary">
                {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="btn btn-secondary">
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Hero card */}
      <div className="card animate-fade-up delay-50" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 28, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>{profile.fullName}</h2>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{auth?.email}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-indigo" style={{ textTransform: 'capitalize' }}>{profile.plan || 'free'} Plan</span>
              {profile.businessName && <span className="badge badge-cyan">{profile.businessName}</span>}
              {profile.state && <span className="badge badge-green">{profile.state}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 36, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}%</p>
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Compliance Score</p>
            <div className="progress-bar" style={{ width: 80, marginTop: 8 }}>
              <div className="progress-fill" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Registration status strip */}
      <div className="card animate-fade-up delay-100" style={{ padding: 20, marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 16 }}>
          <Shield size={15} color="var(--accent)" /> Registration Status
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {[
            { l: 'GST',        ok: !!profile.gstNumber },
            { l: 'Udyam',      ok: !!profile.udyamNumber },
            { l: 'PAN',        ok: !!profile.panNumber },
            { l: 'FSSAI',      ok: !!profile.hasFSSAI },
            { l: 'Shop Act',   ok: !!profile.hasShopAct },
          ].map(({ l, ok }) => (
            <div key={l} style={{ borderRadius: 12, padding: '14px 8px', textAlign: 'center', background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.14)'}` }}>
              <CheckCircle2 size={18} style={{ display: 'block', margin: '0 auto 6px', color: ok ? 'var(--green)' : 'var(--text3)' }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: ok ? 'var(--green)' : 'var(--text3)' }}>{ok ? 'Done' : 'Missing'}</p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail sections */}
      {SECTIONS.map(({ title, icon: Icon, color, fields }, si) => (
        <div key={title} className="card animate-fade-up" style={{ padding: 24, marginBottom: 16, animationDelay: `${120 + si * 50}ms` }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--text1)', marginBottom: 20 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={13} color={color} />
            </span>
            {title}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
            {fields.map(({ l, k }) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text3)', marginBottom: 6 }}>{l}</label>
                {editing ? (
                  <input className="input" value={(profile[k as keyof BusinessProfile] as string) || ''} onChange={e => setProfile(p => p ? { ...p, [k]: e.target.value } : p)} placeholder={`Enter ${l.toLowerCase()}`} />
                ) : (
                  <div style={{ padding: '9px 12px', borderRadius: 10, background: 'var(--bg3)', fontSize: 14, fontWeight: 500, color: (profile[k as keyof BusinessProfile] as string) ? 'var(--text1)' : 'var(--text3)' }}>
                    {(profile[k as keyof BusinessProfile] as string) || '—'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
