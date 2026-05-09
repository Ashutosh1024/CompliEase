'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProfile } from '@/lib/store';
import { BusinessProfile } from '@/lib/types';
import { INDUSTRY_CATEGORIES, INDIAN_STATES } from '@/lib/compliance-data';
import { Building2, User, FileText, MapPin, BarChart3, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const STEPS = [
  { id:1, label:'Personal',      icon: User },
  { id:2, label:'Business',      icon: Building2 },
  { id:3, label:'Registrations', icon: FileText },
  { id:4, label:'Location',      icon: MapPin },
  { id:5, label:'Operations',    icon: BarChart3 },
];

const STRUCTURES    = ['Proprietorship','Partnership','LLP','Pvt Ltd'];
const TURNOVER      = ['Below ₹10 Lakhs','₹10L – ₹40L','₹40L – ₹1 Cr','₹1 Cr – ₹5 Cr','Above ₹5 Cr'];
const EMPLOYEES     = ['Only Me (0)','1–5','6–10','11–20','21–50','50+'];
const YEARS         = Array.from({ length:30 }, (_,i) => String(new Date().getFullYear() - i));

const EMPTY: BusinessProfile = {
  fullName:'', mobile:'', email:'',
  businessName:'', businessType:'', industryCategory:'', natureOfBusiness:'', businessStructure:'',
  gstNumber:'', panNumber:'', udyamNumber:'', cinNumber:'',
  hasTradeLicense:false, hasFSSAI:false, hasShopAct:false,
  state:'', district:'', address:'', pinCode:'',
  annualTurnover:'', employeeCount:'', yearEstablished:'',
  plan:'free',
};

export default function OnboardingPage() {
  const router  = useRouter();
  const [step,   setStep]   = useState(1);
  const [profile,setProfile]= useState<BusinessProfile>(EMPTY);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const upd = (k: keyof BusinessProfile, v: string|boolean) => {
    setProfile(p => ({ ...p, [k]: v }));
    setErrors(e => { const n = {...e}; delete n[k as string]; return n; });
  };

  const validate = () => {
    const errs: Record<string,string> = {};
    if (step===1) {
      if (!profile.fullName.trim()) errs.fullName = 'Required';
      if (!/^\d{10}$/.test(profile.mobile)) errs.mobile = 'Enter valid 10-digit number';
      if (!profile.email.includes('@')) errs.email = 'Enter valid email';
    }
    if (step===2) {
      if (!profile.businessName.trim()) errs.businessName = 'Required';
      if (!profile.industryCategory) errs.industryCategory = 'Required';
      if (!profile.businessStructure) errs.businessStructure = 'Required';
    }
    if (step===4) { if (!profile.state) errs.state = 'Required'; }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next   = () => { if (validate()) setStep(s => Math.min(s+1, 5)); };
  const back   = () => setStep(s => Math.max(s-1, 1));
  const submit = () => {
    const plan = (typeof window!=='undefined' && localStorage.getItem('msme_plan')) || 'free';
    saveProfile({ ...profile, plan: plan as 'free'|'premium' });
    router.push('/analyzing');
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width:'100%', padding:'10px 14px', fontSize:14, color:'var(--text1)',
    background:'var(--input-bg)', border:`1px solid ${errors[field] ? 'var(--red)' : 'var(--input-border)'}`,
    borderRadius:10, outline:'none', transition:'border-color 0.18s',
    boxShadow: errors[field] ? '0 0 0 3px rgba(239,68,68,0.12)' : undefined,
  });

  const selectStyle = (field: string): React.CSSProperties => ({
    ...inputStyle(field), appearance:'none', cursor:'pointer',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238494bc' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center', paddingRight:36,
  });

  const label = (txt: string, required?: boolean) => (
    <label style={{ display:'block', fontSize:13, fontWeight:500, color:'var(--text1)', marginBottom:6 }}>
      {txt} {required && <span style={{ color:'var(--red)' }}>*</span>}
    </label>
  );

  const errMsg = (field: string) => errors[field]
    ? <p style={{ fontSize:11.5, color:'var(--red)', marginTop:4 }}>{errors[field]}</p>
    : null;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'radial-gradient(ellipse 60% 40% at 20% 20%, rgba(91,94,244,0.1) 0%, transparent 55%), var(--bg)' }}>
      <div style={{ width:'100%', maxWidth:600 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#5b5ef4,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Building2 size={18} color="#fff" />
            </div>
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16, color:'var(--text1)' }}>MSME Copilot</span>
          </div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:24, fontWeight:800, color:'var(--text1)', marginBottom:8, letterSpacing:'-0.03em' }}>
            Set Up Your Business Profile
          </h1>
          <p style={{ fontSize:14, color:'var(--text2)' }}>Help us personalize your compliance dashboard</p>
        </div>

        {/* Step indicators */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:24 }}>
          {STEPS.map((s, i) => {
            const done   = step > s.id;
            const active = step === s.id;
            const Icon   = s.icon;
            return (
              <div key={s.id} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.25s', background: done ? 'var(--green)' : active ? 'linear-gradient(135deg,#5b5ef4,#7c3aed)' : 'var(--bg3)', border:`2px solid ${done ? 'var(--green)' : active ? 'transparent' : 'var(--border)'}` }}>
                    {done ? <Check size={14} color="#fff" /> : <Icon size={14} color={active ? '#fff' : 'var(--text3)'} />}
                  </div>
                  <span style={{ fontSize:11, fontWeight:500, color: active ? 'var(--accent)' : done ? 'var(--green)' : 'var(--text3)', transition:'color 0.25s' }}>{s.label}</span>
                </div>
                {i < STEPS.length-1 && (
                  <div style={{ width:32, height:2, marginBottom:16, background: done ? 'var(--green)' : 'var(--border)', borderRadius:99, transition:'background 0.25s' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom:24 }}>
          <div className="progress-fill" style={{ width:`${(step/5)*100}%` }} />
        </div>

        {/* Card */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:20, padding:32 }}>

          {/* Step 1 */}
          {step===1 && (
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>👤 Personal Details</h2>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>Tell us about yourself</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>{label('Full Name',true)}<input value={profile.fullName} onChange={e=>upd('fullName',e.target.value)} placeholder="Ramesh Kumar" style={inputStyle('fullName')} />{errMsg('fullName')}</div>
                <div>{label('Mobile Number',true)}<input value={profile.mobile} onChange={e=>upd('mobile',e.target.value)} placeholder="9876543210" maxLength={10} style={inputStyle('mobile')} />{errMsg('mobile')}</div>
                <div>{label('Email Address',true)}<input value={profile.email} onChange={e=>upd('email',e.target.value)} placeholder="you@business.com" style={inputStyle('email')} />{errMsg('email')}</div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step===2 && (
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>🏢 Business Details</h2>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>Tell us about your business</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>{label('Business Name',true)}<input value={profile.businessName} onChange={e=>upd('businessName',e.target.value)} placeholder="Ramesh Enterprises" style={inputStyle('businessName')} />{errMsg('businessName')}</div>
                <div>
                  {label('Industry Category',true)}
                  <select value={profile.industryCategory} onChange={e=>upd('industryCategory',e.target.value)} style={selectStyle('industryCategory')}>
                    <option value="">Select industry…</option>
                    {INDUSTRY_CATEGORIES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>{errMsg('industryCategory')}
                </div>
                <div>
                  {label('Business Structure',true)}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {STRUCTURES.map(s => (
                      <button key={s} type="button" onClick={() => upd('businessStructure',s)}
                        style={{ padding:'10px', borderRadius:12, fontSize:13.5, fontWeight:500, cursor:'pointer', border:`1px solid ${profile.businessStructure===s ? 'var(--accent)' : 'var(--border)'}`, background: profile.businessStructure===s ? 'rgba(91,94,244,0.12)' : 'transparent', color: profile.businessStructure===s ? 'var(--accent)' : 'var(--text2)', transition:'all 0.15s', outline:'none' }}>
                        {s}
                      </button>
                    ))}
                  </div>{errMsg('businessStructure')}
                </div>
                <div>{label('Nature of Business')}<input value={profile.natureOfBusiness} onChange={e=>upd('natureOfBusiness',e.target.value)} placeholder="Manufacturing, Retail, Service…" style={inputStyle('natureOfBusiness')} /></div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step===3 && (
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>📋 Registration Details</h2>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>Enter existing registrations (leave blank if not registered)</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:20 }}>
                <div>{label('GST Number')}<input value={profile.gstNumber} onChange={e=>upd('gstNumber',e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} style={inputStyle('gstNumber')} /></div>
                <div>{label('PAN Number')}<input value={profile.panNumber} onChange={e=>upd('panNumber',e.target.value.toUpperCase())} placeholder="AAAAA1234A" maxLength={10} style={inputStyle('panNumber')} /></div>
                <div>{label('Udyam Number')}<input value={profile.udyamNumber} onChange={e=>upd('udyamNumber',e.target.value.toUpperCase())} placeholder="UDYAM-XX-00-0000000" style={inputStyle('udyamNumber')} /></div>
                <div>{label('CIN Number')}<input value={profile.cinNumber} onChange={e=>upd('cinNumber',e.target.value.toUpperCase())} placeholder="For Pvt Ltd / LLP" style={inputStyle('cinNumber')} /></div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { k:'hasTradeLicense', l:'Trade License',          d:'Municipal/local body license' },
                  { k:'hasFSSAI',        l:'FSSAI Food License',     d:'Required for food businesses' },
                  { k:'hasShopAct',      l:'Shop & Establishment',   d:'State-mandated registration' },
                ].map(({ k, l, d }) => (
                  <label key={k} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', borderRadius:12, border:'1px solid var(--border)', cursor:'pointer', transition:'border-color 0.15s' }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLLabelElement).style.borderColor='var(--border2)';}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLLabelElement).style.borderColor='var(--border)';}}>
                    <div onClick={() => upd(k as keyof BusinessProfile, !profile[k as keyof BusinessProfile])}
                      style={{ width:20, height:20, borderRadius:6, border:`2px solid ${profile[k as keyof BusinessProfile] ? 'var(--accent)' : 'var(--border)'}`, background: profile[k as keyof BusinessProfile] ? 'var(--accent)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s', cursor:'pointer' }}>
                      {profile[k as keyof BusinessProfile] && <Check size={11} color="#fff" />}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:500, color:'var(--text1)' }}>{l}</p>
                      <p style={{ fontSize:12, color:'var(--text2)' }}>{d}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step===4 && (
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>📍 Location Details</h2>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>Location helps apply correct state-specific rules</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
                  <div>
                    {label('State',true)}
                    <select value={profile.state} onChange={e=>upd('state',e.target.value)} style={selectStyle('state')}>
                      <option value="">Select state…</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>{errMsg('state')}
                  </div>
                  <div>{label('District')}<input value={profile.district} onChange={e=>upd('district',e.target.value)} placeholder="e.g. Pune, Lucknow" style={inputStyle('district')} /></div>
                </div>
                <div>{label('Full Address')}<input value={profile.address} onChange={e=>upd('address',e.target.value)} placeholder="Shop/Office address" style={inputStyle('address')} /></div>
                <div>{label('PIN Code')}<input value={profile.pinCode} onChange={e=>upd('pinCode',e.target.value)} placeholder="400001" maxLength={6} style={inputStyle('pinCode')} /></div>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {step===5 && (
            <div>
              <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:18, fontWeight:700, color:'var(--text1)', marginBottom:4 }}>📊 Operational Details</h2>
              <p style={{ fontSize:13, color:'var(--text2)', marginBottom:24 }}>Helps calibrate compliance requirements accurately</p>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  {label('Annual Turnover')}
                  <select value={profile.annualTurnover} onChange={e=>upd('annualTurnover',e.target.value)} style={selectStyle('annualTurnover')}>
                    <option value="">Select turnover range…</option>
                    {TURNOVER.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  {label('Employee Count')}
                  <select value={profile.employeeCount} onChange={e=>upd('employeeCount',e.target.value)} style={selectStyle('employeeCount')}>
                    <option value="">Select employee count…</option>
                    {EMPLOYEES.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  {label('Year Established')}
                  <select value={profile.yearEstablished} onChange={e=>upd('yearEstablished',e.target.value)} style={selectStyle('yearEstablished')}>
                    <option value="">Select year…</option>
                    {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {/* Summary */}
                <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(91,94,244,0.07)', border:'1px solid rgba(91,94,244,0.18)', marginTop:4 }}>
                  <p style={{ fontSize:12, fontWeight:600, color:'var(--accent)', marginBottom:10 }}>📝 Profile Summary</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
                    {[
                      { l:'Business',  v:profile.businessName||'—' },
                      { l:'Industry',  v:profile.industryCategory||'—' },
                      { l:'Structure', v:profile.businessStructure||'—' },
                      { l:'State',     v:profile.state||'—' },
                      { l:'GST',       v:profile.gstNumber ? '✅ Registered' : '⚠️ Not registered' },
                      { l:'Udyam',     v:profile.udyamNumber ? '✅ Registered' : '⚠️ Not registered' },
                    ].map(({ l, v }) => (
                      <p key={l} style={{ fontSize:12, color:'var(--text2)' }}>{l}: <span style={{ fontWeight:600, color:'var(--text1)' }}>{v}</span></p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:28 }}>
            <button onClick={back} disabled={step===1} className="btn btn-secondary" style={{ opacity: step===1 ? 0.4 : 1, gap:6 }}>
              <ChevronLeft size={15} /> Back
            </button>
            {step < 5
              ? <button onClick={next} className="btn btn-primary" style={{ gap:6 }}>Next <ChevronRight size={15} /></button>
              : <button onClick={submit} className="btn btn-primary">Analyze My Business 🚀</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
