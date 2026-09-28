'use client';

import { CalendarDays, FileText, Link2, MapPin, UserPlus, UserRoundCheck } from 'lucide-react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { AppShell, Avatar } from '@/components/doc-campus-shell';
import { ConnectionsPanel } from '@/components/connections-panel';
import { api, getProfile, getSummary, Post, User } from '@/lib/doc-campus-api';

type Profile = User & { 
  followersCount: number; 
  followingCount: number; 
  isSelf: boolean; 
  isFollowing: boolean 
};

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [panel, setPanel] = useState<'followers' | 'following' | null>(null);

  const summary = useSWR('/api/users/me/summary', getSummary, { 
    revalidateOnFocus: false, 
    dedupingInterval: 30000 
  });

  const profile = useSWR<Profile>(
    username ? `/api/users/${username}` : null, 
    () => getProfile(username), 
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000 
    }
  );

  const posts = useSWR<{ items: Post[] }>(
    username ? `/api/posts/user/${username}` : null, 
    () => api(`/api/posts/user/${username}?limit=20`), 
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000 
    }
  );

  async function toggleFollow() {
    if (!profile.data) return;
    const following = profile.data.isFollowing;
    
    await api(`/api/users/${username}/follow`, { 
      method: following ? 'DELETE' : 'POST' 
    });
    
    await profile.mutate({ 
      ...profile.data, 
      isFollowing: !following, 
      followersCount: profile.data.followersCount + (following ? -1 : 1) 
    }, false);
  }

  if (profile.isLoading || summary.isLoading) {
    return (
      <AppShell>
        <div className="loading-stack">
          <div />
          <div />
        </div>
      </AppShell>
    );
  }

  if (profile.error || !profile.data) {
    return (
      <AppShell>
        <div className="empty-state">Profile not found.</div>
      </AppShell>
    );
  }

  const current = profile.data;
  const documents = posts.data?.items || [];

  return (
    <AppShell user={summary.data || undefined}>
      <div className="profile-page">
        <section className="profile-hero">
          <div className="profile-hero-cover" />
          <div className="profile-hero-content">
            <Avatar username={current.username} src={current.avatarUrl} large />
            <div className="profile-heading">
              <p className="eyebrow">DOC-CAMPUS MEMBER</p>
              <h1>{current.username}</h1>
              <p>{current.bio || 'Building a thoughtful learning trail, one document at a time.'}</p>
              <div className="profile-meta">
                <span>
                  <CalendarDays size={14} /> Joined{' '}
                  {current.createdAt 
                    ? new Date(current.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) 
                    : 'recently'}
                </span>
                <span>
                  <MapPin size={14} /> Your campus
                </span>
              </div>
            </div>

            {current.isSelf ? null : (
              <button className="primary-button profile-follow" onClick={toggleFollow}>
                {current.isFollowing ? (
                  <>
                    <UserRoundCheck size={16} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Follow
                  </>
                )}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <button onClick={() => setPanel('followers')}>
              <strong>{current.followersCount}</strong>
              <span>Followers</span>
            </button>
            <button onClick={() => setPanel('following')}>
              <strong>{current.followingCount}</strong>
              <span>Following</span>
            </button>
            <div>
              <strong>{documents.length}</strong>
              <span>Documents</span>
            </div>
          </div>
        </section>

        <div className="profile-body">
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">SHARED RESOURCES</p>
                <h2>Document trail</h2>
              </div>
              <span>{documents.length} uploads</span>
            </div>

            {documents.length ? (
              documents.map((post) => (
                <a className="profile-post" key={post.id} href={post.fileUrl} target="_blank" rel="noreferrer">
                  <span className={`file-icon ${post.fileType}`}>
                    <FileText size={20} />
                  </span>
                  <span>
                    <strong>{post.description || `${post.fileType.toUpperCase()} document`}</strong>
                    <small>Shared {new Date(post.createdAt).toLocaleDateString()}</small>
                  </span>
                  <Link2 size={17} />
                </a>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={24} />
                <p>No shared documents yet.</p>
              </div>
            )}
          </section>

          <aside className="profile-note">
            <p className="eyebrow">DOC-CAMPUS</p>
            <h3>Learn from the people around you.</h3>
            <p>Follow useful minds and build a better learning trail.</p>
          </aside>
        </div>
      </div>

      {panel && (
        <ConnectionsPanel username={current.username} type={panel} onClose={() => setPanel(null)} />
      )}
    </AppShell>
  );
}