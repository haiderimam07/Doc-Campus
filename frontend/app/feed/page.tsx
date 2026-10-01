'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { AppShell } from '@/components/doc-campus-shell';
import { FeedProfileSummary } from '@/components/feed-profile-summary';
import { FeedRightRail } from '@/components/feed-right-rail'; // server component (no 'use client')
import { PostCard } from '@/components/post-card';
import { PostComposer } from '@/components/post-composer';
import { LazyMotion, domAnimation, m, MotionConfig } from 'framer-motion';
import {
  api,
  getSavedPostIds,
  getSummary,
  Post,
  savePost,
  unsavePost,
  User,
} from '@/lib/doc-campus-api';
import { ui } from '@/lib/ui';

type SummaryUser = Pick<User, 'id' | 'username' | 'avatarUrl' | 'bio'> & { postCount: number };
type FeedResponse = { items: Post[]; nextCursor: string | null; hasNextPage: boolean };

const PAGE_SIZE = 10;
const SWR_OPTIONS = { revalidateOnFocus: false, dedupingInterval: 30000 };

// Better: define these as named screens in tailwind config and use e.g. `tablet:` / `desktop:`.
// Kept as one constant here so the magic numbers live in a single place.
const GRID_LAYOUT =
  'grid grid-cols-1 items-start justify-center gap-6 ' +
  'min-[761px]:grid-cols-[210px_minmax(0,650px)] ' +
  'min-[1121px]:grid-cols-[240px_minmax(0,650px)_260px]';

type SavedResponse = { items: string[] };

// Pure helper: returns the saved list with one post added or removed.
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

// Builds the URL for each page. Returning null tells SWR there are no more pages.
function getFeedKey(pageIndex: number, previousPage: FeedResponse | null) {
  if (previousPage && !previousPage.hasNextPage) return null;

  const base = `/api/posts/feed?limit=${PAGE_SIZE}`;
  if (pageIndex === 0 || !previousPage?.nextCursor) return base;

  return `${base}&cursor=${encodeURIComponent(previousPage.nextCursor)}`;
}

export default function FeedPage() {
  const summary = useSWR<SummaryUser>('/api/users/me/summary', getSummary, SWR_OPTIONS);
  const saved = useSWR('/api/posts/saved', getSavedPostIds, SWR_OPTIONS);

  const feed = useSWRInfinite<FeedResponse>(getFeedKey, (url: string) => api(url), {
    ...SWR_OPTIONS,
    revalidateFirstPage: false, // don't refetch page 1 every time another page loads
  });

  // Flatten all loaded pages into one list (de-duplicated by id)
  const posts = useMemo(() => {
    const byId = new Map<string, Post>();
    feed.data?.forEach((page) => page.items.forEach((post) => byId.set(post.id, post)));
    return Array.from(byId.values());
  }, [feed.data]);

  // Stable reference so memoized children don't re-render needlessly
  const savedIds = useMemo(() => new Set(saved.data?.items || []), [saved.data]);

  const lastPage = feed.data?.[feed.data.length - 1];
  const hasMore = lastPage ? lastPage.hasNextPage : false;
  const isLoadingMore =
    feed.isLoading ||
    (feed.size > 0 && feed.data !== undefined && typeof feed.data[feed.size - 1] === 'undefined');

  // The feed depends only on feed data. Cards read `isSaved` from the SWR cache, so they
  // update on their own when `saved` arrives; the sidebar summary handles its own state.
  const isInitialLoading = feed.isLoading;
  const feedError = feed.error as Error | undefined;

  const uploadCount = summary.data?.postCount ?? 0;
  const savedCount = saved.data?.items.length || 0;

  const loadMore = useCallback(() => {
    void feed.setSize((size) => size + 1);
  }, [feed.setSize]);

  // Retry the failed request(s) without throwing away pages already loaded
  const retry = useCallback(() => {
    void feed.mutate();
  }, [feed.mutate]);

  // Optimistic save/unsave: the cache updates instantly, rolls back and rethrows on failure.
  // Stable identity (depends only on saved.mutate) so memoized cards don't re-render.
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

  // After posting, go back to page 1 and refetch it once
  const refreshFeed = useCallback(async () => {
    await feed.setSize(1);
    await feed.mutate();
    void saved.mutate();
    void summary.mutate();
  }, [feed.setSize, feed.mutate, saved.mutate, summary.mutate]);

const [isRefreshing, setIsRefreshing] = useState(false);

const handleLogoRefresh = useCallback(async () => {
  setIsRefreshing(true);
  try {
    await refreshFeed();
  } finally {
    setIsRefreshing(false);
  }
}, [refreshFeed]);

useEffect(() => {
  const onRefresh = () => void handleLogoRefresh();
  window.addEventListener('doc-campus:refresh-feed', onRefresh);
  return () => window.removeEventListener('doc-campus:refresh-feed', onRefresh);
}, [handleLogoRefresh]);

  return (
    <AppShell user={summary.data || undefined}>
      {/* 1 column on phones, 2 on tablets (no right rail), 3 on desktop */}
      <div className={GRID_LAYOUT}>
        <FeedProfileSummary
          user={summary.data || null}
          uploadCount={uploadCount}
          savedCount={savedCount}
        />

        <div className="min-w-0 pb-10">
          <PostComposer onPosted={refreshFeed} />

          <section
            aria-label="Campus feed"
            aria-busy={isInitialLoading || isLoadingMore || isRefreshing}
            className={`transition-opacity duration-200 ${isRefreshing ? 'opacity-60' : 'opacity-100'}`}
          >
            <FeedList
              posts={posts}
              savedIds={savedIds}
              isLoading={isInitialLoading}
              // Full-page error only when there is nothing to show yet
              hasBlockingError={Boolean(feedError) && posts.length === 0}
              onRetry={retry}
              onToggleSave={toggleSave}
            />

            {!isInitialLoading && posts.length > 0 && (
              <LoadMore
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                hasError={Boolean(feedError)}
                onLoadMore={loadMore}
                onRetry={retry}
              />
            )}
          </section>
        </div>

        <FeedRightRail />
      </div>
    </AppShell>
  );
}

