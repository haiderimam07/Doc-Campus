'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { AppShell } from '@/components/doc-campus-shell';
import { ProfileEditor } from '@/components/profile-editor';
import { getProfile, getSummary, User } from '@/lib/doc-campus-api';

type Profile = User & { 
  followersCount: number; 
  followingCount: number; 
  isSelf: boolean; 
  isFollowing: boolean 
};

export default function EditProfilePage() {
  const router = useRouter();
  
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

  if (summary.isLoading || profile.isLoading) {
    return (
      <AppShell>
        <div className="loading-stack">
          <div />
        </div>
      </AppShell>
    );
  }

  if (summary.error || profile.error || !profile.data) {
    return (
      <AppShell>
        <div className="empty-state">Could not load the edit profile page.</div>
      </AppShell>
    );
  }

  return (
    <AppShell user={profile.data}>
      <div className="edit-profile-page">
        <div className="page-intro">
          <div>
            <p className="eyebrow">PROFILE DETAILS</p>
            <h1>Edit profile.</h1>
            <p>Keep your Doc-Campus identity current.</p>
          </div>
        </div>
        <ProfileEditor profile={profile.data} onClose={() => router.push('/profile')} />
      </div>
    </AppShell>
  );
}