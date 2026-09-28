'use client';

import useSWR from 'swr';
import { Bookmark } from 'lucide-react';
import { AppShell } from '@/components/doc-campus-shell';
import { PostCard } from '@/components/post-card';
import { api, getSavedPostIds, Post, User } from '@/lib/doc-campus-api';

export default function SavedPage() {
  const summary = useSWR(
    '/api/users/me/summary',
    () => api<Pick<User, 'username' | 'avatarUrl'>>('/api/users/me/summary'),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const saved = useSWR(
    '/api/posts/saved',
    getSavedPostIds,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const feed = useSWR<{ items: Post[] }>(
    '/api/posts/feed?limit=50',
    () => api('/api/posts/feed?limit=50'),
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const ids = new Set(saved.data?.items || []);
  const posts = (feed.data?.items || []).filter((post) => ids.has(post.id));

  return (
    <AppShell user={summary.data}>
      <div className="saved-page">
        <div className="page-intro">
          <div>
            <p className="eyebrow">YOUR LIBRARY</p>
            <h1>Saved documents.</h1>
            <p>Resources you marked for another read.</p>
          </div>
        </div>

        {saved.error || feed.error ? (
          <div className="empty-state">Could not load saved documents.</div>
        ) : posts.length ? (
          posts.map((post) => <PostCard key={post.id} post={post} initiallySaved />)
        ) : (
          <div className="empty-state">
            <Bookmark size={24} />
            <h3>Your library is quiet</h3>
            <p>Save a document from your feed and it will appear here.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}