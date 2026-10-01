'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/doc-campus-api';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndRedirect() {
      try {
        const user = await api<{ username: string }>('/api/users/me/summary');
        if (user?.username) {
          router.replace(`/profile/${user.username}`);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        router.replace('/login');
      }
    }

    fetchUserAndRedirect();
  }, [router]);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={32} />
    </div>
  );
}