'use client';

import { Navbar } from '@/components/navbar';

export type ShellUser = { username: string; avatarUrl?: string | null };

type ShellProps = { user?: ShellUser; children: React.ReactNode };

export function AppShell({ user, children }: ShellProps) {
  return <div className="app-frame"><Navbar user={user} /><main className="shell-content"><section className="page-column">{children}</section></main></div>;
}

export { Avatar } from '@/components/avatar';