type FeedListProps = {
  posts: Post[];
  savedIds: Set<string>;
  isLoading: boolean;
  hasBlockingError: boolean;
  onRetry: () => void;
  onToggleSave: (postId: string, isSaved: boolean) => Promise<void>;
};

function FeedList({
  posts,
  savedIds,
  isLoading,
  hasBlockingError,
  onRetry,
  onToggleSave,
}: FeedListProps) {
  if (hasBlockingError) {
    return (
      <div className={ui.emptyState} role="alert">
        Could not load your campus feed.{' '}
        <button type="button" className={ui.textLink} onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-3.5" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-44 animate-pulse rounded-xl border border-line bg-surface" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={ui.emptyState}>
        <Sparkles size={24} className="mx-auto" aria-hidden="true" />
        <h2 className="my-2.5 text-base font-semibold text-content">Your feed starts here</h2>
        <p className="text-xs">Be the first to share a useful document with your campus.</p>
      </div>
    );
  }

  return (
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation}>
      <ul className="m-0 list-none p-0">
        {posts.map((post) => (
          <m.li
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <PostCard post={post} isSaved={savedIds.has(post.id)} onToggleSave={onToggleSave} />
          </m.li>
        ))}
      </ul>
    </LazyMotion>
  </MotionConfig>
);
}

type LoadMoreProps = {
  hasMore: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
};

// Auto-loads the next page when scrolled into view; the button is a fallback.
function LoadMore({ hasMore, isLoadingMore, hasError, onLoadMore, onRetry }: LoadMoreProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep the latest callback in a ref so the observer never needs to be rebuilt just
  // because the parent re-rendered.
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    // Don't observe while loading or after a failure (avoids an infinite retry loop).
    if (!node || !hasMore || isLoadingMore || hasError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current();
      },
      { rootMargin: '400px' } // start loading before the user reaches the bottom
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Re-observing after each load finishes means that if the sentinel is still in view
    // (short pages, tall screens) the next page is requested right away.
  }, [hasMore, isLoadingMore, hasError]);

  if (hasError) {
    return (
      <div className={ui.emptyState} role="alert">
        Couldn&apos;t load more posts.{' '}
        <button type="button" className={ui.textLink} onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!hasMore) {
    return <div className={ui.emptyState}>You&apos;re all caught up.</div>;
  }

  return (
    <div ref={sentinelRef} className="text-center" aria-live="polite">
      {isLoadingMore ? (
        <div className="h-44 animate-pulse rounded-xl border border-line bg-surface" />
      ) : (
        <button type="button" className={ui.textLink} onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}