'use client';

import { CalendarDays, FileText, MapPin, UserPlus, UserRoundCheck, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { LazyMotion, domAnimation, m, MotionConfig } from 'framer-motion';
import { AppShell, Avatar } from '@/components/doc-campus-shell';
import { ConnectionsPanel } from '@/components/connections-panel';
import { PostCard } from '@/components/post-card';
import {
  api,
  getProfile,
  getSavedPostIds,
  getSummary,
  Post,
  savePost,
  unsavePost,
  User,
} from '@/lib/doc-campus-api';

type Profile = User & {
  followersCount: number;
  followingCount: number;
  isSelf: boolean;
  isFollowing: boolean;
};

type PostsResponse = { items: Post[]; nextCursor: string | null; hasNextPage: boolean };
type SavedResponse = { items: string[] };

const PAGE_SIZE = 20;
const SWR_OPTIONS = { revalidateOnFocus: false, dedupingInterval: 60000 };

// Pure helper: returns the saved list with one post added or removed.
// (Same helper as the feed page - worth moving to lib/ so both share it.)
function withSaved(current: SavedResponse | undefined, postId: string, shouldSave: boolean) {
  const items = current?.items ?? [];
  return {
    ...current,
    items: shouldSave
      ? items.includes(postId)
        ? items
        : [...items, postId]
      : items.filter((id) => id !== postId),
  };
}

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [panel, setPanel] = useState<'followers' | 'following' | null>(null);
  const [isFollowPending, setIsFollowPending] = useState(false);

  // --- Data: all three requests start in parallel and none blocks the others ---
  const summary = useSWR('/api/users/me/summary', getSummary, SWR_OPTIONS);
  const saved = useSWR<SavedResponse>('/api/posts/saved', getSavedPostIds, SWR_OPTIONS);

  const profileKey = username ? `/api/users/${username}` : null;
  const profile = useSWR<Profile>(profileKey, () => getProfile(username), SWR_OPTIONS);

  const getPostsKey = useCallback(
    (pageIndex: number, previous: PostsResponse | null) => {
      if (!username) return null;
      if (previous && !previous.hasNextPage) return null;
      const base = `/api/posts/user/${username}?limit=${PAGE_SIZE}`;
      if (pageIndex === 0 || !previous?.nextCursor) return base;
      return `${base}&cursor=${encodeURIComponent(previous.nextCursor)}`;
    },
    [username]
  );

  const postsQuery = useSWRInfinite<PostsResponse>(getPostsKey, (url: string) => api(url), {
    ...SWR_OPTIONS,
    revalidateFirstPage: false, // don't refetch page 1 whenever another page loads
  });

  // --- Derived state ---
  const posts = useMemo(() => {
    const byId = new Map<string, Post>();
    postsQuery.data?.forEach((page) => page.items.forEach((post) => byId.set(post.id, post)));
    return Array.from(byId.values());
  }, [postsQuery.data]);

  const savedIds = useMemo(() => new Set(saved.data?.items ?? []), [saved.data]);

  const lastPage = postsQuery.data?.[postsQuery.data.length - 1];
  const hasMore = lastPage ? lastPage.hasNextPage : false;
  const isInitialLoading = postsQuery.isLoading;
  const isLoadingMore =
    postsQuery.size > 0 &&
    postsQuery.data !== undefined &&
    typeof postsQuery.data[postsQuery.size - 1] === 'undefined';

  const joined = useMemo(() => {
    const createdAt = profile.data?.createdAt;
    return createdAt
      ? new Date(createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : 'recently';
  }, [profile.data?.createdAt]);

  // --- Actions (all hooks stay above the early returns) ---
  const loadMorePosts = useCallback(() => {
    void postsQuery.setSize((size) => size + 1);
  }, [postsQuery.setSize]);

  // Optimistic follow: UI updates instantly, rolls back if the request fails
  const toggleFollow = useCallback(async () => {
    const current = profile.data;
    if (!current || isFollowPending) return;

    const following = current.isFollowing;
    const optimistic: Profile = {
      ...current,
      isFollowing: !following,
      followersCount: current.followersCount + (following ? -1 : 1),
    };

    setIsFollowPending(true);
    try {
      await profile.mutate(
        async () => {
          await api(`/api/users/${username}/follow`, { method: following ? 'DELETE' : 'POST' });
          return optimistic;
        },
        { optimisticData: optimistic, rollbackOnError: true, revalidate: false }
      );
    } catch (err) {
      console.error('Failed to update follow state', err);
    } finally {
      setIsFollowPending(false);
    }
  }, [profile.data, profile.mutate, isFollowPending, username]);

  // Optimistic save/unsave through the shared saved-ids cache, so the feed,
  // saved page and this page always agree. Stable identity for memoized cards.
  const toggleSave = useCallback(
    async (postId: string, isSaved: boolean) => {
      await saved.mutate(
        async (current) => {
          if (isSaved) await unsavePost(postId);
          else await savePost(postId);
          return withSaved(current, postId, !isSaved);
        },
        {
          optimisticData: (current) => withSaved(current, postId, !isSaved),
          rollbackOnError: true,
        }
      );
    },
    [saved.mutate]
  );

  // --- Render: only the profile itself blocks the page. Summary only feeds the shell. ---
  if (profile.error || (!profile.isLoading && !profile.data)) {
    return (
      <AppShell user={summary.data || undefined}>
        <div className="empty-state">Profile not found.</div>
      </AppShell>
    );
  }

  const current = profile.data;
  const closePanel = useCallback(() => setPanel(null), []);

  return (
    <AppShell user={summary.data || undefined}>
      <div className="profile-page">
        {current ? (
          <section className="profile-hero">
            <div className="profile-hero-cover" />
            <div className="profile-hero-content">
              <Avatar username={current.username} src={current.avatarUrl} large />
              <div className="profile-heading">
                <p className="eyebrow">DOC-CAMPUS MEMBER</p>
                <h1>{current.username}</h1>
                <p>{current.bio || 'Building a thoughtful learning trail, one document at a time.'}</p>
                <div className="profile-meta">
                  <span>
                    <CalendarDays size={14} /> Joined {joined}
                  </span>
                  <span>
                    <MapPin size={14} /> Your campus
                  </span>
                </div>
              </div>

              {current.isSelf ? null : (
                <button
                  className="primary-button profile-follow"
                  onClick={toggleFollow}
                  disabled={isFollowPending}
                >
                  {current.isFollowing ? (
                    <>
                      <UserRoundCheck size={16} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Follow
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="profile-stats">
              <button onClick={() => setPanel('followers')}>
                <strong>{current.followersCount}</strong>
                <span>Followers</span>
              </button>
              <button onClick={() => setPanel('following')}>
                <strong>{current.followingCount}</strong>
                <span>Following</span>
              </button>
              <div>
                {/* Only loaded posts are counted; show "20+" while more pages exist */}
                <strong>{hasMore ? `${posts.length}+` : posts.length}</strong>
                <span>Documents</span>
              </div>
            </div>
          </section>
        ) : (
          // Skeleton keeps the layout stable instead of replacing the whole page with a spinner
          <div
            className="h-64 animate-pulse rounded-xl border border-line bg-surface"
            aria-hidden="true"
          />
        )}

        <div className="profile-body">
          <section aria-label="Document trail" aria-busy={isInitialLoading || isLoadingMore}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">SHARED RESOURCES</p>
                <h2>Document trail</h2>
              </div>
              <span>
                {hasMore ? `${posts.length}+` : posts.length} uploads
              </span>
            </div>

            {postsQuery.error && posts.length === 0 ? (
              <div className="empty-state" role="alert">
                Could not load documents.{' '}
                <button type="button" onClick={() => void postsQuery.mutate()}>
                  Try again
                </button>
              </div>
            ) : isInitialLoading ? (
              <div className="grid gap-3.5" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-44 animate-pulse rounded-xl border border-line bg-surface"
                  />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="profile-posts-container">
                {/* LazyMotion loads only the DOM animation features; reducedMotion respects OS settings */}
                <MotionConfig reducedMotion="user">
                  <LazyMotion features={domAnimation}>
                    {posts.map((post) => (
                      // No `layout` prop: measuring every card on each change gets
                      // expensive in long lists. Stable keys mean only NEW posts animate in.
                      <m.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <PostCard
                          post={post}
                          isSaved={savedIds.has(post.id)}
                          onToggleSave={toggleSave}
                        />
                      </m.div>
                    ))}
                  </LazyMotion>
                </MotionConfig>

                {hasMore && (
                  <div
                    className="load-more-container"
                    style={{ textAlign: 'center', marginTop: '1.5rem' }}
                  >
                    <button
                      className="secondary-button"
                      onClick={loadMorePosts}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        'Load more documents'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={24} />
                <p>No shared documents yet.</p>
              </div>
            )}
          </section>

          <aside className="profile-note">
            <p className="eyebrow">DOC-CAMPUS</p>
            <h3>Learn from the people around you.</h3>
            <p>Follow useful minds and build a better learning trail.</p>
          </aside>
        </div>
      </div>

      {panel && current && (
        <ConnectionsPanel
          username={current.username}
          type={panel}
          followersCount={current.followersCount}
          followingCount={current.followingCount}
          onClose={closePanel}
        />
      )}
    </AppShell>
  );
}