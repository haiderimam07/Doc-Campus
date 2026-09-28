'use client';

import Link from 'next/link';
import { Bookmark, FileText, Heart, Link2, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';
import { Avatar } from '@/components/doc-campus-shell';
import { Post, savePost, unsavePost } from '@/lib/doc-campus-api';
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
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-accent';

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

export function PostCard({ post, initiallySaved = false }: { post: Post; initiallySaved?: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isImage = post.fileType === 'image';
  const isLink = post.fileType === 'link';
  const profileHref = `/profile/${post.author.username}`;
  const iconStyle = FILE_ICON_STYLES[post.fileType] ?? FILE_ICON_STYLES.other;

  async function toggleSave() {
    if (busy) return;

    setBusy(true);
    setSaveError('');

    // Optimistic update, rolled back if the request fails
    const previous = saved;
    setSaved(!previous);

    try {
      if (previous) await unsavePost(post.id);
      else await savePost(post.id);
      await mutate('/api/posts/saved');
    } catch (error) {
      setSaved(previous);
      setSaveError(error instanceof Error ? error.message : 'Could not save post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`${ui.card} mb-4 p-4`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={profileHref} className="shrink-0">
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
            shared a {post.fileType} <b className="mx-0.5 font-normal text-subtle">·</b>{' '}
            {timeAgo(post.createdAt)}
          </span>
        </div>

        <button
          className="ml-auto grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-content"
          aria-label="More post actions"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.description && (
        <p className="mb-3.5 mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-content">
          {post.description}
        </p>
      )}

      {/* Attachment: image, website link, or document */}
      <a
        className={
          isImage
            ? 'mt-4 block overflow-hidden rounded-lg border border-line transition-colors hover:border-accent/50'
            : `${post.description ? '' : 'mt-4 '}${attachmentBase}`
        }
        href={post.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {isImage ? (
          <img
            src={post.fileUrl}
            alt={post.description || 'Shared document'}
            className="block max-h-80 w-full object-cover"
          />
        ) : isLink ? (
          <>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${iconStyle}`}>
              <Link2 size={22} />
            </span>
            <span className="grid min-w-0 gap-1">
              <strong className="truncate text-sm font-semibold text-content">
                {getHostname(post.fileUrl)}
              </strong>
              <small className="truncate text-xs text-muted">{post.fileUrl}</small>
            </span>
            <span className="ml-auto shrink-0 text-xs font-medium text-accent">Visit ↗</span>
          </>
        ) : (
          <>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${iconStyle}`}>
              <FileText size={22} />
            </span>
            <span className="grid min-w-0 gap-1">
              <strong className="truncate text-sm font-semibold text-content">
                {post.fileType.toUpperCase()} document
              </strong>
              <small className="truncate text-xs text-muted">
                {post.ocrStatus === 'done' ? 'Text extracted and ready to read' : 'Open document'}
              </small>
            </span>
            <span className="ml-auto shrink-0 text-xs font-medium text-accent">Open ↗</span>
          </>
        )}
      </a>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1 border-t border-line pt-2">
        <button
          className={actionButton}
          title="Like support will be available when the backend interaction route is added"
        >
          <Heart size={18} /> Like
        </button>
        <button
          className={actionButton}
          title="Comment support will be available when the backend interaction route is added"
        >
          <MessageCircle size={18} /> Comment
        </button>
        <button className={actionButton}>
          <Share2 size={18} /> Share
        </button>
        <button
          className={`${actionButton} ml-auto disabled:opacity-60 ${saved ? 'text-accent' : ''}`}
          onClick={toggleSave}
          disabled={busy}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {saveError && <p className="mt-2 text-xs text-danger">{saveError}</p>}
    </article>
  );
}