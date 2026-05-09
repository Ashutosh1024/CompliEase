'use client';
import { useEffect, useState } from 'react';
import { apiGetProfile } from '@/lib/apiClient';
import { analyzeCompliance } from '@/lib/compliance-data';
import { ComplianceItem, BusinessProfile } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, Filter, ClipboardList, ExternalLink, UploadCloud, Loader2 } from 'lucide-react';

const SCFG = {
  completed: { icon: CheckCircle2, color:'var(--green)',  bg:'rgba(16,185,129,0.06)', border:'rgba(16,185,129,0.2)',  label:'Completed', badge:'badge-green', iconBg:'rgba(16,185,129,0.12)' },
  pending:   { icon: AlertTriangle, color:'var(--amber)', bg:'rgba(245,158,11,0.06)', border:'rgba(245,158,11,0.2)', label:'Pending',   badge:'badge-amber', iconBg:'rgba(245,158,11,0.12)' },
  missing:   { icon: XCircle,      color:'var(--red)',   bg:'rgba(239,68,68,0.06)',  border:'rgba(239,68,68,0.2)',  label:'Missing',   badge:'badge-red',   iconBg:'rgba(239,68,68,0.12)'  },
};
const CAT_BADGE: Record<string,string> = { Tax:'badge-blue', License:'badge-amber', Registration:'badge-cyan', Filing:'badge-indigo' };

// Map compliance item IDs → government portal links
const PORTAL_LINKS: Record<string,{ label:string; url:string }> = {
  'gst-reg':   { label:'Register on GST Portal', url:'https://reg.gst.gov.in/registration/' },
  'gstr3b':    { label:'File GSTR-3B', url:'https://return.gst.gov.in' },
  'gstr1':     { label:'File GSTR-1',  url:'https://return.gst.gov.in' },
  'pan':       { label:'Apply for PAN', url:'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html' },
  'udyam':     { label:'Register on Udyam', url:'https://udyamregistration.gov.in' },
  'fssai':     { label:'Apply FSSAI License', url:'https://foscos.fssai.gov.in' },
  'shop-act':  { label:'Apply Shop Act', url:'https://labour.gov.in' },
  'trade':     { label:'Apply Trade License', url:'https://mcgm.gov.in' },
  'itr':       { label:'File ITR', url:'https://eportal.incometax.gov.in' },
  'pt':        { label:'Register Professional Tax', url:'https://mahagst.gov.in' },
  'esi':       { label:'Register ESI', url:'https://www.esic.in' },
  'pf':        { label:'Register PF/EPFO', url:'https://unifiedportal-emp.epfindia.gov.in' },
};

// Field to collect for items that are missing
const MISSING_FIELDS: Record<string,{ label:string; field:string }> = {
  'gst-reg': { label:'Enter your GST Number', field:'gstNumber' },
  'pan':     { label:'Enter your PAN Number',   field:'panNumber' },
  'udyam':   { label:'Enter your Udyam Number', field:'udyamNumber' },
  'fssai':   { label:'Mark FSSAI as obtained',  field:'hasFSSAI' },
  'shop-act':{ label:'Mark Shop Act as obtained',field:'hasShopAct' },
  'trade':   { label:'Mark Trade License as obtained', field:'hasTradeLicense' },
};

