'use client';

import { CalendarDays, FileText, Link2, MapPin, Pencil, UserPlus, UserRoundCheck } from 'lucide-react';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import useSWR from 'swr';
import { AppShell, Avatar } from '@/components/doc-campus-shell';
import { ConnectionsPanel } from '@/components/connections-panel';
import { getProfile, getSummary, api, Post, User } from '@/lib/doc-campus-api';

type Profile = User & { 
  followersCount: number; 
  followingCount: number; 
  isSelf: boolean; 
  isFollowing: boolean 
};

function ProfileContent() {
  const [panel, setPanel] = useState<'followers' | 'following' | null>(null);
  
  const summary = useSWR('/api/users/me/summary', getSummary, { 
    revalidateOnFocus: false, 
    dedupingInterval: 30000 
  });

  const profile = useSWR<Profile>(
    summary.data ? `/api/users/${summary.data.username}` : null, 
    () => getProfile(summary.data!.username), 
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000 
    }
  );

  const posts = useSWR<{ items: Post[] }>(
    summary.data ? `/api/posts/user/${summary.data.username}` : null, 
    () => api(`/api/posts/user/${summary.data!.username}?limit=20`), 
    { 
      revalidateOnFocus: false, 
      dedupingInterval: 60000 
    }
  );

  async function toggleFollow() {
    if (!profile.data) return;
    const following = profile.data.isFollowing;
    
    await api(`/api/users/${profile.data.username}/follow`, { 
      method: following ? 'DELETE' : 'POST' 
    });
    
    await profile.mutate({ 
      ...profile.data, 
      isFollowing: !following, 
      followersCount: profile.data.followersCount + (following ? -1 : 1) 
    }, false);
  }

  if (summary.isLoading || profile.isLoading) {
    return (
      <AppShell>
        <div className="loading-stack">
          <div />
          <div />
        </div>
      </AppShell>
    );
  }

  if (summary.error || profile.error || !profile.data) {
    return (
      <AppShell>
        <div className="empty-state">Could not load this profile.</div>
      </AppShell>
    );
  }

  const currentProfile = profile.data;
  const documents = posts.data?.items || [];

  return (
    <AppShell user={currentProfile}>
      <div className="profile-page">
        <section className="profile-hero">
          <div className="profile-hero-cover" />
          <div className="profile-hero-content">
            <Avatar username={currentProfile.username} src={currentProfile.avatarUrl} large />
            <div className="profile-heading">
              <p className="eyebrow">DOC-CAMPUS MEMBER</p>
              <h1>{currentProfile.username}</h1>
              <p>{currentProfile.bio || 'Building a thoughtful learning trail, one document at a time.'}</p>
              <div className="profile-meta">
                <span>
                  <CalendarDays size={14} /> Joined{' '}
                  {currentProfile.createdAt 
                    ? new Date(currentProfile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) 
                    : 'recently'}
                </span>
                <span>
                  <MapPin size={14} /> Your campus
                </span>
              </div>
            </div>

            {currentProfile.isSelf ? (
              <a className="primary-button profile-follow" href="/profile/edit">
                <Pencil size={16} /> Edit profile
              </a>
            ) : (
              <button className="primary-button profile-follow" onClick={toggleFollow}>
                {currentProfile.isFollowing ? (
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
              <strong>{currentProfile.followersCount}</strong>
              <span>Followers</span>
            </button>
            <button onClick={() => setPanel('following')}>
              <strong>{currentProfile.followingCount}</strong>
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
                <Link className="profile-post" key={post.id} href={`/feed/${post.id}`}>
                  <span className={`file-icon ${post.fileType}`}>
                    <FileText size={20} />
                  </span>
                  <span>
                    <strong>{post.description || `${post.fileType.toUpperCase()} document`}</strong>
                    <small>Shared {new Date(post.createdAt).toLocaleDateString()}</small>
                  </span>
                  <Link2 size={17} />
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={24} />
                <p>No shared documents yet.</p>
              </div>
            )}
          </section>

          <aside className="profile-note">
            <p className="eyebrow">YOUR SPACE</p>
            <h3>A profile that feels like a living notebook.</h3>
            <p>Keep your bio current and let people discover what you are learning.</p>
          </aside>
        </div>
      </div>

      {panel && (
        <ConnectionsPanel username={currentProfile.username} type={panel} onClose={() => setPanel(null)} />
      )}
    </AppShell>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="loading-stack">
          <div />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}