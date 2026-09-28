'use client';

import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import { Avatar } from '@/components/doc-campus-shell';
import { getSummary, updateProfile, User } from '@/lib/doc-campus-api';

export function ProfileEditor({ profile, onClose }: { profile: User; onClose: () => void }) {
  const summary = useSWR('/api/users/me/summary', getSummary); const [bio, setBio] = useState(profile.bio || ''); const [avatar, setAvatar] = useState<File | undefined>(); const [removeAvatar, setRemoveAvatar] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const inputRef = useRef<HTMLInputElement>(null);
  async function submit(event: React.FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { await updateProfile({ bio, avatar, removeAvatar }); await summary.mutate(); onClose(); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not update profile'); } finally { setBusy(false); } }
  return <div className="profile-editor"><div className="editor-avatar"><Avatar username={profile.username} src={profile.avatarUrl} large /><div><strong>Profile picture</strong><small>JPG, PNG, or WebP</small><div className="editor-actions"><button type="button" className="primary-button" onClick={() => inputRef.current?.click()}><ImagePlus size={15} /> Change photo</button><button type="button" className="secondary-button" onClick={() => setRemoveAvatar(true)}><Trash2 size={14} /> Remove</button><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => setAvatar(event.target.files?.[0])} /></div></div></div><form onSubmit={submit}><label>Username<input value={profile.username} disabled /></label><label>About / bio<textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={280} placeholder="Tell people what you are learning..." /><small>{bio.length}/280</small></label>{error && <p className="form-error">{error}</p>}<div className="editor-footer"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving...' : 'Save changes'} <Save size={15} /></button></div></form></div>;
}
