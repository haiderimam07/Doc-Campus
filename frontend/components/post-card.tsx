'use client';

import { Bookmark, FileText, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/doc-campus-shell';
import { Post, savePost, unsavePost } from '@/lib/doc-campus-api';

function timeAgo(value: string) { const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000)); if (seconds < 60) return `${seconds}s`; if (seconds < 3600) return `${Math.floor(seconds / 60)}m`; if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`; return `${Math.floor(seconds / 86400)}d`; }

export function PostCard({ post, initiallySaved = false }: { post: Post; initiallySaved?: boolean }) {
  const [saved, setSaved] = useState(initiallySaved); const [busy, setBusy] = useState(false); const isImage = post.fileType === 'image';
  async function toggleSave() { if (busy) return; setBusy(true); const previous = saved; setSaved(!previous); try { if (previous) await unsavePost(post.id); else await savePost(post.id); } catch { setSaved(previous); } finally { setBusy(false); } }
  return <article className="post-card"><div className="post-header"><Avatar username={post.author.username} src={post.author.avatarUrl} /><div className="post-author"><strong>{post.author.username}</strong><span>shared a {post.fileType} <b>·</b> {timeAgo(post.createdAt)}</span></div><button className="icon-button quiet" aria-label="More post actions"><MoreHorizontal size={18} /></button></div>{post.description && <p className="post-copy">{post.description}</p>}<a className={`attachment ${isImage ? 'attachment-image' : ''}`} href={post.fileUrl} target="_blank" rel="noreferrer">{isImage ? <img src={post.fileUrl} alt={post.description || 'Shared document'} /> : <><span className={`file-icon ${post.fileType}`}><FileText size={24} /></span><span><strong>{post.fileType.toUpperCase()} document</strong><small>{post.ocrStatus === 'done' ? 'Text extracted and ready to read' : 'Open document'}</small></span><span className="open-file">Open ↗</span></>}</a><div className="post-actions"><button title="Like support will be available when the backend interaction route is added"><Heart size={18} /> Like</button><button title="Comment support will be available when the backend interaction route is added"><MessageCircle size={18} /> Comment</button><button><Share2 size={18} /> Share</button><button className={`save-button ${saved ? 'saved' : ''}`} onClick={toggleSave} disabled={busy}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button></div></article>;
}
