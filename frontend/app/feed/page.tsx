'use client';

import { Sparkles } from 'lucide-react';
import useSWR from 'swr';
import { AppShell } from '@/components/doc-campus-shell';
import { FeedProfileSummary } from '@/components/feed-profile-summary';
import { PostCard } from '@/components/post-card';
import { PostComposer } from '@/components/post-composer';
import { api, getSavedPostIds, getSummary, Post, User } from '@/lib/doc-campus-api';

export default function FeedPage() {
  const summary = useSWR<Pick<User, 'id' | 'username' | 'avatarUrl'>>('/api/users/me/summary', getSummary, { revalidateOnFocus: false, dedupingInterval: 30000 });
  const feed = useSWR<{ items: Post[]; nextCursor: string | null; hasNextPage: boolean }>('/api/posts/feed?limit=10', () => api('/api/posts/feed?limit=10'), { revalidateOnFocus: false, dedupingInterval: 30000, keepPreviousData: true });
  const saved = useSWR('/api/posts/saved', getSavedPostIds, { revalidateOnFocus: false, dedupingInterval: 30000 });
  const posts = feed.data?.items || [];
  const savedIds = new Set(saved.data?.items || []);
  const loading = summary.isLoading || feed.isLoading;
  function refreshFeed() { void feed.mutate(); void saved.mutate(); }
  return <AppShell user={summary.data || undefined}><div className="feed-layout"><FeedProfileSummary user={summary.data || null} uploadCount={posts.filter((post) => post.author.id === summary.data?.id).length} savedCount={saved.data?.items.length || 0} /><div className="feed-main"><div className="page-intro"><div><p className="eyebrow">COMMUNITY FEED</p><h1>Learn out loud.</h1><p>Useful notes, resources, and ideas from your campus.</p></div></div><PostComposer onPosted={refreshFeed} />{feed.error || summary.error ? <div className="empty-state">Could not load your campus feed. <button className="text-link" onClick={refreshFeed}>Try again</button></div> : loading ? <div className="loading-stack"><div /><div /><div /></div> : posts.length ? posts.map((post) => <PostCard key={post.id} post={post} initiallySaved={savedIds.has(post.id)} />) : <div className="empty-state"><Sparkles size={24} /><h3>Your feed starts here</h3><p>Be the first to share a useful document with your campus.</p></div>}</div><aside className="right-rail"><section className="focus-card"><div className="focus-glow" /><p className="eyebrow">TODAY'S FOCUS</p><h3>Small notes compound into big understanding.</h3><p>Share what helped you today. Someone else is probably looking for it.</p><div className="focus-line" /></section><section className="right-list"><div className="side-heading"><span>QUICK START</span><Sparkles size={14} /></div><p><span>01</span> Upload a study resource</p><p><span>02</span> Add context for others</p><p><span>03</span> Find your next idea</p></section></aside></div></AppShell>;
}
