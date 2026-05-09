'use client';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/store';
import { Calendar, CheckCircle2 } from 'lucide-react';

const DEADLINES = [
  { name: 'GSTR-1 (April)',       date: '2025-05-11', cat: 'GST',         desc: 'Monthly outward supplies return' },
  { name: 'GSTR-3B (April)',      date: '2025-05-20', cat: 'GST',         desc: 'Monthly GST summary return' },
  { name: 'TDS Return Q4',        date: '2025-05-31', cat: 'Income Tax',  desc: 'Q4 TDS return filing' },
  { name: 'ESI Monthly Return',   date: '2025-05-21', cat: 'Labour',      desc: 'Monthly ESI contribution' },
  { name: 'PF Monthly Payment',   date: '2025-05-15', cat: 'Labour',      desc: 'Monthly PF contribution' },
  { name: 'GSTR-1 (May)',         date: '2025-06-11', cat: 'GST',         desc: 'Monthly outward supplies return' },
  { name: 'GSTR-3B (May)',        date: '2025-06-20', cat: 'GST',         desc: 'Monthly GST summary return' },
  { name: 'Professional Tax',     date: '2025-06-30', cat: 'State Tax',   desc: 'Monthly professional tax payment' },
  { name: 'Annual ITR Filing',    date: '2025-07-31', cat: 'Income Tax',  desc: 'FY 2024-25 income tax return' },
  { name: 'FSSAI Renewal',        date: '2025-08-15', cat: 'License',     desc: 'Annual FSSAI license renewal' },
  { name: 'GSTR-9 Annual',        date: '2025-12-31', cat: 'GST',         desc: 'Annual GST return' },
  { name: 'Shop Act Renewal',     date: '2025-12-31', cat: 'License',     desc: 'Annual shop establishment renewal' },
];

const CATS = ['all', 'GST', 'Income Tax', 'State Tax', 'License', 'Labour'];

function daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }

export default function DeadlinesPage() {
  const [filter, setFilter] = useState('all');
  useEffect(() => { getProfile(); }, []);

  const items = DEADLINES.filter(d => filter === 'all' || d.cat === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const urgent   = DEADLINES.filter(d => { const n = daysLeft(d.date); return n >= 0 && n <= 7; }).length;
  const upcoming = DEADLINES.filter(d => { const n = daysLeft(d.date); return n > 7 && n <= 30; }).length;

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }} className="animate-fade-up">
        <h1 className="page-title"><Calendar size={22} color="var(--amber)" /> Deadlines & Calendar</h1>
        <p className="page-subtitle">Track all upcoming filings, payments and renewals</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }} className="animate-fade-up delay-100">
        {[
          { l: 'This Week',     n: urgent,              c: 'var(--red)' },
          { l: 'This Month',    n: upcoming,            c: 'var(--amber)' },
          { l: 'Total Tracked', n: DEADLINES.length,    c: 'var(--accent)' },
        ].map(({ l, n, c }) => (
          <div key={l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 32, fontWeight: 800, color: c, lineHeight: 1 }}>{n}</p>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }} className="animate-fade-up delay-150">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '6px 16px', borderRadius: 99, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filter===c ? 'var(--accent)' : 'var(--border)'}`, background: filter===c ? 'var(--accent)' : 'transparent', color: filter===c ? '#fff' : 'var(--text2)', transition: 'all 0.15s', outline: 'none' }}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((d, i) => {
          const days = daysLeft(d.date);
          const done = days < 0;
          const urgent = !done && days <= 7;
          const warn   = !done && days > 7 && days <= 30;
          const color  = done ? 'var(--green)' : urgent ? 'var(--red)' : warn ? 'var(--amber)' : 'var(--accent)';
          const bgAlpha = done ? '0.06' : '0.07';
          return (
            <div key={i} className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 14, background: `${color}${bgAlpha}`, border: `1px solid ${color}28`, borderLeft: `3px solid ${color}`, animationDelay: `${i * 25}ms`, opacity: done ? 0.65 : 1 }}>
              {/* Date box */}
              <div style={{ width: 50, height: 54, borderRadius: 12, background: `${color}14`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--text1)', lineHeight: 1 }}>
                  {new Date(d.date).getDate()}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                  {new Date(d.date).toLocaleString('default', { month: 'short' })}
                </p>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{d.name}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 99, background: `${color}18`, color }}>{done ? 'Done' : `${days}d left`}</span>
                  <span className={`badge ${d.cat === 'GST' ? 'badge-blue' : d.cat === 'Income Tax' ? 'badge-violet' : d.cat === 'Labour' ? 'badge-pink' : d.cat === 'License' ? 'badge-amber' : 'badge-cyan'}`}>{d.cat}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)' }}>{d.desc}</p>
              </div>

              {/* Action */}
              {done
                ? <CheckCircle2 size={20} color="var(--green)" style={{ flexShrink: 0 }} />
                : <button className="btn btn-primary" style={{ flexShrink: 0, padding: '7px 14px', fontSize: 12 }}>File Now</button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
