'use client';

import Link from 'next/link';
import { Bookmark, FileText, Heart, Link2, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { CommentsSection } from '@/components/comments-sections';
import { Avatar } from '@/components/doc-campus-shell';
import { likePost, Post, sharePost, unlikePost } from '@/lib/doc-campus-api';
import { formatCount, timeAgo } from '@/lib/format';
import { ui } from '@/lib/ui';

// Icon box colors per file type
const FILE_ICON_STYLES: Record<string, string> = {
  pdf: 'bg-red-500/15 text-red-400',
  doc: 'bg-accent-soft text-accent',
  other: 'bg-amber-500/15 text-amber-400',
  link: 'bg-teal-500/15 text-teal-400',
};

const attachmentBase =
  'flex min-h-[76px] items-center gap-3.5 rounded-lg border border-line bg-surface-2 p-3.5 transition-colors hover:border-accent/50';

const actionButton =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60';

// "https://www.example.com/a/b" -> "example.com"
function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// "a pdf", "an image"
function withArticle(noun: string) {
  return `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`;
}

type PostCardProps = {
  post: Post;
  /** Source of truth lives in the parent's SWR cache, not in this component. */
  isSaved: boolean;
  /** Should update the cache optimistically and throw if the request fails. */
  onToggleSave: (postId: string, isSaved: boolean) => Promise<void>;
};

export const PostCard = memo(function PostCard({ post, isSaved, onToggleSave }: PostCardProps) {
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [shareLabel, setShareLabel] = useState('Share');

  // Like / comment / share state lives here. It starts from the feed data and is then updated
  // by the server responses, so the feed list itself never has to re-render for a like.
  const [liked, setLiked] = useState(post.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);
  const [shareCount, setShareCount] = useState(post.shareCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const likeBusy = useRef(false); // ignore clicks while a like request is in flight

  const profileHref = `/profile/${post.author.username}`;

  async function handleToggleSave() {
    if (busy) return;

    setBusy(true);
    setActionError('');

    try {
      await onToggleSave(post.id, isSaved); // parent rolls the cache back on failure
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not update saved posts');
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleLike() {
    if (likeBusy.current) return;
    likeBusy.current = true;

    const wasLiked = liked;
    const previousCount = likeCount;

    // Optimistic update, rolled back if the request fails
    setLiked(!wasLiked);
    setLikeCount(Math.max(0, previousCount + (wasLiked ? -1 : 1)));
    setActionError('');

    try {
      const result = wasLiked ? await unlikePost(post.id) : await likePost(post.id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      setLiked(wasLiked);
      setLikeCount(previousCount);
      setActionError(error instanceof Error ? error.message : 'Could not update like');
    } finally {
      likeBusy.current = false;
    }
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ url: post.fileUrl });
      } else {
        await navigator.clipboard.writeText(post.fileUrl);
        setShareLabel('Link copied');
        setTimeout(() => setShareLabel('Share'), 2000);
      }
    } catch {
      // user dismissed the share sheet, or clipboard access was denied: don't count it
      return;
    }

    // Only a completed share is recorded. A failure here shouldn't bother the user.
    try {
      const result = await sharePost(post.id);
      setShareCount(result.shareCount);
    } catch {
      // ignore
    }
  }

  return (
    <article className={`${ui.card} mb-4 p-4`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={profileHref}
          className="shrink-0"
          aria-label={`View ${post.author.username}'s profile`}
        >
          <Avatar username={post.author.username} src={post.author.avatarUrl} />
        </Link>

        <div className="grid min-w-0 gap-0.5">
          <Link
            href={profileHref}
            className="truncate text-sm font-semibold text-content hover:underline"
          >
            {post.author.username}
          </Link>
          <span className="text-xs text-muted">
            shared {withArticle(post.fileType)} <b className="mx-0.5 font-normal text-subtle">·</b>{' '}
            {/* server and client clocks differ, so the text can mismatch on hydration */}
            <time dateTime={post.createdAt} suppressHydrationWarning>
              {timeAgo(post.createdAt)}
            </time>
          </span>
        </div>

        <button
          type="button"
          className="ml-auto grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-content"
          aria-label="More post actions"
        >
          <MoreHorizontal size={18} aria-hidden="true" />
        </button>
      </div>

      {post.description && (
        <p className="mb-3.5 mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-content">
          {post.description}
        </p>
      )}

      <Attachment post={post} />

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1 border-t border-line pt-2">
        <button
          type="button"
          className={`${actionButton} ${liked ? 'text-accent' : ''}`}
          onClick={handleToggleLike}
          aria-pressed={liked}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
          <span className="tabular-nums">{formatCount(likeCount)}</span>
        </button>
        <button
          type="button"
          className={`${actionButton} ${showComments ? 'text-accent' : ''}`}
          onClick={() => setShowComments((open) => !open)}
          aria-expanded={showComments}
          aria-controls={`comments-${post.id}`}
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span className="tabular-nums">{formatCount(commentCount)}</span>
        </button>
        <button type="button" className={actionButton} onClick={handleShare}>
          <Share2 size={18} aria-hidden="true" /> <span aria-live="polite">{shareLabel}</span>
          {shareCount > 0 && <span className="tabular-nums">{formatCount(shareCount)}</span>}
        </button>
        <button
          type="button"
          className={`${actionButton} ml-auto ${isSaved ? 'text-accent' : ''}`}
          onClick={handleToggleSave}
          disabled={busy}
          aria-pressed={isSaved}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />{' '}
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>

      {actionError && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {actionError}
        </p>
      )}

      {showComments && (
        <CommentsSection
          postId={post.id}
          onCountChange={(delta) => setCommentCount((count) => Math.max(0, count + delta))}
        />
      )}
    </article>
  );
});

// Attachment: image, website link, or document (replaces the nested ternary)
function Attachment({ post }: { post: Post }) {
  const iconStyle = FILE_ICON_STYLES[post.fileType] ?? FILE_ICON_STYLES.other;

  if (post.fileType === 'image') {
    return (
      <a
        className="mt-4 block overflow-hidden rounded-lg border border-line transition-colors hover:border-accent/50"
        href={post.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Swap for next/image once your image domains are configured, and give it width/height
            (or an aspect-ratio box) so the layout doesn't jump when the image loads. */}
        <img
          src={post.fileUrl}
          alt={post.description || 'Shared document'}
          loading="lazy"
          decoding="async"
          className="block max-h-80 w-full object-cover"
        />
      </a>
    );
  }

  const isLink = post.fileType === 'link';
  const Icon = isLink ? Link2 : FileText;
  const title = isLink ? getHostname(post.fileUrl) : `${post.fileType.toUpperCase()} document`;
  const subtitle = isLink
    ? post.fileUrl
    : post.ocrStatus === 'done'
      ? 'Text extracted and ready to read'
      : 'Open document';

  return (
    <a
      className={`${post.description ? '' : 'mt-4 '}${attachmentBase}`}
      href={post.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${iconStyle}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className="grid min-w-0 gap-1">
        <strong className="truncate text-sm font-semibold text-content">{title}</strong>
        <small className="truncate text-xs text-muted">{subtitle}</small>
      </span>
      <span className="ml-auto shrink-0 text-xs font-medium text-accent">
        {isLink ? 'Visit' : 'Open'} ↗
      </span>
    </a>
  );
}