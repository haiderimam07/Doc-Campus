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

type SummaryUser = Pick<User, 'id' | 'username' | 'avatarUrl'> & { postCount: number };
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
      <div className="feed-layout">
        <FeedProfileSummary
          user={summary.data || null}
          uploadCount={uploadCount}
          savedCount={savedCount}
        />

        <div className="feed-main">
          <div className="page-intro">
            <div>
              <p className="eyebrow">COMMUNITY FEED</p>
              <h1>Learn out loud.</h1>
              <p>Useful notes, resources, and ideas from your campus.</p>
            </div>
          </div>

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
      <div className="empty-state">
        Could not load your campus feed.{' '}
        <button className="text-link" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-stack">
        <div />
        <div />
        <div />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <Sparkles size={24} />
        <h3>Your feed starts here</h3>
        <p>Be the first to share a useful document with your campus.</p>
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
    return <div className="empty-state">You're all caught up.</div>;
  }

  return (
    <div ref={sentinelRef}>
      {isLoadingMore ? (
        <div className="loading-stack">
          <div />
        </div>
      ) : (
        <button className="text-link" onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
}

function RightRail() {
  return (
    <aside className="right-rail">
      <section className="focus-card">
        <div className="focus-glow" />
        <p className="eyebrow">TODAY'S FOCUS</p>
        <h3>Small notes compound into big understanding.</h3>
        <p>Share what helped you today. Someone else is probably looking for it.</p>
        <div className="focus-line" />
      </section>

      <section className="right-list">
        <div className="side-heading">
          <span>QUICK START</span>
          <Sparkles size={14} />
        </div>
        <p><span>01</span> Upload a study resource</p>
        <p><span>02</span> Add context for others</p>
        <p><span>03</span> Find your next idea</p>
      </section>
    </aside>
  );
}