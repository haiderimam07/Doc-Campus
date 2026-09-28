'use client';

import { Bookmark, Upload } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/doc-campus-shell';
import { User } from '@/lib/doc-campus-api';
import { ui } from '@/lib/ui';

type FeedProfileSummaryProps = {
  user: Pick<User, 'username' | 'avatarUrl' | 'bio'> | null;
  uploadCount: number;
  savedCount: number;
};

const libraryLink =
  'flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-content';

export function FeedProfileSummary({ user, uploadCount, savedCount }: FeedProfileSummaryProps) {
  const username = user?.username || 'Your profile';
  const bio = user?.bio?.trim() || 'Keep learning. Keep sharing.';

  return (
    // hidden on phones, sticky on larger screens
    <aside className={`hidden min-w-0 space-y-4 min-[761px]:block ${ui.stickyColumn}`}>
      {/* Mini profile card */}
      <section className={`${ui.card} overflow-hidden`}>
        <div className="h-16 [background:var(--cover)]" />

        <div className="-mt-9 px-4 pb-4">
          <Avatar username={user?.username || 'D'} src={user?.avatarUrl} large />

          <h2 className="mt-2 text-base font-semibold text-content">{username}</h2>
          <p className="mt-1 text-[13px] leading-snug text-muted">{bio}</p>

          <div className="my-4 flex items-center justify-between border-y border-line py-3">
            <span className="text-xl font-semibold text-content">{uploadCount}</span>
            <small className="text-[11px] text-muted">documents shared</small>
          </div>

          <Link href="/profile" className={`block text-center ${ui.textLink}`}>
            View profile →
          </Link>
        </div>
      </section>

      {/* Library links */}
      <section className={`${ui.card} p-3.5`}>
        <div className="mb-2 flex items-center justify-between px-2">
          <span className={ui.sectionLabel}>Your library</span>
          <Bookmark size={14} className="text-subtle" />
        </div>

        <Link href="/saved" className={libraryLink}>
          <Bookmark size={16} /> Saved documents
          <b className="ml-auto font-medium text-content">{savedCount}</b>
        </Link>

        <Link href="/profile" className={libraryLink}>
          <Upload size={16} /> Your uploads
          <b className="ml-auto font-medium text-content">{uploadCount}</b>
        </Link>
      </section>
    </aside>
  );
}