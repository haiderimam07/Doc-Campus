'use client';

import Link from 'next/link';
import { Bookmark, FileText, Heart, Link2, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { memo, useState } from 'react';
import { Avatar } from '@/components/doc-campus-shell';
import { Post } from '@/lib/doc-campus-api';
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

// Consider moving these two helpers to lib/format.ts so they can be unit-tested and reused.
function timeAgo(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

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
  const [saveError, setSaveError] = useState('');
  const [shareLabel, setShareLabel] = useState('Share');

  const profileHref = `/profile/${post.author.username}`;

  async function handleToggleSave() {
    if (busy) return;

    setBusy(true);
    setSaveError('');

    try {
      await onToggleSave(post.id, isSaved); // parent rolls the cache back on failure
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not update saved posts');
    } finally {
      setBusy(false);
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
      // user dismissed the share sheet, or clipboard access was denied: nothing to do
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
        {/* Disabled (not just titled) until the backend interaction routes exist */}
        <button
          type="button"
          className={actionButton}
          disabled
          title="Likes are coming soon"
        >
          <Heart size={18} aria-hidden="true" /> Like
        </button>
        <button
          type="button"
          className={actionButton}
          disabled
          title="Comments are coming soon"
        >
          <MessageCircle size={18} aria-hidden="true" /> Comment
        </button>
        <button type="button" className={actionButton} onClick={handleShare}>
          <Share2 size={18} aria-hidden="true" /> <span aria-live="polite">{shareLabel}</span>
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

      {saveError && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {saveError}
        </p>
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