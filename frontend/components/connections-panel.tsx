'use client';

import { X } from 'lucide-react';
import useSWR from 'swr';
import { Avatar } from '@/components/doc-campus-shell';
import { ConnectionsResponse, getConnections } from '@/lib/doc-campus-api';

export function ConnectionsPanel({ username, type, onClose }: { username: string; type: 'followers' | 'following'; onClose: () => void }) {
  const { data, error, isLoading } = useSWR<ConnectionsResponse>(`/api/users/${username}/${type}`, () => getConnections(username, type), { revalidateOnFocus: false, dedupingInterval: 60000 });
  return <div className="connections-overlay" role="dialog" aria-modal="true"><section className="connections-panel"><header><div><p className="eyebrow">NETWORK</p><h2>{type === 'followers' ? 'Followers' : 'Following'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></header>{error ? <div className="empty-state">Could not load this list.</div> : isLoading ? <div className="loading-stack"><div /></div> : data?.items.length ? <div className="connection-list">{data.items.map((person) => <div className="connection-row" key={person.id}><Avatar username={person.username} src={person.avatarUrl} /><div><strong>{person.username}</strong><small>{person.bio || 'Doc-Campus member'}</small></div></div>)}</div> : <div className="empty-state">No {type} yet.</div>}</section></div>;
}
