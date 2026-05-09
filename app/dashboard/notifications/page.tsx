'use client';
import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, Send, Loader2, X, Phone, MessageSquare, Settings, Eye, EyeOff, CheckCheck } from 'lucide-react';
import { getToken, apiGetProfile } from '@/lib/apiClient';

type AlertType = 'urgent'|'warning'|'info'|'success';
interface Notif { id:string; title:string; message:string; type:AlertType; time:string; read:boolean; }

const TCFG = {
  urgent:  { icon:AlertTriangle, color:'var(--red)',    bg:'rgba(239,68,68,0.07)',  border:'rgba(239,68,68,0.22)' },
  warning: { icon:AlertTriangle, color:'var(--amber)',  bg:'rgba(245,158,11,0.07)', border:'rgba(245,158,11,0.22)' },
  info:    { icon:Info,          color:'var(--accent)', bg:'rgba(91,94,244,0.07)',  border:'rgba(91,94,244,0.22)' },
  success: { icon:CheckCircle2,  color:'var(--green)',  bg:'rgba(16,185,129,0.07)', border:'rgba(16,185,129,0.22)' },
};

const NOTIFS: Notif[] = [
  { id:'1', title:'GSTR-1 Due in 2 Days',       message:'GSTR-1 for April 2025 is due May 11. File now to avoid ₹50/day penalty.', type:'urgent',  time:'2h ago',  read:false },
  { id:'2', title:'GSTR-3B Due in 11 Days',      message:'Your monthly GSTR-3B is due May 20, 2025.',                               type:'warning', time:'1d ago',  read:false },
  { id:'3', title:'Mudra Loan Eligibility',      message:'You qualify for Mudra Kishore loan up to ₹5 Lakhs based on your profile.',type:'info',    time:'2d ago',  read:false },
  { id:'4', title:'Udyam Registration Missing',  message:'Register on Udyam portal — unlocks priority lending and subsidies.',      type:'warning', time:'3d ago',  read:true  },
  { id:'5', title:'TDS Return Due May 31',       message:'Q4 TDS return deadline is May 31, 2025.',                                 type:'warning', time:'6d ago',  read:true  },
  { id:'6', title:'PMEGP Scheme Open',           message:'Apply for PMEGP subsidy up to 25% before June deadline.',                 type:'info',    time:'1w ago',  read:true  },
];

