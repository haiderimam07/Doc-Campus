export type User = {
  id: string;
  username: string;
  email?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
};

export type Post = {
  id: string;
  description: string | null;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'doc' | 'link' | 'other';
  ocrStatus: 'pending' | 'processing' | 'done' | 'failed';
  createdAt: string;
  author: Pick<User, 'id' | 'username' | 'avatarUrl'>;
  isSaved?: boolean;
  // Counters come from the posts table (added to the select in posts.service.ts / feed.service.ts)
  likeCount: number;
  commentCount: number;
  saveCount: number;
  shareCount: number;
  // Only present on the feed (feed.service.ts); treated as false when missing
  likedByMe?: boolean;
};

// Shape returned by comments.service.ts (toDto). A deleted comment that still has replies
// comes back as a placeholder: isDeleted = true, body = null, author = null.
export type Comment = {
  id: string;
  postId: string;
  parentId: string | null;
  body: string | null;
  isDeleted: boolean;
  author: Pick<User, 'id' | 'username' | 'avatarUrl'> | null;
  likeCount: number;
  replyCount: number;
  likedByMe: boolean;
  isMine: boolean;
  createdAt: string;
  editedAt: string | null;
};

export type CommentsPage = {
  items: Comment[];
  hasMore: boolean;
  nextCursor: string | null;
  canModerate: boolean; // true when the viewer owns the post (may delete any comment)
  totalCount?: number; // only on the top-level list
};

export type Connection = Pick<User, 'id' | 'username' | 'bio' | 'avatarUrl'>;
export type ConnectionsResponse = { items: Connection[]; nextCursor: string | null; hasNextPage: boolean };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) sessionStorage.setItem('doc-campus-token', token);
    else sessionStorage.removeItem('doc-campus-token');
  }
}

function getAccessToken() {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') accessToken = sessionStorage.getItem('doc-campus-token');
  return accessToken;
}

async function refreshToken() {
  const response = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' });
  if (!response.ok) return false;
  const data = await response.json();
  setAccessToken(data.accessToken);
  return true;
}

export async function api<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  } catch (error) {
    throw new Error(`API request failed for ${options.method || 'GET'} ${path}: ${error instanceof Error ? error.message : 'network error'}`);
  }
  if (response.status === 401 && retry && await refreshToken()) return api<T>(path, options, false);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong');
  return data as T;
}

export async function login(email: string, password: string) {
  const data = await api<{ user: User; accessToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function register(username: string, email: string, password: string) {
  const data = await api<{ user: User; accessToken: string }>('/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) });
  setAccessToken(data.accessToken);
  return data.user;
}

export async function logout() {
  await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
  setAccessToken(null);
}

export function getSummary() {
  return api<Pick<User, 'id' | 'username' | 'avatarUrl' | 'bio'> & { postCount: number }>('/api/users/me/summary');
}

export function getProfile(username: string) {
  return api<User & { followersCount: number; followingCount: number; isSelf: boolean; isFollowing: boolean }>(`/api/users/${username}`);
}

export function getConnections(username: string, type: 'followers' | 'following') {
  return api<ConnectionsResponse>(`/api/users/${username}/${type}?limit=50`);
}

export function updateProfile(input: { bio?: string; avatar?: File; removeAvatar?: boolean }) {
  if (!input.avatar && !input.removeAvatar) {
    return api<User>('/api/users/me', { method: 'PATCH', body: JSON.stringify({ bio: input.bio }) });
  }
  const form = new FormData();
  if (input.bio !== undefined) form.append('bio', input.bio);
  if (input.avatar) form.append('avatar', input.avatar);
  if (input.removeAvatar) form.append('removeAvatar', 'true');
  return api<User>('/api/users/me', { method: 'PATCH', body: form });
}

export function savePost(postId: string) {
  return api<{ saved: boolean }>(`/api/posts/${postId}/save`, { method: 'POST' });
}

export function unsavePost(postId: string) {
  return api<{ saved: boolean }>(`/api/posts/${postId}/save`, { method: 'DELETE' });
}

export function getSavedPostIds() {
  return api<{ items: string[] }>('/api/posts/saved/ids');
}

export async function getSavedPosts(cursor?: string, limit = 20) {
  const query = cursor ? `?cursor=${cursor}&limit=${limit}` : `?limit=${limit}`;
  return api<{ items: Post[]; nextCursor: string | null; hasNextPage: boolean }>(`/api/posts/saved${query}`);
}

export function getPost(postId: string) {
  return api<Post>(`/api/posts/${postId}`);
}

/* ───────────── Likes ───────────── */

type LikeResult = { liked: boolean; likeCount: number };

export function likePost(postId: string) {
  return api<LikeResult>(`/api/posts/${postId}/like`, { method: 'PUT' });
}

export function unlikePost(postId: string) {
  return api<LikeResult>(`/api/posts/${postId}/like`, { method: 'DELETE' });
}

export function likeComment(commentId: string) {
  return api<LikeResult>(`/api/comments/${commentId}/like`, { method: 'PUT' });
}

export function unlikeComment(commentId: string) {
  return api<LikeResult>(`/api/comments/${commentId}/like`, { method: 'DELETE' });
}

/* ───────────── Comments ───────────── */

function pageQuery(limit: number, cursor?: string) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);
  return params.toString();
}

// Newest first, 5 per page by default
export function getComments(postId: string, cursor?: string, limit = 5) {
  return api<CommentsPage>(`/api/posts/${postId}/comments?${pageQuery(limit, cursor)}`);
}

// Oldest first, 3 per page by default
export function getReplies(commentId: string, cursor?: string, limit = 3) {
  return api<CommentsPage>(`/api/comments/${commentId}/replies?${pageQuery(limit, cursor)}`);
}

// Pass parentId to reply. Replying to a reply attaches to the same top-level comment (server side).
export function addComment(postId: string, body: string, parentId?: string) {
  return api<Comment>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(parentId ? { body, parentId } : { body }),
  });
}

export function editComment(commentId: string, body: string) {
  return api<Comment>(`/api/comments/${commentId}`, { method: 'PATCH', body: JSON.stringify({ body }) });
}

export function deleteComment(commentId: string) {
  return api<{ deleted: boolean }>(`/api/comments/${commentId}`, { method: 'DELETE' });
}

/* ───────────── Shares ───────────── */

export function sharePost(postId: string) {
  return api<{ shareCount: number }>(`/api/posts/${postId}/share`, { method: 'POST' });
}

export { API_URL };