'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Avatar } from '@/components/doc-campus-shell';
import {
  addComment,
  Comment,
  deleteComment,
  editComment,
  getComments,
  getReplies,
  likeComment,
  unlikeComment,
} from '@/lib/doc-campus-api';
import { formatCount, timeAgo } from '@/lib/format';
import { ui } from '@/lib/ui';

/* ───────────── small helpers ───────────── */

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const patchList = (list: Comment[], id: string, patch: Partial<Comment>) =>
  list.map((c) => (c.id === id ? { ...c, ...patch } : c));

// Append `incoming` to `current`, skipping ids we already have
function mergeById(current: Comment[], incoming: Comment[]) {
  const seen = new Set(current.map((c) => c.id));
  return [...current, ...incoming.filter((c) => !seen.has(c.id))];
}

const byOldest = (a: Comment, b: Comment) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const smallAction =
  'inline-flex items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-accent disabled:opacity-60';

/* ───────────── text box used for new comments, replies and edits ───────────── */

type CommentFormProps = {
  placeholder: string;
  submitLabel?: string;
  initialValue?: string;
  autoFocus?: boolean;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
};

function CommentForm({
  placeholder,
  submitLabel = 'Post',
  initialValue = '',
  autoFocus,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const trimmed = value.trim();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed || busy) return;

    setBusy(true);
    setError('');
    try {
      await onSubmit(trimmed);
      setValue('');
    } catch (err) {
      setError(errorMessage(err, 'Could not post comment'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={2}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        className="w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-content placeholder:text-subtle focus:border-accent focus:outline-none"
      />
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-xs text-muted hover:text-content">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!trimmed || busy}
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}

/* ───────────── one comment (used for top-level comments and replies) ───────────── */

type CommentRowProps = {
  comment: Comment;
  canModerate: boolean;
  onPatch: (id: string, patch: Partial<Comment>) => void;
  onReply?: () => void;
  onDeleted: (comment: Comment) => void;
};

function CommentRow({ comment, canModerate, onPatch, onReply, onDeleted }: CommentRowProps) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const author = comment.author;

  // Deleted comment that still has replies
  if (comment.isDeleted || !author) {
    return <p className="py-2 text-xs italic text-subtle">This comment was deleted.</p>;
  }

  async function toggleLike() {
    if (busy) return;

    const wasLiked = comment.likedByMe;
    const previousCount = comment.likeCount;

    // Optimistic update, rolled back below if the request fails
    onPatch(comment.id, {
      likedByMe: !wasLiked,
      likeCount: Math.max(0, previousCount + (wasLiked ? -1 : 1)),
    });
    setBusy(true);
    setError('');

    try {
      const result = wasLiked ? await unlikeComment(comment.id) : await likeComment(comment.id);
      onPatch(comment.id, { likedByMe: result.liked, likeCount: result.likeCount });
    } catch (err) {
      onPatch(comment.id, { likedByMe: wasLiked, likeCount: previousCount });
      setError(errorMessage(err, 'Could not update like'));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (busy || !window.confirm('Delete this comment?')) return;

    setBusy(true);
    setError('');
    try {
      await deleteComment(comment.id);
      onDeleted(comment);
    } catch (err) {
      setError(errorMessage(err, 'Could not delete comment'));
      setBusy(false);
    }
  }

  async function handleEdit(body: string) {
    const updated = await editComment(comment.id, body);
    onPatch(comment.id, { body: updated.body, editedAt: updated.editedAt });
    setEditing(false);
  }

  const canDelete = comment.isMine || canModerate;

  return (
    <div className="flex gap-2.5 py-2">
      <Link href={`/profile/${author.username}`} className="shrink-0" aria-label={`View ${author.username}'s profile`}>
        <Avatar username={author.username} src={author.avatarUrl} />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="rounded-xl bg-surface-2 px-3 py-2">
          <div className="flex items-baseline gap-2">
            <Link
              href={`/profile/${author.username}`}
              className="truncate text-xs font-semibold text-content hover:underline"
            >
              {author.username}
            </Link>
            <time dateTime={comment.createdAt} suppressHydrationWarning className="text-[11px] text-subtle">
              {timeAgo(comment.createdAt)}
            </time>
            {comment.editedAt && <span className="text-[11px] text-subtle">edited</span>}
          </div>

          {editing ? (
            <div className="mt-1.5">
              <CommentForm
                placeholder="Edit your comment"
                submitLabel="Save"
                initialValue={comment.body ?? ''}
                autoFocus
                onSubmit={handleEdit}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-content">{comment.body}</p>
          )}
        </div>

        {!editing && (
          <div className="mt-1 flex items-center gap-3 px-1">
            <button
              type="button"
              className={`${smallAction} ${comment.likedByMe ? 'text-accent' : ''}`}
              onClick={toggleLike}
              aria-pressed={comment.likedByMe}
            >
              <Heart size={13} fill={comment.likedByMe ? 'currentColor' : 'none'} aria-hidden="true" />
              Like
              {comment.likeCount > 0 && <span className="tabular-nums">{formatCount(comment.likeCount)}</span>}
            </button>
            {onReply && (
              <button type="button" className={smallAction} onClick={onReply}>
                Reply
              </button>
            )}
            {comment.isMine && (
              <button type="button" className={smallAction} onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
            {canDelete && (
              <button type="button" className={smallAction} onClick={handleDelete} disabled={busy}>
                Delete
              </button>
            )}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-1 px-1 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────────── a top-level comment together with its replies ───────────── */

type ThreadProps = {
  postId: string;
  comment: Comment;
  canModerate: boolean;
  onPatch: (id: string, patch: Partial<Comment>) => void;
  onRemove: (id: string) => void;
  onCountChange: (delta: number) => void;
};

function CommentThread({ postId, comment, canModerate, onPatch, onRemove, onCountChange }: ThreadProps) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false); // first page of replies fetched
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null);

  const patchReply = useCallback(
    (id: string, patch: Partial<Comment>) => setReplies((list) => patchList(list, id, patch)),
    []
  );

  async function loadReplies() {
    if (loading) return;

    setLoading(true);
    setError('');
    try {
      const page = await getReplies(comment.id, cursor ?? undefined);
      setReplies((current) => mergeById(current, page.items).sort(byOldest));
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
      setLoaded(true);
    } catch (err) {
      setError(errorMessage(err, 'Could not load replies'));
    } finally {
      setLoading(false);
    }
  }

  async function submitReply(body: string) {
    if (!replyTarget) return;

    // Replying to a reply is allowed: the server attaches it to this top-level comment
    const created = await addComment(postId, body, replyTarget.id);

    // First reply on a comment with none: nothing else to load from the server
    if (comment.replyCount === 0) {
      setLoaded(true);
      setHasMore(false);
    }
    setReplies((current) => mergeById(current, [created]).sort(byOldest));
    onPatch(comment.id, { replyCount: comment.replyCount + 1 });
    onCountChange(1);
    setReplyTarget(null);
  }

  function handleDeleted(deleted: Comment) {
    onCountChange(-1);
    // Server keeps a placeholder when replies exist, otherwise removes the row
    if (deleted.replyCount > 0) {
      onPatch(deleted.id, { isDeleted: true, body: null, author: null, likedByMe: false, isMine: false });
    } else {
      onRemove(deleted.id);
    }
  }

  function handleReplyDeleted(reply: Comment) {
    setReplies((current) => current.filter((r) => r.id !== reply.id));
    onCountChange(-1);

    const nextCount = Math.max(0, comment.replyCount - 1);
    onPatch(comment.id, { replyCount: nextCount });
    // The server also removes a "deleted" placeholder once its last reply is gone
    if (comment.isDeleted && nextCount === 0) onRemove(comment.id);
  }

  const canReply = !comment.isDeleted;
  const remaining = comment.replyCount - replies.length;
  const showRepliesButton = comment.replyCount > 0 && (!loaded || hasMore);

  return (
    <li>
      <CommentRow
        comment={comment}
        canModerate={canModerate}
        onPatch={onPatch}
        onReply={canReply ? () => setReplyTarget(comment) : undefined}
        onDeleted={handleDeleted}
      />

      {(replies.length > 0 || showRepliesButton || replyTarget) && (
        <div className="ml-10 border-l border-line pl-3">
          {replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              canModerate={canModerate}
              onPatch={patchReply}
              onReply={canReply ? () => setReplyTarget(reply) : undefined}
              onDeleted={handleReplyDeleted}
            />
          ))}

          {showRepliesButton && (
            <button type="button" className={`${ui.textLink} py-1 text-xs`} onClick={loadReplies} disabled={loading}>
              {loading
                ? 'Loading…'
                : !loaded
                  ? `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
                  : `View more replies${remaining > 0 ? ` (${remaining})` : ''}`}
            </button>
          )}

          {error && (
            <p role="alert" className="py-1 text-xs text-danger">
              {error}
            </p>
          )}

          {replyTarget && (
            <div className="py-2">
              <CommentForm
                placeholder={`Reply to ${replyTarget.author ? `@${replyTarget.author.username}` : 'this comment'}`}
                submitLabel="Reply"
                autoFocus
                onSubmit={submitReply}
                onCancel={() => setReplyTarget(null)}
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
}

/* ───────────── the section shown under a post ───────────── */

type CommentsSectionProps = {
  postId: string;
  /** Called with +1 / -1 so the post card can keep its comment counter in step. */
  onCountChange: (delta: number) => void;
};

export function CommentsSection({ postId, onCountChange }: CommentsSectionProps) {
  const [items, setItems] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [canModerate, setCanModerate] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const page = await getComments(postId);
      setItems(page.items);
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
      setCanModerate(page.canModerate);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    setMoreError('');
    try {
      const page = await getComments(postId, cursor ?? undefined);
      setItems((current) => mergeById(current, page.items));
      setCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } catch (err) {
      setMoreError(errorMessage(err, 'Could not load more comments'));
    } finally {
      setLoadingMore(false);
    }
  }

  async function submitComment(body: string) {
    const created = await addComment(postId, body);
    setItems((current) => mergeById([created], current)); // newest first
    onCountChange(1);
  }

  const patchItem = useCallback(
    (id: string, patch: Partial<Comment>) => setItems((list) => patchList(list, id, patch)),
    []
  );
  const removeItem = useCallback((id: string) => setItems((list) => list.filter((c) => c.id !== id)), []);

  return (
    <div id={`comments-${postId}`} className="mt-3 border-t border-line pt-3">
      <CommentForm placeholder="Write a comment" onSubmit={submitComment} />

      {status === 'loading' && (
        <div className="mt-3 grid gap-2" aria-hidden="true">
          {[0, 1].map((index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-surface-2" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <p role="alert" className="mt-3 text-xs text-danger">
          Could not load comments.{' '}
          <button type="button" className={ui.textLink} onClick={() => void load()}>
            Try again
          </button>
        </p>
      )}

      {status === 'ready' && items.length === 0 && (
        <p className="mt-3 text-xs text-muted">No comments yet. Be the first to reply.</p>
      )}

      {status === 'ready' && items.length > 0 && (
        <ul className="m-0 mt-2 list-none p-0">
          {items.map((comment) => (
            <CommentThread
              key={comment.id}
              postId={postId}
              comment={comment}
              canModerate={canModerate}
              onPatch={patchItem}
              onRemove={removeItem}
              onCountChange={onCountChange}
            />
          ))}
        </ul>
      )}

      {status === 'ready' && hasMore && (
        <button type="button" className={`${ui.textLink} mt-1 text-xs`} onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading…' : 'View more comments'}
        </button>
      )}

      {moreError && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {moreError}
        </p>
      )}
    </div>
  );
}