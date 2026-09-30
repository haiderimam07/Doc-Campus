'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { AppShell } from '@/components/doc-campus-shell';
import { FeedProfileSummary } from '@/components/feed-profile-summary';
import { FeedRightRail } from '@/components/feed-right-rail';
import { PostCard } from '@/components/post-card';
import {
  getPost,
  getSavedPostIds,
  getSummary,
  Post,
  savePost,
  unsavePost,
  User,
} from '@/lib/doc-campus-api';

const GRID_LAYOUT =
  'grid grid-cols-1 items-start justify-center gap-6 ' +
  'min-[761px]:grid-cols-[210px_minmax(0,650px)] ' +
  'min-[1121px]:grid-cols-[240px_minmax(0,650px)_260px]';

const SWR_OPTIONS = { revalidateOnFocus: false, dedupingInterval: 30000 };

type SummaryUser = Pick<User, 'id' | 'username' | 'avatarUrl' | 'bio'> & { postCount: number };
type SavedResponse = { items: string[] };

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

export default function SinglePostPage() {
  const { postId } = useParams<{ postId: string }>();
  const summary = useSWR<SummaryUser>('/api/users/me/summary', getSummary, SWR_OPTIONS);
  const saved = useSWR<SavedResponse>('/api/posts/saved', getSavedPostIds, SWR_OPTIONS);
  const post = useSWR<Post>(postId ? `/api/posts/${postId}` : null, () => getPost(postId), SWR_OPTIONS);

  async function toggleSave(id: string, isSaved: boolean) {
    await saved.mutate(
      async (current) => {
        if (isSaved) await unsavePost(id);
        else await savePost(id);
        return withSaved(current, id, !isSaved);
      },
      {
        optimisticData: (current) => withSaved(current, id, !isSaved),
        rollbackOnError: true,
      }
    );
  }

  const isLoading = summary.isLoading || post.isLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-[650px] animate-pulse rounded-xl border border-line bg-surface p-4">
          <div className="h-8 w-40 rounded bg-surface-2" />
          <div className="mt-6 h-56 rounded bg-surface-2" />
        </div>
      </AppShell>
    );
  }

  if (post.error || !post.data) {
    return (
      <AppShell user={summary.data || undefined}>
        <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
          This post could not be found.
        </div>
      </AppShell>
    );
  }

  const uploadCount = summary.data?.postCount ?? 0;
  const savedIds = saved.data?.items ?? [];

  return (
    <AppShell user={summary.data || undefined}>
      <div className={GRID_LAYOUT}>
        <FeedProfileSummary
          user={summary.data || null}
          uploadCount={uploadCount}
          savedCount={savedIds.length}
        />

        <main className="min-w-0 pb-10" aria-label="Post">
          <PostCard
            post={post.data}
            isSaved={savedIds.includes(post.data.id)}
            onToggleSave={toggleSave}
          />
        </main>

        <FeedRightRail />
      </div>
    </AppShell>
  );
}
