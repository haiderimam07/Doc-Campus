'use client';

import { Bookmark, Upload } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/doc-campus-shell';
import { User } from '@/lib/doc-campus-api';

export function FeedProfileSummary({ user, uploadCount, savedCount }: { user: Pick<User, 'username' | 'avatarUrl'> | null; uploadCount: number; savedCount: number }) {
  return <aside className="profile-sidebar"><section className="mini-profile"><div className="profile-cover" /><div className="mini-profile-body"><Avatar username={user?.username || 'D'} src={user?.avatarUrl} large /><h2>{user?.username || 'Your profile'}</h2><p>Keep learning. Keep sharing.</p><div className="profile-stat"><span>{uploadCount}</span><small>documents shared</small></div><Link href="/profile" className="text-link">View profile <span>→</span></Link></div></section><section className="side-panel"><div className="side-heading"><span>YOUR LIBRARY</span><Bookmark size={14} /></div><Link href="/saved"><Bookmark size={16} /> Saved documents <b>{savedCount}</b></Link><Link href="/profile"><Upload size={16} /> Your uploads <b>{uploadCount}</b></Link></section></aside>;
}
