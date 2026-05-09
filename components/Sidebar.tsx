'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { apiLogout, getStoredUser } from '@/lib/apiClient';
import { useTheme } from './ThemeProvider';
import {
  LayoutDashboard, Bot, ClipboardList, Calendar, Landmark,
  FolderOpen, Bell, Settings, HelpCircle, User, LogOut,
  Building2, ChevronRight, Menu, X, Sun, Moon, CreditCard
} from 'lucide-react';

const NAV = [
  { href: '/dashboard',                    icon: LayoutDashboard, label: 'Dashboard',    accent: '#818cf8' },
  { href: '/dashboard/ai-assistant',       icon: Bot,             label: 'AI Assistant', accent: '#a78bfa' },
  { href: '/dashboard/compliance-tracker', icon: ClipboardList,   label: 'Compliance',   accent: '#22d3ee' },
  { href: '/dashboard/deadlines',          icon: Calendar,        label: 'Deadlines',    accent: '#fbbf24' },
  { href: '/dashboard/government-schemes', icon: Landmark,        label: 'Gov. Schemes', accent: '#34d399' },
  { href: '/dashboard/documents',          icon: FolderOpen,      label: 'Documents',    accent: '#60a5fa' },
  { href: '/dashboard/notifications',      icon: Bell,            label: 'Alerts',       accent: '#f472b6' },
];

const ACCOUNT = [
  { href: '/plan',                icon: CreditCard, label: 'Subscription' },
  { href: '/dashboard/settings', icon: Settings,   label: 'Settings' },
  { href: '/dashboard/help',     icon: HelpCircle, label: 'Help' },
  { href: '/dashboard/profile',  icon: User,       label: 'Profile' },
];

export default function Sidebar({ businessName }: { businessName?: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();

  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName,   setUserName]   = useState('');

  useEffect(() => {
    const u = getStoredUser();
    if (u?.name) setUserName(u.name);
  }, []);


  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const logout = () => { apiLogout(); router.push('/login'); };

  function NavContent({ onNav }: { onNav?: () => void }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* ── Brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px 16px', minHeight: 64 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Building2 size={16} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--text1)', lineHeight: 1.2 }}>
                CompliEase
              </p>
              {businessName && (
                <p style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {businessName}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="divider" style={{ margin: '0 12px' }} />

        {/* ── Main Nav ── */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          {!collapsed && (
            <p className="section-label" style={{ padding: '0 8px', marginBottom: 8 }}>Main Menu</p>
          )}
          {NAV.map(({ href, icon: Icon, label, accent }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} onClick={onNav}
                title={collapsed ? label : undefined}
                className={`nav-link ${active ? 'active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
                <Icon size={17} style={{ flexShrink: 0, color: active ? accent : undefined }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{label}</span>
                    {active && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                    )}
                  </>
                )}
              </Link>
            );
          })}

          <div className="divider" style={{ margin: '10px 4px' }} />
          {!collapsed && (
            <p className="section-label" style={{ padding: '0 8px', marginBottom: 8, marginTop: 10 }}>Account</p>
          )}
          {ACCOUNT.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} onClick={onNav}
              title={collapsed ? label : undefined}
              className={`nav-link ${isActive(href) ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <Icon size={16} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* ── Bottom: Theme + User + Logout ── */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
          {/* Theme toggle */}
          <button onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '9px 12px', borderRadius: 10,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--text2)', fontSize: 13.5, fontWeight: 500,
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'background 0.15s',
              marginBottom: 4,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg3)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
            {theme === 'dark'
              ? <Sun size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
              : <Moon size={16} style={{ color: '#818cf8', flexShrink: 0 }} />}
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* User card */}
          {!collapsed ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10, background: 'var(--bg3)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg,#5b5ef4,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 700,
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userName || 'User'}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text3)' }}>Business Owner</p>
              </div>
              <button onClick={logout} title="Logout"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, color: 'var(--text3)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text3)'; }}>
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', padding: '9px', borderRadius: 10,
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text3)'; }}>
              <LogOut size={15} />
            </button>
          )}
        </div>

        {/* ── Collapse toggle (desktop only) ── */}
        <button onClick={() => setCollapsed(c => !c)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px', borderTop: '1px solid var(--border)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)',
            transition: 'color 0.15s',
          }}
          className="hidden-mobile"
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text3)'; }}>
          <ChevronRight size={14} style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button onClick={() => setMobileOpen(o => !o)}
        style={{
          display: 'none', position: 'fixed', top: 14, left: 14, zIndex: 60,
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--sidebar)', border: '1px solid var(--border)',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text1)',
        }}
        className="mobile-menu-btn">
        {mobileOpen ? <X size={17} /> : <Menu size={17} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          }} />
      )}

      {/* Mobile drawer */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 230, zIndex: 55,
        background: 'var(--sidebar)', borderRight: '1px solid var(--border)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }} className="mobile-sidebar">
        <NavContent onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-wide'}`}
        style={{ display: 'flex' } as React.CSSProperties}>
        <NavContent />
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          .sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .mobile-sidebar { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
        .hidden-mobile { display: none; }
      `}</style>
    </>
  );
}