// ── Settings Panel ──────────────────────────────────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [form,    setForm]    = useState({ fast2smsKey:'', twilioSid:'', twilioToken:'', twilioWaPhone:'' });
  const [show,    setShow]    = useState<Record<string,boolean>>({});
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts/config', { headers:{ Authorization:`Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => { if (d.config) setForm(f => ({ ...f, ...d.config })); })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true); setMsg('');
    const body: Record<string,string> = {};
    if (form.fast2smsKey)   body.fast2smsKey   = form.fast2smsKey;
    if (form.twilioSid)     body.twilioSid     = form.twilioSid;
    if (form.twilioToken)   body.twilioToken   = form.twilioToken;
    if (form.twilioWaPhone) body.twilioWaPhone = form.twilioWaPhone;
    try {
      const r = await fetch('/api/alerts/config', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` }, body:JSON.stringify(body) });
      const d = await r.json();
      setMsg(d.success ? '✅ Credentials saved securely' : '❌ ' + (d.error || 'Save failed'));
    } catch { setMsg('❌ Network error'); }
    finally { setSaving(false); }
  };

  const inp = (label: string, key: keyof typeof form, ph: string, hint: string) => (
    <div key={key} style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:11.5, fontWeight:700, color:'var(--text3)', letterSpacing:'0.06em', marginBottom:6 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input type={show[key] ? 'text' : 'password'} value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
          style={{ width:'100%', padding:'10px 40px 10px 12px', fontSize:13, color:'var(--text1)', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:9, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor='var(--accent)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
        <button type="button" onClick={() => setShow(s => ({ ...s, [key]:!s[key] }))}
          style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)' }}>
          {show[key] ? <EyeOff size={13}/> : <Eye size={13}/>}
        </button>
      </div>
      <p style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>{hint}</p>
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:480, background:'var(--card)', border:'1px solid var(--border2)', borderRadius:20, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.5)', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,rgba(91,94,244,0.08),rgba(124,58,237,0.05))' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}><Settings size={16} color="#fff"/></div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--text1)' }}>Alert Settings</p>
              <p style={{ fontSize:11.5, color:'var(--text3)' }}>Configure SMS & WhatsApp delivery</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)' }}><X size={13}/></button>
        </div>

        <div style={{ padding:24 }}>
          {loading ? <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text3)' }}>Loading…</div> : <>

            {/* Fast2SMS */}
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.2)', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <Phone size={15} color="var(--green)"/>
                <p style={{ fontSize:13.5, fontWeight:700, color:'var(--text1)' }}>SMS — Fast2SMS</p>
                <span style={{ marginLeft:'auto', fontSize:11, padding:'2px 8px', borderRadius:99, background:'rgba(16,185,129,0.15)', color:'var(--green)', fontWeight:700 }}>FREE TIER</span>
              </div>
              <p style={{ fontSize:12, color:'var(--text2)', marginBottom:12, lineHeight:1.55 }}>
                Sign up at <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" style={{ color:'var(--accent)' }}>fast2sms.com</a> → Dashboard → Dev API → Copy your API key. Free trial gives 38 credits.
              </p>
              {inp('FAST2SMS API KEY', 'fast2smsKey', 'Paste your API key here', 'For Indian phone numbers (₹0.15–0.30 per SMS after free credits)')}
            </div>

            {/* Twilio WhatsApp */}
            <div style={{ padding:'14px 16px', borderRadius:12, background:'rgba(37,211,102,0.05)', border:'1px solid rgba(37,211,102,0.2)', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <MessageSquare size={15} color="#25D366"/>
                <p style={{ fontSize:13.5, fontWeight:700, color:'var(--text1)' }}>WhatsApp — Twilio</p>
                <span style={{ marginLeft:'auto', fontSize:11, padding:'2px 8px', borderRadius:99, background:'rgba(37,211,102,0.12)', color:'#25D366', fontWeight:700 }}>FREE TRIAL</span>
              </div>
              <p style={{ fontSize:12, color:'var(--text2)', marginBottom:4, lineHeight:1.55 }}>
                Sign up at <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noreferrer" style={{ color:'var(--accent)' }}>twilio.com</a> (free $15 credit). Then join sandbox: send <code style={{ background:'var(--bg3)', padding:'1px 5px', borderRadius:4, fontSize:11 }}>join &lt;word&gt;</code> to <strong>+14155238886</strong> on WhatsApp.
              </p>
              <div style={{ padding:'8px 10px', borderRadius:8, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:14 }}>
                <p style={{ fontSize:11.5, color:'var(--amber)' }}>⚠️ Your number must join the sandbox first before receiving messages.</p>
              </div>
              {inp('TWILIO ACCOUNT SID',   'twilioSid',     'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'From Twilio Console → Account Info')}
              {inp('TWILIO AUTH TOKEN',     'twilioToken',   'Your auth token', 'From Twilio Console → Account Info')}
              {inp('WHATSAPP FROM NUMBER', 'twilioWaPhone', '+14155238886', 'Sandbox: +14155238886  |  Paid: your Twilio number')}
            </div>

            {msg && (
              <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:14, background: msg.startsWith('✅') ? 'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)', border:`1px solid ${msg.startsWith('✅') ? 'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`, color: msg.startsWith('✅') ? 'var(--green)':'var(--red)', fontSize:13 }}>
                {msg}
              </div>
            )}

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={onClose} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary" style={{ flex:2, justifyContent:'center' }}>
                {saving ? <><Loader2 size={13} style={{ animation:'spin 0.7s linear infinite' }}/> Saving…</> : '🔐 Save Credentials'}
              </button>
            </div>
          </>}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ── Send Alert Modal ────────────────────────────────────────────────────────
