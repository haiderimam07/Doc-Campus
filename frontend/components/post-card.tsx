'use client';

import Link from 'next/link';
import { Bookmark, FileText, Heart, Link2, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';
import { Avatar } from '@/components/doc-campus-shell';
import { Post, savePost, unsavePost } from '@/lib/doc-campus-api';

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
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link href={profileHref} className="post-author-link">
          <Avatar username={post.author.username} src={post.author.avatarUrl} />
        </Link>

        <div className="post-author">
          <Link href={profileHref}>
            <strong>{post.author.username}</strong>
          </Link>
          <span>
            shared a {post.fileType} <b>·</b> {timeAgo(post.createdAt)}
          </span>
        </div>

        <button className="icon-button quiet" aria-label="More post actions">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.description && <p className="post-copy">{post.description}</p>}

      {/* Attachment: image, website link, or document */}
      <a
        className={`attachment ${isImage ? 'attachment-image' : ''}`}
        href={post.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {isImage ? (
          <img src={post.fileUrl} alt={post.description || 'Shared document'} />
        ) : isLink ? (
          <>
            <span className="file-icon link">
              <Link2 size={24} />
            </span>
            <span>
              <strong>{getHostname(post.fileUrl)}</strong>
              <small>{post.fileUrl}</small>
            </span>
            <span className="open-file">Visit ↗</span>
          </>
        ) : (
          <>
            <span className={`file-icon ${post.fileType}`}>
              <FileText size={24} />
            </span>
            <span>
              <strong>{post.fileType.toUpperCase()} document</strong>
              <small>{post.ocrStatus === 'done' ? 'Text extracted and ready to read' : 'Open document'}</small>
            </span>
            <span className="open-file">Open ↗</span>
          </>
        )}
      </a>

      {/* Actions */}
      <div className="post-actions">
        <button title="Like support will be available when the backend interaction route is added">
          <Heart size={18} /> Like
        </button>
        <button title="Comment support will be available when the backend interaction route is added">
          <MessageCircle size={18} /> Comment
        </button>
        <button>
          <Share2 size={18} /> Share
        </button>
        <button className={`save-button ${saved ? 'saved' : ''}`} onClick={toggleSave} disabled={busy}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {saveError && <p className="form-error save-error">{saveError}</p>}
    </article>
  );
}