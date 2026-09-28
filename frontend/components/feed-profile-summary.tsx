'use client';

import { Bookmark, Upload } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/doc-campus-shell';
import { User } from '@/lib/doc-campus-api';

type FeedProfileSummaryProps = {
  user: Pick<User, 'username' | 'avatarUrl' | 'bio'> | null;
  uploadCount: number;
  savedCount: number;
};

export function FeedProfileSummary({ user, uploadCount, savedCount }: FeedProfileSummaryProps) {
  const username = user?.username || 'Your profile';
  const bio = user?.bio?.trim() || 'Keep learning. Keep sharing.';

  return (
    <aside className="profile-sidebar">
      {/* Mini profile card */}
      <section className="mini-profile">
        <div className="profile-cover" />

        <div className="mini-profile-body">
          <Avatar username={user?.username || 'D'} src={user?.avatarUrl} large />

          <h2>{username}</h2>
          <p>{bio}</p>

          <div className="profile-stat">
            <span>{uploadCount}</span>
            <small>documents shared</small>
          </div>

          <Link href="/profile" className="text-link">
            View profile <span>→</span>
          </Link>
        </div>
      </section>

      {/* Library links */}
      <section className="side-panel">
        <div className="side-heading">
          <span>YOUR LIBRARY</span>
          <Bookmark size={14} />
        </div>

        <Link href="/saved">
          <Bookmark size={16} /> Saved documents <b>{savedCount}</b>
        </Link>

        <Link href="/profile">
          <Upload size={16} /> Your uploads <b>{uploadCount}</b>
        </Link>
      </section>
    </aside>
  );
}