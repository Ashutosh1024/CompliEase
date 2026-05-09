'use client';
import { Settings, Bell, Shield, Moon, Sun, Globe, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width:44, height:24, borderRadius:99, position:'relative', border:'none', cursor:'pointer', background: on ? 'var(--accent)' : 'var(--bg4)', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', width:18, height:18, borderRadius:'50%', background:'#fff', top:3, left: on ? 23 : 3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.25)' }} />
    </button>
  );
}

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 24px', marginBottom:16 }} className="animate-fade-up">
    <h2 style={{ fontSize:14, fontWeight:600, color:'var(--text1)', display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
      {icon} {title}
    </h2>
    {children}
  </div>
);

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [notifs, setNotifs] = useState({ gst:true, deadlines:true, schemes:true, whatsapp:false });

  const NOTIF_ITEMS = [
    { k:'gst',      l:'GST Filing Reminders',      d:'GSTR-1, GSTR-3B, annual return alerts' },
    { k:'deadlines',l:'Compliance Deadlines',       d:'License renewals, tax deadlines' },
    { k:'schemes',  l:'Government Scheme Alerts',   d:'New scheme announcements & opportunities' },
    { k:'whatsapp', l:'WhatsApp Notifications',     d:'Get alerts on WhatsApp (coming soon)' },
  ];

  return (
    <div className="page-content" style={{ maxWidth:700 }}>
      <div style={{ marginBottom:28 }} className="animate-fade-up">
        <h1 className="page-title"><Settings size={22} color="var(--text2)" /> Settings</h1>
        <p className="page-subtitle">Manage your preferences and account settings</p>
      </div>

      {/* Notifications */}
      <Section title="Notification Preferences" icon={<Bell size={15} color="var(--accent)" />}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {NOTIF_ITEMS.map(({ k, l, d }) => (
            <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
              <div>
                <p style={{ fontSize:14, fontWeight:500, color:'var(--text1)' }}>{l}</p>
                <p style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{d}</p>
              </div>
              <Toggle on={notifs[k as keyof typeof notifs]} onToggle={() => setNotifs(p => ({ ...p, [k]: !p[k as keyof typeof notifs] }))} />
            </div>
          ))}
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={theme==='dark' ? <Moon size={15} color="#818cf8" /> : <Sun size={15} color="#fbbf24" />}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ fontSize:14, fontWeight:500, color:'var(--text1)' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
            <p style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>Currently: {theme === 'dark' ? 'Dark theme active' : 'Light theme active'}</p>
          </div>
          <Toggle on={theme === 'dark'} onToggle={toggle} />
        </div>
      </Section>

      {/* Language */}
      <Section title="Language" icon={<Globe size={15} color="var(--cyan)" />}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {['English', 'हिंदी (coming soon)', 'मराठी (coming soon)'].map((lang, i) => (
            <button key={lang} disabled={i>0} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:12, border:`1px solid ${i===0 ? 'rgba(91,94,244,0.35)' : 'var(--border)'}`, background: i===0 ? 'rgba(91,94,244,0.08)' : 'transparent', cursor: i===0 ? 'pointer' : 'not-allowed', opacity: i>0 ? 0.5 : 1, transition:'all 0.15s', outline:'none' }}>
              <span style={{ fontSize:14, color: i===0 ? 'var(--accent)' : 'var(--text2)', fontWeight: i===0 ? 600 : 400 }}>{lang}</span>
              {i===0 && <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)' }} />}
            </button>
          ))}
        </div>
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Security" icon={<Shield size={15} color="var(--green)" />}>
        {[
          { l:'Change Password',  d:'Update your account password',                    danger:false },
          { l:'Export My Data',   d:'Download all your business data as CSV/JSON',      danger:false },
          { l:'Delete Account',   d:'Permanently delete account and all data',          danger:true  },
        ].map(({ l, d, danger }) => (
          <button key={l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'12px 14px', borderRadius:12, marginBottom:8, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', outline:'none', transition:'all 0.15s', textAlign:'left' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = danger ? 'rgba(239,68,68,0.4)' : 'var(--border2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}>
            <div>
              <p style={{ fontSize:14, fontWeight:500, color: danger ? 'var(--red)' : 'var(--text1)' }}>{l}</p>
              <p style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>{d}</p>
            </div>
            <ChevronRight size={14} color="var(--text3)" />
          </button>
        ))}
      </Section>
    </div>
  );
}