function SendModal({ notif, mobile, onClose }: { notif:Notif; mobile:string; onClose:()=>void }) {
  const [ch,      setCh]      = useState(new Set(['sms','whatsapp']));
  const [sending, setSending] = useState(false);
  const [result,  setResult]  = useState<{ok:boolean; msg:string}|null>(null);
  const [showCfg, setShowCfg] = useState(false);

  const toggle = (c:string) => setCh(p => { const n=new Set(p); n.has(c)?n.delete(c):n.add(c); return n; });

  const send = async () => {
    if (!ch.size) return;
    setSending(true); setResult(null);
    try {
      const r = await fetch('/api/alerts/send', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` },
        body: JSON.stringify({ channels:Array.from(ch), alertTitle:notif.title, alertMessage:notif.message, alertType:notif.type }) });
      const d = await r.json();
      if (d.needsSetup) { setShowCfg(true); setSending(false); return; }
      setResult({ ok:d.success, msg: d.message });
    } catch (e:any) { setResult({ ok:false, msg:e.message }); }
    finally { setSending(false); }
  };

  if (showCfg) return <SettingsPanel onClose={() => { setShowCfg(false); onClose(); }} />;

  const cfg = TCFG[notif.type];
  const Icon = cfg.icon;

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:440, background:'var(--card)', border:'1px solid var(--border2)', borderRadius:20, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.5)' }}>

        <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,rgba(91,94,244,0.08),transparent)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}><Send size={15} color="#fff"/></div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:'var(--text1)' }}>Send Alert</p>
              <p style={{ fontSize:11.5, color:'var(--text3)' }}>To: +91 {mobile}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, background:'var(--bg3)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text2)' }}><X size={13}/></button>
        </div>

        <div style={{ padding:22 }}>
          {/* Alert preview */}
          <div style={{ padding:'12px 14px', borderRadius:11, background:cfg.bg, border:`1px solid ${cfg.border}`, marginBottom:20, display:'flex', gap:10 }}>
            <Icon size={14} color={cfg.color} style={{ flexShrink:0, marginTop:2 }}/>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'var(--text1)', marginBottom:3 }}>{notif.title}</p>
              <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>{notif.message}</p>
            </div>
          </div>

          <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', letterSpacing:'0.06em', marginBottom:10 }}>SELECT CHANNELS</p>

          {[
            { id:'sms',      icon:Phone,          label:'SMS',      sub:mobile ? `+91 ${mobile}`:'No mobile on profile', color:'#10b981' },
            { id:'whatsapp', icon:MessageSquare,  label:'WhatsApp', sub:mobile ? `+91 ${mobile}`:'No mobile on profile', color:'#25D366' },
          ].map(({ id, icon:Ic, label, sub, color }) => {
            const active  = ch.has(id);
            const enabled = !!mobile;
            return (
              <label key={id} onClick={() => enabled && toggle(id)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, border:`1px solid ${active&&enabled?'var(--border2)':'var(--border)'}`, background:active&&enabled?'rgba(91,94,244,0.06)':'var(--bg3)', cursor:enabled?'pointer':'not-allowed', opacity:enabled?1:0.45, marginBottom:10, transition:'all 0.15s' }}>
                <div style={{ width:34, height:34, borderRadius:9, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic size={15} color={color}/></div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text1)' }}>{label}</p>
                  <p style={{ fontSize:11.5, color:'var(--text3)' }}>{sub}</p>
                </div>
                <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${active&&enabled?'var(--accent)':'var(--border)'}`, background:active&&enabled?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {active&&enabled&&<CheckCircle2 size={11} color="#fff"/>}
                </div>
              </label>
            );
          })}

          {result && (
            <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:14, background:result.ok?'rgba(16,185,129,0.08)':'rgba(239,68,68,0.08)', border:`1px solid ${result.ok?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`, color:result.ok?'var(--green)':'var(--red)', fontSize:13 }}>
              {result.msg}
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
            <button onClick={send} disabled={sending||!ch.size||!mobile} className="btn btn-primary" style={{ flex:2, justifyContent:'center', opacity:(!ch.size||!mobile)?0.5:1 }}>
              {sending ? <><Loader2 size={13} style={{ animation:'spin 0.7s linear infinite' }}/> Sending…</> : <><Send size={13}/> Send to {ch.size} channel{ch.size!==1?'s':''}</>}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifs,  setNotifs]  = useState(NOTIFS);
  const [filter,  setFilter]  = useState<'all'|AlertType>('all');
  const [sending, setSending] = useState<Notif|null>(null);
  const [showCfg, setShowCfg] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => { apiGetProfile().then(p => { if (p) setProfile(p); }).catch(()=>{}); }, []);

  const mobile   = profile?.mobile || '';
  const unread   = notifs.filter(n => !n.read).length;
  const filtered = notifs.filter(n => filter==='all'||n.type===filter);

  const markAll = () => setNotifs(p => p.map(n => ({ ...n, read:true })));

  return (
    <div className="page-content" style={{ maxWidth:760 }}>
      {sending && <SendModal notif={sending} mobile={mobile} onClose={() => setSending(null)} />}
      {showCfg && <SettingsPanel onClose={() => setShowCfg(false)} />}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }} className="animate-fade-up">
        <div>
          <h1 className="page-title"><Bell size={22} color="var(--pink)"/> Notifications & Alerts</h1>
          <p className="page-subtitle">{unread>0?`${unread} unread alerts`:'All caught up!'}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {unread>0&&<button onClick={markAll} className="btn btn-secondary" style={{ gap:5, fontSize:12 }}><CheckCheck size={13}/> Mark all read</button>}
          <button onClick={() => setShowCfg(true)} className="btn btn-secondary" style={{ gap:5, fontSize:12 }}><Settings size={13}/> Alert Settings</button>
        </div>
      </div>

      {/* Channel status */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }} className="animate-fade-up delay-100">
        {[
          { icon:Phone,         label:'SMS — Fast2SMS',   sub: mobile?`+91 ${mobile}`:'Add mobile to profile', color:'#10b981' },
          { icon:MessageSquare, label:'WhatsApp — Twilio', sub: mobile?`+91 ${mobile}`:'Add mobile to profile', color:'#25D366' },
        ].map(({ icon:Ic, label, sub, color }) => (
          <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:13, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Ic size={16} color={color}/></div>
            <div>
              <p style={{ fontSize:12.5, fontWeight:600, color:'var(--text1)', marginBottom:2 }}>{label}</p>
              <p style={{ fontSize:11.5, color:'var(--text3)' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {!mobile && (
        <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.22)', marginBottom:20, fontSize:13, color:'var(--amber)' }}>
          ⚠️ Add your mobile number in <a href="/onboarding" style={{ color:'var(--accent)', fontWeight:600 }}>Business Profile</a> to enable SMS & WhatsApp alerts.
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {(['all','urgent','warning','info','success'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, cursor:'pointer', outline:'none', border:`1px solid ${filter===f?'var(--accent)':'var(--border)'}`, background:filter===f?'var(--accent)':'transparent', color:filter===f?'#fff':'var(--text2)', transition:'all 0.15s' }}>
            {f==='all'?`All (${notifs.length})`:f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(notif => {
          const cfg  = TCFG[notif.type];
          const Icon = cfg.icon;
          return (
            <div key={notif.id} style={{ background:notif.read?'var(--card)':cfg.bg, border:`1px solid ${notif.read?'var(--border)':cfg.border}`, borderLeft:`3px solid ${notif.read?'var(--border)':cfg.color}`, borderRadius:13, padding:'14px 18px' }} className="animate-fade-up">
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:11, flex:1 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${cfg.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <Icon size={14} color={cfg.color}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <p style={{ fontSize:13.5, fontWeight:notif.read?500:700, color:'var(--text1)' }}>{notif.title}</p>
                      {!notif.read&&<span style={{ width:6, height:6, borderRadius:'50%', background:cfg.color, display:'inline-block' }}/>}
                    </div>
                    <p style={{ fontSize:12.5, color:'var(--text2)', lineHeight:1.6, marginBottom:4 }}>{notif.message}</p>
                    <span style={{ fontSize:11, color:'var(--text3)' }}>{notif.time}</span>
                  </div>
                </div>
                <button onClick={() => { setNotifs(p=>p.map(n=>n.id===notif.id?{...n,read:true}:n)); setSending(notif); }}
                  className="btn btn-primary" style={{ padding:'7px 14px', fontSize:12, gap:5, flexShrink:0 }}>
                  <Send size={12}/> Send Alert
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
