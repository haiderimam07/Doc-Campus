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

  useEffect(() => {
    const nextLight = localStorage.getItem('doc-campus-theme') === 'light';
    setLight(nextLight);
    document.documentElement.classList.toggle('light-theme', nextLight);
  }, []);

  function toggle() {
    const nextLight = !light;
    setLight(nextLight);
    document.documentElement.classList.toggle('light-theme', nextLight);
    localStorage.setItem('doc-campus-theme', nextLight ? 'light' : 'dark');
  }

  return (
    <button
      onClick={toggle}
      aria-label={light ? 'Use dark theme' : 'Use light theme'}
      className="flex items-center bg-[#1a1d26] border border-[#2d3139] rounded-full p-1 w-14 h-8 transition-colors relative cursor-pointer"
    >
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
          light ? 'bg-blue-600 text-white translate-x-6' : 'text-gray-400'
        }`}
      >
        <Sun size={13} />
      </span>
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 absolute left-1 ${
          !light ? 'bg-blue-600 text-white translate-x-0' : 'text-gray-400'
        }`}
      >
        <Moon size={13} />
      </span>
    </button>
  );
}

export function Navbar({ user }: { user?: ShellUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function close(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  async function signOut() {
    await logout();
    router.push('/sign-in');
  }

  function openMenu() {
    setMenuOpen(true);
    setMenuVisible(true);
  }

  function closeMenu() {
    setMenuOpen(false);
    window.setTimeout(() => setMenuVisible(false), 180);
  }

  function toggleMenu() {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  return (
    <header className="h-[72px] px-[34px] flex items-center gap-[34px] border-b border-[var(--line)] bg-[#0c0e13e6] backdrop-blur-[18px] sticky top-0 z-10 text-[var(--text)]">
      {/* Left Section: Account Menu & Brand */}
      <div className="flex items-center gap-[14px] relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          aria-label="Open account menu"
          aria-expanded={menuOpen}
          className="w-[34px] h-[34px] inline-grid place-items-center bg-transparent border border-transparent text-[var(--muted)] rounded-[8px] hover:text-[var(--text)] hover:bg-[var(--panel-2)] hover:border-[var(--line)] transition-colors cursor-pointer"
        >
          <Menu size={21} />
        </button>

        {/* Dropdown Menu */}
        {menuVisible && (
          <div
            className={`absolute top-[48px] left-0 w-[260px] bg-[var(--panel)] border border-[var(--line)] rounded-xl shadow-2xl py-2 z-50 transition-all duration-180 ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar username={user?.username || 'D'} src={user?.avatarUrl} />
              <div className="overflow-hidden">
                <strong className="block text-sm text-[var(--text)] truncate">{user?.username || 'Doc-Campus user'}</strong>
                <small className="text-xs text-[var(--muted)]">Learning profile</small>
              </div>
            </div>

            <div className="h-px bg-[var(--line)] my-1" />

            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors"
            >
              <UserRound size={16} /> My profile
            </Link>
            <Link
              href="/profile/edit"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors"
            >
              <FileText size={16} /> Edit profile
            </Link>
            <Link
              href="/saved"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-2)] transition-colors"
            >
              <Bookmark size={16} /> Saved documents
            </Link>

            <div className="h-px bg-[var(--line)] my-1" />

            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[var(--panel-2)] transition-colors text-left cursor-pointer"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}

        <Link
          href="/feed"
          className="inline-flex items-center gap-[10px] font-bold text-[20px] font-serif tracking-[-0.6px] whitespace-nowrap text-[var(--text)]"
        >
          <span className="w-[28px] h-[28px] grid place-items-center border border-[var(--blue)] rounded-[8px_8px_8px_2px] text-[var(--blue)] text-[16px]">
            D
          </span>
          <span>
            Doc<span className="text-[var(--blue)]">Campus</span>
          </span>
        </Link>
      </div>

      {/* Center Search Box */}
      <label className="max-w-[555px] flex-1 flex items-center gap-[10px] h-[40px] px-[13px] bg-[#1c1f28] border border-[#282c37] rounded-[9px] text-[var(--muted)] focus-within:border-[var(--blue)] transition-colors">
        <Search size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search squads, people, interview experiences, posts..."
          className="w-full border-0 outline-0 bg-transparent text-[var(--text)] text-[13px] font-serif placeholder:text-[var(--muted)]"
        />
        <kbd className="text-[#656c7b] text-[11px] font-serif border border-[#343846] px-[6px] py-[3px] rounded-[4px] whitespace-nowrap">
          ⌘ K
        </kbd>
      </label>

      {/* Right-side Actions (Theme Toggle, Notifications, Avatar) */}
      <div className="flex items-center gap-[14px] ml-auto">
        <ThemeToggle />

        <button
          className="w-[34px] h-[34px] inline-grid place-items-center bg-transparent border border-transparent text-[var(--muted)] rounded-[8px] hover:text-[var(--text)] hover:bg-[var(--panel-2)] hover:border-[var(--line)] transition-colors relative cursor-pointer"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i className="w-[5px] h-[5px] absolute top-[7px] right-[7px] bg-[var(--blue)] rounded-full not-italic" />
        </button>

        <Link
          className={`p-0 border-0 bg-transparent rounded-full transition-all ${
            pathname === '/profile' ? 'ring-2 ring-[var(--blue)]' : ''
          }`}
          href="/profile"
        >
          <Avatar username={user?.username || 'D'} src={user?.avatarUrl} />
        </Link>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-[var(--panel)] border-r border-[var(--line)] p-6 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-lg text-[var(--text)]">Menu</span>
          <button
            onClick={closeMenu}
            className="w-[34px] h-[34px] inline-grid place-items-center bg-transparent border border-[var(--line)] text-[var(--muted)] rounded-[8px] hover:text-[var(--text)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="/feed"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)] transition-colors"
          >
            <Home size={16} /> Feed
          </Link>
          <Link
            href="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)] transition-colors"
          >
            <UserRound size={16} /> My profile
          </Link>
          <Link
            href="/profile/edit"
            onClick={closeMenu}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--muted)] hover:bg-[var(--panel-2)] hover:text-[var(--text)] transition-colors"
          >
            <FileText size={16} /> Edit profile
          </Link>
        </nav>
      </div>
    </header>
  );
}