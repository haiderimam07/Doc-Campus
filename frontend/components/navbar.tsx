'use client';

import Link from 'next/link';
import { Bell, Bookmark, FileText, Home, LogOut, Menu, Moon, Search, Sun, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/doc-campus-api';
import { Avatar } from '@/components/avatar';
import type { ShellUser } from '@/components/doc-campus-shell';

function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => { const nextLight = localStorage.getItem('doc-campus-theme') === 'light'; setLight(nextLight); document.documentElement.classList.toggle('light-theme', nextLight); }, []);
  function toggle() { const nextLight = !light; setLight(nextLight); document.documentElement.classList.toggle('light-theme', nextLight); localStorage.setItem('doc-campus-theme', nextLight ? 'light' : 'dark'); }
  return <button className="theme-toggle" onClick={toggle} aria-label={light ? 'Use dark theme' : 'Use light theme'}><span className={light ? 'active' : ''}><Sun size={13} /></span><span className={!light ? 'active' : ''}><Moon size={13} /></span></button>;
}

export function Navbar({ user }: { user?: ShellUser }) {
  const router = useRouter(); const pathname = usePathname(); const [menuOpen, setMenuOpen] = useState(false); const [menuVisible, setMenuVisible] = useState(false); const [search, setSearch] = useState(''); const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => { function close(event: MouseEvent) { if (menuRef.current && !menuRef.current.contains(event.target as Node)) closeMenu(); } document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  async function signOut() { await logout(); router.push('/sign-in'); }
  function openMenu() { setMenuOpen(true); setMenuVisible(true); }
  function closeMenu() { setMenuOpen(false); window.setTimeout(() => setMenuVisible(false), 180); }
  function toggleMenu() { if (menuOpen) closeMenu(); else openMenu(); }
  return <header className="topbar"><div className="navbar-account" ref={menuRef}><button className="navbar-menu-button" onClick={toggleMenu} aria-label="Open account menu" aria-expanded={menuOpen}><Menu size={21} /></button>{menuVisible && <div className={`navbar-dropdown ${menuOpen ? 'is-open' : 'is-closing'}`}><div className="account-heading"><Avatar username={user?.username || 'D'} src={user?.avatarUrl} /><div><strong>{user?.username || 'Doc-Campus user'}</strong><small>Learning profile</small></div></div><div className="dropdown-divider" /><Link href="/profile" onClick={closeMenu}><UserRound size={16} /> My profile</Link><Link href="/profile/edit" onClick={closeMenu}><FileText size={16} /> Edit profile</Link><Link href="/saved" onClick={closeMenu}><Bookmark size={16} /> Saved documents</Link><div className="dropdown-divider" /><button onClick={signOut}><LogOut size={16} /> Sign out</button></div>}</div><Link href="/feed" className="brand"><span className="brand-mark">D</span><span>Doc<span>Campus</span></span></Link><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people, documents, topics..." /><kbd>⌘ K</kbd></label><nav className="top-actions"><ThemeToggle /><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><Link className={`navbar-avatar-link ${pathname === '/profile' ? 'active' : ''}`} href="/profile"><Avatar username={user?.username || 'D'} src={user?.avatarUrl} /></Link></nav><div className={`mobile-nav ${menuOpen ? 'open' : ''}`}><button onClick={closeMenu}><X size={18} /></button><Link href="/feed"><Home size={16} /> Feed</Link><Link href="/profile"><UserRound size={16} /> My profile</Link><Link href="/profile/edit"><FileText size={16} /> Edit profile</Link></div></header>;
}