export default function ComplianceTrackerPage() {
  const [items,   setItems]   = useState<ComplianceItem[]>([]);
  const [filter,  setFilter]  = useState<'all'|'Tax'|'License'|'Registration'|'Filing'>('all');
  const [status,  setStatus]  = useState<'all'|'completed'|'pending'|'missing'>('all');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fillId,  setFillId]  = useState<string|null>(null);
  const [fillVal, setFillVal] = useState('');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    apiGetProfile()
      .then(p => { if (p) { setProfile(p as BusinessProfile); setItems(analyzeCompliance(p as BusinessProfile)); } })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => (filter === 'all' || i.category === filter) && (status === 'all' || i.status === status));
  const cn = {
    all: items.length,
    completed: items.filter(i => i.status === 'completed').length,
    pending:   items.filter(i => i.status === 'pending').length,
    missing:   items.filter(i => i.status === 'missing').length,
  };

  const saveField = async (id: string, field: string, val: string | boolean) => {
    setSaving(true);
    try {
      const { getToken } = await import('@/lib/apiClient');
      const token = getToken();
      const update = { [field]: val };
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ ...profile, ...update }),
      });
      const updated = { ...profile!, ...update } as BusinessProfile;
      setProfile(updated);
      setItems(analyzeCompliance(updated));
      setFillId(null); setFillVal('');
    } catch (e) { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const STAT_COLORS: Record<string,string> = { all:'var(--accent)', completed:'var(--green)', pending:'var(--amber)', missing:'var(--red)' };

  if (loading) return (
    <div className="page-content" style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:400 }}>
      <div style={{ textAlign:'center' }}>
        <Loader2 size={28} color="var(--accent)" style={{ display:'block', margin:'0 auto 12px', animation:'spin 0.8s linear infinite' }} />
        <p style={{ color:'var(--text2)', fontSize:13 }}>Loading your compliance status…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-content">
      <div style={{ marginBottom:28 }} className="animate-fade-up">
        <h1 className="page-title"><ClipboardList size={22} color="var(--accent)" /> Compliance Tracker</h1>
        <p className="page-subtitle">All compliance requirements for {profile?.businessName || 'your business'}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }} className="animate-fade-up delay-100">
        {(['all','completed','pending','missing'] as const).map(s => {
          const active = status === s;
          const count  = s === 'all' ? cn.all : cn[s];
          const c      = STAT_COLORS[s];
          return (
            <button key={s} onClick={() => setStatus(s)} style={{ padding:16, borderRadius:14, textAlign:'left', cursor:'pointer', border:`1px solid ${active ? c+'40':'var(--border)'}`, background:active ? `${c}10`:'var(--card)', transition:'all 0.18s', outline:'none' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28, fontWeight:800, color:c, lineHeight:1 }}>{count}</p>
              <p style={{ fontSize:13, fontWeight:500, color:'var(--text2)', marginTop:5, textTransform:'capitalize' }}>{s === 'all' ? 'Total' : s}</p>
            </button>
          );
        })}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
        <Filter size={14} color="var(--text3)" />
        {(['all','Tax','License','Registration','Filing'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:'6px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, cursor:'pointer', border:`1px solid ${filter===f?'var(--accent)':'var(--border)'}`, background:filter===f?'var(--accent)':'transparent', color:filter===f?'#fff':'var(--text2)', transition:'all 0.15s', outline:'none' }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(item => {
          const cfg     = SCFG[item.status];
          const Icon    = cfg.icon;
          const portal  = PORTAL_LINKS[item.id];
          const missing = MISSING_FIELDS[item.id];
          const filling = fillId === item.id;
          const isBoolean = missing && (missing.field.startsWith('has'));

          return (
            <div key={item.id} style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderLeft:`3px solid ${cfg.color}`, borderRadius:14, padding:'16px 20px', transition:'all 0.15s' }} className="animate-fade-up">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>

                <div style={{ display:'flex', alignItems:'flex-start', gap:12, flex:1 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:cfg.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <Icon size={16} color={cfg.color} />
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:5 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{item.name}</span>
                      <span className={`badge ${CAT_BADGE[item.category]}`}>{item.category}</span>
                      <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                      {item.priority === 'high' && <span className="badge badge-red">High Priority</span>}
                    </div>
                    <p style={{ fontSize:12.5, color:'var(--text2)' }}>{item.description}</p>
                    {item.dueDate && (
                      <p style={{ fontSize:11.5, color:'var(--amber)', marginTop:4 }}>📅 Due: {item.dueDate}</p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:8, flexShrink:0, alignItems:'center', flexWrap:'wrap' }}>
                  {/* If missing/pending and we know the field → show "Fill Detail" button */}
                  {item.status !== 'completed' && missing && (
                    <button onClick={() => { setFillId(filling ? null : item.id); setFillVal(''); }}
                      className="btn btn-secondary"
                      style={{ padding:'7px 14px', fontSize:12, gap:5 }}>
                      <UploadCloud size={13} /> {filling ? 'Cancel' : 'Fill Detail'}
                    </button>
                  )}
                  {/* Portal link button */}
                  {item.status !== 'completed' && portal && (
                    <a href={portal.url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding:'7px 14px', fontSize:12, gap:5, textDecoration:'none' }}>
                      {item.category === 'Filing' ? 'File Now' : 'Register'} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Inline fill form */}
              {filling && missing && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${cfg.border}` }}>
                  <p style={{ fontSize:12.5, fontWeight:600, color:'var(--text1)', marginBottom:10 }}>
                    📝 {missing.label}
                  </p>
                  {isBoolean ? (
                    <div style={{ display:'flex', gap:10 }}>
                      <button onClick={() => saveField(item.id, missing.field, true)} disabled={saving}
                        className="btn btn-primary" style={{ padding:'8px 18px', fontSize:13 }}>
                        {saving ? <><Loader2 size={13} style={{ animation:'spin 0.7s linear infinite' }} /> Saving…</> : '✅ Mark as Obtained'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <input
                        value={fillVal} onChange={e => setFillVal(e.target.value.toUpperCase())}
                        placeholder={`Enter ${item.name.split(' ')[0]} number…`}
                        style={{ flex:1, padding:'9px 12px', fontSize:13.5, color:'var(--text1)', background:'var(--input-bg)', border:'1px solid var(--input-border)', borderRadius:9, outline:'none', fontFamily:'inherit', letterSpacing:'0.04em' }}
                        onFocus={e => e.target.style.borderColor='var(--accent)'}
                        onBlur={e  => e.target.style.borderColor='var(--input-border)'}
                      />
                      <button onClick={() => { if (fillVal.trim()) saveField(item.id, missing.field, fillVal.trim()); }} disabled={saving || !fillVal.trim()}
                        className="btn btn-primary" style={{ padding:'9px 18px', fontSize:13, opacity: !fillVal.trim() ? 0.5 : 1 }}>
                        {saving ? <Loader2 size={13} style={{ animation:'spin 0.7s linear infinite' }} /> : 'Save'}
                      </button>
                    </div>
                  )}
                  <p style={{ fontSize:11, color:'var(--text3)', marginTop:8 }}>
                    💡 Updating this will immediately recalculate your compliance score.
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign:'center', padding:'60px 0', background:'var(--card)', border:'1px solid var(--border)', borderRadius:16 }}>
            <CheckCircle2 size={36} color="var(--green)" style={{ display:'block', margin:'0 auto 12px' }} />
            <p style={{ fontSize:15, fontWeight:600, color:'var(--text1)' }}>All clear!</p>
            <p style={{ fontSize:13, color:'var(--text2)', marginTop:5 }}>No items match the selected filter.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
