'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Bookmark, ChevronDown, FileText, Home, LogOut, Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/lib/doc-campus-api';

export type ShellUser = { username: string; avatarUrl?: string | null };

type ShellProps = { user?: ShellUser; children: React.ReactNode };

function Avatar({ username, src, large = false }: { username: string; src?: string | null; large?: boolean }) {
  return src ? <img src={src} alt="" className={`avatar ${large ? 'avatar-lg' : ''}`} /> : <span className={`avatar avatar-fallback ${large ? 'avatar-lg' : ''}`}>{username.slice(0, 1).toUpperCase()}</span>;
}

function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => { const saved = localStorage.getItem('doc-campus-theme'); const nextLight = saved === 'light'; setLight(nextLight); document.documentElement.classList.toggle('light-theme', nextLight); }, []);
  function toggle() { const nextLight = !light; setLight(nextLight); document.documentElement.classList.toggle('light-theme', nextLight); localStorage.setItem('doc-campus-theme', nextLight ? 'light' : 'dark'); }
  return <button className="theme-toggle" onClick={toggle} aria-label={light ? 'Use dark theme' : 'Use light theme'}><span className={light ? 'active' : ''}><Sun size={13} /></span><span className={!light ? 'active' : ''}><Moon size={13} /></span></button>;
}

export function AppShell({ user, children }: ShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { function close(event: MouseEvent) { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false); } document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  async function signOut() { await logout(); router.push('/sign-in'); }
  return <div className="app-frame">
    <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><Menu size={20} /></button><Link href="/feed" className="brand"><span className="brand-mark">D</span><span>Doc<span>Campus</span></span></Link><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people, documents, topics..." /><kbd>⌘ K</kbd></label><nav className="top-actions"><ThemeToggle /><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="account-menu" ref={menuRef}><button className="profile-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}><Avatar username={user?.username || 'D'} src={user?.avatarUrl} /><ChevronDown size={13} /></button>{menuOpen && <div className="account-dropdown"><div className="account-heading"><Avatar username={user?.username || 'D'} src={user?.avatarUrl} /><div><strong>{user?.username || 'Doc-Campus user'}</strong><small>Learning profile</small></div></div><div className="dropdown-divider" /><Link href="/profile" onClick={() => setMenuOpen(false)}><UserRound size={16} /> My profile</Link><Link href="/profile?edit=true" onClick={() => setMenuOpen(false)}><FileText size={16} /> Edit profile</Link><Link href="/saved" onClick={() => setMenuOpen(false)}><Bookmark size={16} /> Saved documents</Link><div className="dropdown-divider" /><button onClick={signOut}><LogOut size={16} /> Sign out</button></div>}</div></nav></header>
    <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}><button onClick={() => setMenuOpen(false)}><X size={18} /></button><Link href="/feed"><Home size={16} /> Feed</Link><Link href="/profile"><UserRound size={16} /> My profile</Link><Link href="/profile?edit=true"><FileText size={16} /> Edit profile</Link><button onClick={signOut}><LogOut size={16} /> Sign out</button></div>
    <main className="shell-content"><section className="page-column">{children}</section></main>
  </div>;
}

export { Avatar };
