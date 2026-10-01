'use client';

import useSWR from 'swr';
import { Bookmark, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // 1. Import motion components
import { AppShell } from '@/components/doc-campus-shell';
import { PostCard } from '@/components/post-card';
import { api, Post, User } from '@/lib/doc-campus-api';

interface SavedResponse {
  items: Post[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export default function SavedPage() {
  const summary = useSWR(
    '/api/users/me/summary',
    () => api<Pick<User, 'username' | 'avatarUrl'>>('/api/users/me/summary'),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const saved = useSWR<SavedResponse>(
    '/api/posts/saved?limit=20',
    () => api('/api/posts/saved?limit=20'),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  const isLoading = summary.isLoading || saved.isLoading;
  const hasError = summary.error || saved.error;
  const posts = saved.data?.items || [];

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

        {isLoading ? (
          <div className="empty-state">
            <Loader2 className="animate-spin" size={24} />
            <p>Loading your saved documents...</p>
          </div>
        ) : hasError ? (
          <div className="empty-state">Could not load saved documents.</div>
        ) : posts.length > 0 ? (
          // 2. Wrap the list in AnimatePresence for exit transitions
          <div className="saved-posts-container">
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout // Enables smooth sliding/re-centering when an item above/below is removed
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <PostCard 
                    post={post} 
                    isSaved={true}
                    onToggleSave={async (postId, isSaved) => {
                      // 1. Optimistically filter out the removed post instantly
                      await saved.mutate(
                        (currentData) => {
                          if (!currentData) return currentData;
                          return {
                            ...currentData,
                            items: currentData.items.filter((p) => p.id !== postId),
                          };
                        },
                        false
                      );

                      // 2. Send the DELETE request to the backend
                      await api(`/api/posts/${postId}/save`, { method: 'DELETE' });

                      // 3. Sync with backend
                      await saved.mutate();
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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