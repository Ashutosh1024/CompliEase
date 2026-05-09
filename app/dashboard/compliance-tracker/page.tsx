'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/store';
import { analyzeCompliance } from '@/lib/compliance-data';
import { ComplianceItem, BusinessProfile } from '@/lib/types';
import { CheckCircle2, AlertTriangle, XCircle, Filter, ClipboardList } from 'lucide-react';

const SCFG = {
  completed: { icon: CheckCircle2, color: 'var(--green)',  bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)',  label: 'Completed', badge: 'badge-green', iconBg: 'rgba(16,185,129,0.12)' },
  pending:   { icon: AlertTriangle, color: 'var(--amber)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Pending',   badge: 'badge-amber', iconBg: 'rgba(245,158,11,0.12)' },
  missing:   { icon: XCircle,      color: 'var(--red)',   bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',  label: 'Missing',   badge: 'badge-red',   iconBg: 'rgba(239,68,68,0.12)'  },
};
const CAT_BADGE: Record<string, string> = { Tax: 'badge-blue', License: 'badge-amber', Registration: 'badge-cyan', Filing: 'badge-indigo' };

export default function ComplianceTrackerPage() {
  const [items,   setItems]   = useState<ComplianceItem[]>([]);
  const [filter,  setFilter]  = useState<'all'|'Tax'|'License'|'Registration'|'Filing'>('all');
  const [status,  setStatus]  = useState<'all'|'completed'|'pending'|'missing'>('all');
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => { const p = getProfile(); if (p) { setProfile(p); setItems(analyzeCompliance(p)); } }, []);

  const filtered = items.filter(i => (filter === 'all' || i.category === filter) && (status === 'all' || i.status === status));
  const cn = { all: items.length, completed: items.filter(i => i.status === 'completed').length, pending: items.filter(i => i.status === 'pending').length, missing: items.filter(i => i.status === 'missing').length };

  const statusColors: Record<string, string> = { all: 'var(--accent)', completed: 'var(--green)', pending: 'var(--amber)', missing: 'var(--red)' };

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }} className="animate-fade-up">
        <h1 className="page-title"><ClipboardList size={22} color="var(--accent)" /> Compliance Tracker</h1>
        <p className="page-subtitle">All compliance requirements for {profile?.businessName}</p>
      </div>

      {/* Status filter cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }} className="animate-fade-up delay-100">
        {(['all','completed','pending','missing'] as const).map(s => {
          const active  = status === s;
          const count   = s === 'all' ? cn.all : cn[s];
          const c       = statusColors[s];
          return (
            <button key={s} onClick={() => setStatus(s)} style={{ padding: 16, borderRadius: 14, textAlign: 'left', cursor: 'pointer', border: `1px solid ${active ? c+'40' : 'var(--border)'}`, background: active ? `${c}10` : 'var(--card)', boxShadow: active ? `0 0 0 1px ${c}25` : 'none', transition: 'all 0.18s', outline: 'none' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 28, fontWeight: 800, color: c, lineHeight: 1 }}>{count}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginTop: 5, textTransform: 'capitalize' }}>{s === 'all' ? 'Total' : s}</p>
            </button>
          );
        })}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} color="var(--text3)" />
        {(['all','Tax','License','Registration','Filing'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter===f ? 'var(--accent)' : 'var(--border)'}`, background: filter===f ? 'var(--accent)' : 'transparent', color: filter===f ? '#fff' : 'var(--text2)', transition: 'all 0.15s', outline: 'none' }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((item, i) => {
          const c  = SCFG[item.status];
          const Icon = c.icon;
          return (
            <div key={item.id} className="animate-fade-up" style={{ padding: '16px 18px', borderRadius: 14, border: `1px solid ${c.border}`, borderLeft: `3px solid ${c.color}`, background: c.bg, display: 'flex', gap: 14, alignItems: 'flex-start', animationDelay: `${i * 30}ms`, transition: 'box-shadow 0.2s' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={c.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{item.name}</h3>
                  <span className={`badge ${CAT_BADGE[item.category] || 'badge-blue'}`}>{item.category}</span>
                  <span className={`badge ${c.badge}`}>{c.label}</span>
                  {item.priority === 'high' && <span className="badge badge-red">High Priority</span>}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{item.description}</p>
                {item.dueDate && <p style={{ fontSize: 12, color: 'var(--amber)', marginTop: 5, fontWeight: 500 }}>📅 Due: {item.dueDate}</p>}
              </div>
              {item.status !== 'completed' && (
                <button className="btn btn-primary" style={{ flexShrink: 0, padding: '7px 14px', fontSize: 12 }}>
                  {item.status === 'missing' ? 'Register' : 'File Now'}
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16 }}>
            <CheckCircle2 size={40} color="var(--green)" style={{ display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text1)' }}>All clear!</p>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginTop: 6 }}>No items match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
