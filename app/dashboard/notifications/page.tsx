'use client';
import { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface Notif { id: string; title: string; message: string; type: 'urgent'|'warning'|'info'|'success'; time: string; read: boolean; }

const NOTIFICATIONS: Notif[] = [
  { id:'1', title:'GSTR-1 Due in 2 Days', message:'Your GSTR-1 for April 2025 is due May 11. File now to avoid ₹50/day penalty.', type:'urgent', time:'2 hours ago', read:false },
  { id:'2', title:'GSTR-3B Due in 11 Days', message:'Your monthly GSTR-3B is due May 20, 2025.', type:'warning', time:'1 day ago', read:false },
  { id:'3', title:'Mudra Loan Eligibility', message:'Based on your profile, you qualify for Mudra Kishore loan up to ₹5 Lakhs.', type:'info', time:'2 days ago', read:false },
  { id:'4', title:'Udyam Registration Missing', message:'Register on Udyam portal for free — unlocks government benefits.', type:'warning', time:'3 days ago', read:true },
  { id:'5', title:'Profile Setup Complete', message:'Your business profile is set up. AI analysis complete.', type:'success', time:'4 days ago', read:true },
  { id:'6', title:'PMEGP Scheme Alert', message:'PMEGP application deadline approaching. You qualify for up to 25% subsidy.', type:'info', time:'5 days ago', read:true },
  { id:'7', title:'TDS Return Due May 31', message:'Q4 TDS return deadline is May 31, 2025. Ensure TDS is deposited.', type:'warning', time:'6 days ago', read:true },
];

const TCFG = {
  urgent:  { icon: AlertTriangle, color:'var(--red)',    bg:'rgba(239,68,68,0.1)',   border:'rgba(239,68,68,0.22)' },
  warning: { icon: AlertTriangle, color:'var(--amber)',  bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.22)' },
  info:    { icon: Info,          color:'var(--accent)', bg:'rgba(91,94,244,0.1)',   border:'rgba(91,94,244,0.22)' },
  success: { icon: CheckCircle2,  color:'var(--green)',  bg:'rgba(16,185,129,0.1)',  border:'rgba(16,185,129,0.22)' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<'all'|'urgent'|'warning'|'info'|'success'>('all');
  const unread   = notifs.filter(n => !n.read).length;
  const filtered = notifs.filter(n => filter === 'all' || n.type === filter);

  const markRead    = (id: string) => setNotifs(p => p.map(n => n.id===id ? {...n, read:true} : n));
  const markAllRead = () => setNotifs(p => p.map(n => ({...n, read:true})));

  return (
    <div className="page-content" style={{ maxWidth: 760 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }} className="animate-fade-up">
        <div>
          <h1 className="page-title">
            <Bell size={22} color="var(--pink)" />
            Notifications
            {unread > 0 && (
              <span style={{ fontSize:12, padding:'2px 8px', borderRadius:99, background:'var(--red)', color:'#fff', fontWeight:700 }}>{unread}</span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated on deadlines and opportunities</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-secondary" style={{ gap:7 }}>
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:22, flexWrap:'wrap' }} className="animate-fade-up delay-100">
        {(['all','urgent','warning','info','success'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'6px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, cursor:'pointer', outline:'none', textTransform:'capitalize', border:`1px solid ${filter===f ? 'var(--accent)' : 'var(--border)'}`, background:filter===f ? 'var(--accent)' : 'transparent', color:filter===f ? '#fff' : 'var(--text2)', transition:'all 0.15s' }}>
            {f === 'all' ? `All (${notifs.length})` : f}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map((n, i) => {
          const c   = TCFG[n.type];
          const Icon = c.icon;
          return (
            <div key={n.id} onClick={() => markRead(n.id)} className="animate-fade-up"
              style={{ display:'flex', gap:14, padding:'14px 16px', borderRadius:14, cursor:'pointer', transition:'all 0.18s', border:`1px solid ${n.read ? 'var(--border)' : c.border}`, background: n.read ? 'var(--card)' : c.bg, opacity: n.read ? 0.75 : 1, animationDelay:`${i*30}ms` }}>
              <div style={{ width:36, height:36, borderRadius:10, background:c.bg, border:`1px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={16} color={c.color} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:'var(--text1)' }}>{n.title}</p>
                  {!n.read && <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--accent)', flexShrink:0 }} />}
                </div>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.55 }}>{n.message}</p>
                <p style={{ fontSize:11.5, color:'var(--text3)', marginTop:5 }}>{n.time}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', background:'var(--card)', border:'1px solid var(--border)', borderRadius:16 }}>
            <Bell size={36} color="var(--text3)" style={{ display:'block', margin:'0 auto 12px' }} />
            <p style={{ fontSize:15, fontWeight:600, color:'var(--text1)' }}>No notifications</p>
            <p style={{ fontSize:13, color:'var(--text2)', marginTop:5 }}>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
