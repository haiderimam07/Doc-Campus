'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { AppShell } from '@/components/doc-campus-shell';
import { FeedProfileSummary } from '@/components/feed-profile-summary';
import { PostCard } from '@/components/post-card';
import { PostComposer } from '@/components/post-composer';
import { api, getSavedPostIds, getSummary, Post, User } from '@/lib/doc-campus-api';
import { ui } from '@/lib/ui';

type SummaryUser = Pick<User, 'id' | 'username' | 'avatarUrl' | 'bio'> & { postCount: number };
type FeedResponse = { items: Post[]; nextCursor: string | null; hasNextPage: boolean };

const PAGE_SIZE = 10;
const SWR_OPTIONS = { revalidateOnFocus: false, dedupingInterval: 30000 };

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

  const savedIds = new Set(saved.data?.items || []);
  const lastPage = feed.data?.[feed.data.length - 1];
  const hasMore = lastPage ? lastPage.hasNextPage : false;
  const isLoadingMore =
    feed.isLoading || (feed.size > 0 && feed.data !== undefined && feed.data[feed.size - 1] === undefined);

  const isInitialLoading = summary.isLoading || feed.isLoading;
  const hasError = Boolean(feed.error || summary.error);

  const uploadCount = summary.data?.postCount ?? 0;
  const savedCount = saved.data?.items.length || 0;

  function loadMore() {
    if (hasMore && !isLoadingMore) void feed.setSize(feed.size + 1);
  }

  // After posting, go back to page 1 and refetch
  function refreshFeed() {
    void feed.setSize(1);
    void feed.mutate();
    void saved.mutate();
    void summary.mutate();
  }

  return (
    <AppShell user={summary.data || undefined}>
      {/* 1 column on phones, 2 on tablets (no right rail), 3 on desktop */}
      <div className="grid grid-cols-1 items-start justify-center gap-6 min-[761px]:grid-cols-[210px_minmax(0,650px)] min-[1121px]:grid-cols-[240px_minmax(0,650px)_260px]">
        <FeedProfileSummary
          user={summary.data || null}
          uploadCount={uploadCount}
          savedCount={savedCount}
        />

        <div className="min-w-0 pb-10">
          <PostComposer onPosted={refreshFeed} />

          <FeedList
            posts={posts}
            savedIds={savedIds}
            isLoading={isInitialLoading}
            hasError={hasError}
            onRetry={refreshFeed}
          />

          {!isInitialLoading && !hasError && posts.length > 0 && (
            <LoadMore hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={loadMore} />
          )}
        </div>

        <RightRail />
      </div>
    </AppShell>
  );
}

type FeedListProps = {
  posts: Post[];
  savedIds: Set<string>;
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
};

function FeedList({ posts, savedIds, isLoading, hasError, onRetry }: FeedListProps) {
  if (hasError) {
    return (
      <div className={ui.emptyState}>
        Could not load your campus feed.{' '}
        <button className={ui.textLink} onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-3.5">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-44 animate-pulse rounded-xl border border-line bg-surface" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={ui.emptyState}>
        <Sparkles size={24} className="mx-auto" />
        <h3 className="my-2.5 text-base font-semibold text-content">Your feed starts here</h3>
        <p className="text-xs">Be the first to share a useful document with your campus.</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} initiallySaved={savedIds.has(post.id)} />
      ))}
    </>
  );
}

type LoadMoreProps = { hasMore: boolean; isLoadingMore: boolean; onLoadMore: () => void };

// Auto-loads the next page when scrolled into view; the button is a fallback.
function LoadMore({ hasMore, isLoadingMore, onLoadMore }: LoadMoreProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: '400px' } // start loading before the user reaches the bottom
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  if (!hasMore) {
    return <div className={ui.emptyState}>You're all caught up.</div>;
  }

  return (
    <div ref={sentinelRef} className="text-center">
      {isLoadingMore ? (
        <div className="h-44 animate-pulse rounded-xl border border-line bg-surface" />
      ) : (
        <button className={ui.textLink} onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}

function RightRail() {
  return (
    // desktop only, sticky under the navbar
    <aside className={`hidden min-w-0 space-y-4 min-[1121px]:block ${ui.stickyColumn}`}>
      <section className={`${ui.card} relative overflow-hidden p-5`}>
        <div className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-accent/30 blur-3xl" />

        <p className={`relative ${ui.sectionLabel}`}>Today&apos;s focus</p>
        <h3 className="relative mb-3 mt-3 text-lg font-semibold leading-snug text-content">
          Small notes compound into big understanding.
        </h3>
        <p className="relative text-xs leading-relaxed text-muted">
          Share what helped you today. Someone else is probably looking for it.
        </p>
        <div className="relative mt-5 h-0.5 w-1/3 rounded bg-accent" />
      </section>

      <section className={`${ui.card} p-4`}>
        <div className="mb-3 flex items-center justify-between">
          <span className={ui.sectionLabel}>Quick start</span>
          <Sparkles size={14} className="text-subtle" />
        </div>

        {['Upload a study resource', 'Add context for others', 'Find your next idea'].map(
          (step, index) => (
            <p key={step} className="flex gap-3 py-1.5 text-[13px] text-muted">
              <span className="text-[10px] font-semibold leading-5 text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {step}
            </p>
          )
        )}
      </section>
    </aside>
  );
}