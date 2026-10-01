'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Loader2, Search, X } from 'lucide-react';
import { memo, useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import useSWR, { mutate as mutateGlobal } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { Avatar } from '@/components/doc-campus-shell';
import { api, getSummary, User } from '@/lib/doc-campus-api';

type ConnectionType = 'followers' | 'following';

// isFollowing / isSelf are relative to the LOGGED-IN user (not the profile being viewed).
type ConnectionUser = Pick<User, 'id' | 'username' | 'avatarUrl' | 'bio'> & {
  isFollowing?: boolean;
  isSelf?: boolean;
};

type ConnectionsResponse = {
  items: ConnectionUser[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

type PendingAction = { kind: 'unfollow' | 'remove'; user: ConnectionUser } | null;

type ConnectionsPanelProps = {
  username: string; // whose followers / following we are listing
  type: ConnectionType; // which tab to open on
  isOwner?: boolean; // true when the logged-in user is viewing their OWN profile
  followersCount?: number;
  followingCount?: number;
  onClose: () => void;
};

const PAGE_SIZE = 20;

export function ConnectionsPanel({
  username,
  type,
  isOwner: isOwnerProp = false,
  followersCount,
  followingCount,
  onClose,
}: ConnectionsPanelProps) {
  const titleId = useId();
  const [tab, setTab] = useState<ConnectionType>(type);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // keeps typing smooth on long lists

  // Who is logged in? Read it from the shared summary cache (already loaded by the page) so
  // owner-only actions don't depend on the parent passing a correct prop or the API sending isSelf.
  const me = useSWR('/api/users/me/summary', getSummary, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
  const myUsername = me.data?.username;
  const isOwner = isOwnerProp || (Boolean(myUsername) && myUsername === username);

  // Optimistic follow state keyed by username (overrides what the server list said)
  const [followOverrides, setFollowOverrides] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Set<string>>(() => new Set());

  // Instagram-style confirmation ("Unfollow @user?" / "Remove follower?")
  const [confirm, setConfirm] = useState<PendingAction>(null);
  const confirmOpenRef = useRef(false);
  useEffect(() => {
    confirmOpenRef.current = confirm !== null;
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);

  // Latest onClose in a ref so the mount effect below never re-runs (and never steals focus)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // ---------- Data (cursor pagination, cached per tab so switching back is instant) ----------
  const getKey = useCallback(
    (pageIndex: number, previous: ConnectionsResponse | null) => {
      if (previous && !previous.hasNextPage) return null;
      const base = `/api/users/${username}/${tab}?limit=${PAGE_SIZE}`;
      if (pageIndex === 0 || !previous?.nextCursor) return base;
      return `${base}&cursor=${encodeURIComponent(previous.nextCursor)}`;
    },
    [username, tab]
  );

  const { data, error, isLoading, size, setSize, mutate: mutateList } = useSWRInfinite<ConnectionsResponse>(
    getKey,
    (url: string) => api(url),
    { revalidateOnFocus: false, revalidateFirstPage: false }
  );

  const users = useMemo(() => {
    const byId = new Map<string, ConnectionUser>();
    data?.forEach((page) => page.items.forEach((user) => byId.set(user.id, user)));
    return Array.from(byId.values());
  }, [data]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const visibleUsers = useMemo(
    () =>
      normalizedQuery
        ? users.filter((user) => user.username.toLowerCase().includes(normalizedQuery))
        : users,
    [users, normalizedQuery]
  );

  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage ? lastPage.hasNextPage : false;
  const isLoadingMore =
    size > 0 && data !== undefined && typeof data[size - 1] === 'undefined';

  // ---------- Dialog behaviour: Esc to close, lock page scroll, restore focus ----------
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      // While the confirm dialog is open, Esc only dismisses that dialog
      if (event.key === 'Escape' && !confirmOpenRef.current) onCloseRef.current();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  // ---------- Infinite scroll inside the modal's own scroll area ----------
  useEffect(() => {
    const node = sentinelRef.current;
    const root = listRef.current;
    if (!node || !root || !hasMore || isLoadingMore || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void setSize((current) => current + 1);
      },
      { root, rootMargin: '120px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // visibleUsers.length: re-observe after the list changes, so a short filtered list
    // that still shows the sentinel keeps loading until a match is found or pages run out.
  }, [hasMore, isLoadingMore, error, setSize, visibleUsers.length]);

  // ---------- Actions ----------
  const refreshCounts = useCallback(() => {
    void mutateGlobal(`/api/users/${username}`); // profile counts
    void mutateGlobal('/api/users/me/summary'); // sidebar summary
  }, [username]);

  // Follow / unfollow with optimistic UI and rollback
  const setFollow = useCallback(
    async (user: ConnectionUser, follow: boolean) => {
      const name = user.username;

      setPending((prev) => new Set(prev).add(name));
      setFollowOverrides((prev) => ({ ...prev, [name]: follow }));

      try {
        await api(`/api/users/${name}/follow`, { method: follow ? 'POST' : 'DELETE' });
        refreshCounts();
      } catch (err) {
        console.error('Failed to update follow state', err);
        setFollowOverrides((prev) => {
          const next = { ...prev };
          delete next[name]; // roll back to what the server said
          return next;
        });
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(name);
          return next;
        });
      }
    },
    [refreshCounts]
  );

  // Remove one of YOUR followers (owner only). Row disappears instantly, restored on failure.
  // Assumes: DELETE /api/users/me/followers/:username
  const removeFollower = useCallback(
    async (user: ConnectionUser) => {
      const name = user.username;
      // Must always return an array: SWR's optimisticData type doesn't allow `undefined`
      const prune = (pages: ConnectionsResponse[] | undefined): ConnectionsResponse[] =>
        (pages ?? []).map((page) => ({
          ...page,
          items: page.items.filter((item) => item.username !== name),
        }));

      try {
        await mutateList(
          async (pages) => {
            await api(`/api/users/me/followers/${name}`, { method: 'DELETE' });
            return prune(pages);
          },
          { optimisticData: prune, rollbackOnError: true, revalidate: false }
        );
        refreshCounts();
      } catch (err) {
        console.error('Failed to remove follower', err);
      }
    },
    [mutateList, refreshCounts]
  );

  // Following -> ask first (like Instagram). Not following -> follow immediately.
  const handleFollowClick = useCallback(
    (user: ConnectionUser, currentlyFollowing: boolean) => {
      if (currentlyFollowing) setConfirm({ kind: 'unfollow', user });
      else void setFollow(user, true);
    },
    [setFollow]
  );

  const handleRemoveClick = useCallback((user: ConnectionUser) => {
    setConfirm({ kind: 'remove', user });
  }, []);

  const cancelConfirm = useCallback(() => setConfirm(null), []);

  const runConfirmed = useCallback(() => {
    if (!confirm) return;
    setConfirm(null);
    if (confirm.kind === 'unfollow') void setFollow(confirm.user, false);
    else void removeFollower(confirm.user);
  }, [confirm, setFollow, removeFollower]);

  // Close the panel after navigating (the profile route keeps this component mounted,
  // so without this the panel would stay open on the next profile). Ctrl/Cmd-click still
  // opens a new tab and leaves the panel alone.
  const handleNavigate = useCallback((event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    onCloseRef.current();
  }, []);

  const switchTab = useCallback((next: ConnectionType) => {
    setTab(next);
    setQuery('');
  }, []);

  const title = tab === 'followers' ? 'Followers' : 'Following';
  const emptyText = tab === 'followers' ? 'No followers yet.' : 'Not following anyone yet.';
  const showRemove = isOwner && tab === 'followers';

  // On your own "Following" tab everyone is followed by definition, even if the API
  // doesn't send isFollowing. Elsewhere we rely on the API value.
  const defaultFollowing = isOwner && tab === 'following' ? true : undefined;

  // ---------- Render ----------
  return (
    <>
      {createPortal(
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation}>
            <m.div
              className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              // mousedown (not click) so a text-selection drag that ends on the backdrop doesn't close it
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
              }}
            >
              <m.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex max-h-[min(640px,80vh)] w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-2xl outline-none"
              >
                {/* Header */}
                <div className="flex items-start justify-between px-6 pb-3 pt-5">
                  <div>
                    <p className="text-[11px] tracking-[0.18em] text-[var(--muted)]">NETWORK</p>
                    <h2 id={titleId} className="mt-1 font-serif text-2xl">
                      {title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--panel-2)] hover:text-[var(--text)]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Tabs (switch between followers / following without closing) */}
                <div role="tablist" className="flex border-b border-[var(--line)] px-6">
                  {(['followers', 'following'] as const).map((value) => {
                    const active = tab === value;
                    const count = value === 'followers' ? followersCount : followingCount;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => switchTab(value)}
                        className={`-mb-px flex-1 cursor-pointer border-b-2 pb-2.5 pt-1 text-sm capitalize transition-colors ${
                          active
                            ? 'border-[var(--blue)] text-[var(--text)]'
                            : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        {value}
                        {typeof count === 'number' && <span className="ml-1.5 opacity-70">{count}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="px-4 pb-2 pt-3">
                  <label className="flex h-10 items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-3 text-[var(--muted)] transition-colors focus-within:border-[var(--blue)]">
                    <Search size={15} aria-hidden="true" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={`Search ${tab}`}
                      aria-label={`Search ${tab}`}
                      className="w-full border-0 bg-transparent text-sm text-[var(--text)] outline-0 placeholder:text-[var(--muted)]"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="cursor-pointer text-[var(--muted)] hover:text-[var(--text)]"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                </div>

                {/* List */}
                <div
                  ref={listRef}
                  className="min-h-[220px] flex-1 overflow-y-auto overscroll-contain px-2 pb-3"
                  aria-busy={isLoading || isLoadingMore}
                >
                  {error && users.length === 0 ? (
                    <p className="px-4 py-10 text-center text-sm text-[var(--muted)]" role="alert">
                      Couldn&apos;t load {tab}.{' '}
                      <button
                        type="button"
                        onClick={() => void mutateList()}
                        className="cursor-pointer text-[var(--blue)] hover:underline"
                      >
                        Try again
                      </button>
                    </p>
                  ) : isLoading ? (
                    <ul className="m-0 list-none p-0" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <li key={index} className="flex items-center gap-3 px-4 py-2.5">
                          <div className="h-11 w-11 animate-pulse rounded-full bg-[var(--panel-2)]" />
                          <div className="grid flex-1 gap-2">
                            <div className="h-3 w-28 animate-pulse rounded bg-[var(--panel-2)]" />
                            <div className="h-3 w-44 animate-pulse rounded bg-[var(--panel-2)]" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : visibleUsers.length === 0 && !hasMore ? (
                    <p className="px-4 py-10 text-center text-sm text-[var(--muted)]">
                      {normalizedQuery ? `No results for “${deferredQuery.trim()}”.` : emptyText}
                    </p>
                  ) : (
                    <ul className="m-0 list-none p-0">
                      {visibleUsers.map((user) => (
                        <ConnectionRow
                          key={user.id}
                          user={user}
                          isFollowing={followOverrides[user.username] ?? user.isFollowing ?? defaultFollowing}
                          isPending={pending.has(user.username)}
                          isSelf={Boolean(user.isSelf) || (Boolean(myUsername) && user.username === myUsername)}
                          showRemove={showRemove}
                          onFollowClick={handleFollowClick}
                          onRemoveClick={handleRemoveClick}
                          onNavigate={handleNavigate}
                        />
                      ))}

                      {hasMore && (
                        <li ref={sentinelRef} className="grid place-items-center py-3 text-[var(--muted)]">
                          {isLoadingMore ? <Loader2 size={18} className="animate-spin" /> : null}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </m.div>
            </m.div>
          </LazyMotion>
        </MotionConfig>,
        document.body
      )}

      {confirm &&
        createPortal(
          <ConfirmDialog action={confirm} onConfirm={runConfirmed} onCancel={cancelConfirm} />,
          document.body
        )}
    </>
  );
}

// ---------------------------------------------------------------------------------------

type ConnectionRowProps = {
  user: ConnectionUser;
  isFollowing: boolean | undefined;
  isPending: boolean;
  isSelf: boolean;
  showRemove: boolean;
  onFollowClick: (user: ConnectionUser, currentlyFollowing: boolean) => void;
  onRemoveClick: (user: ConnectionUser) => void;
  onNavigate: (event: React.MouseEvent) => void;
};

// Memoized so toggling one row (or typing in search) doesn't re-render every other row
const ConnectionRow = memo(function ConnectionRow({
  user,
  isFollowing,
  isPending,
  isSelf,
  showRemove,
  onFollowClick,
  onRemoveClick,
  onNavigate,
}: ConnectionRowProps) {
  const canFollow = !isSelf && !showRemove && typeof isFollowing === 'boolean';

  return (
    <li className="flex items-center gap-2 rounded-xl px-2 transition-colors hover:bg-[var(--panel-2)]">
      {/* Whole identity block is one link: proper anchor = prefetch, middle-click, keyboard */}
      <Link
        href={`/profile/${user.username}`}
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2.5"
      >
        <Avatar username={user.username} src={user.avatarUrl} />
        <span className="min-w-0">
          <strong className="block truncate text-sm">{user.username}</strong>
          {user.bio && <small className="block truncate text-xs text-[var(--muted)]">{user.bio}</small>}
        </span>
      </Link>

      {showRemove && !isSelf && (
        <button
          type="button"
          onClick={() => onRemoveClick(user)}
          className="h-8 shrink-0 cursor-pointer rounded-lg border border-[var(--line)] bg-transparent px-4 text-[13px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--panel)]"
        >
          Remove
        </button>
      )}

      {canFollow && (
        <button
          type="button"
          onClick={() => onFollowClick(user, Boolean(isFollowing))}
          disabled={isPending}
          className={`h-8 shrink-0 cursor-pointer rounded-lg px-4 text-[13px] font-semibold transition-colors disabled:cursor-default disabled:opacity-60 ${
            isFollowing
              ? 'border border-[var(--line)] bg-transparent text-[var(--text)] hover:bg-[var(--panel)]'
              : 'border border-transparent bg-[var(--blue)] text-white hover:opacity-90'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </li>
  );
});

// ---------------------------------------------------------------------------------------

type ConfirmDialogProps = {
  action: NonNullable<PendingAction>;
  onConfirm: () => void;
  onCancel: () => void; // must be a stable reference
};

// Instagram-style confirmation sheet: avatar, question, red action, Cancel
function ConfirmDialog({ action, onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { kind, user } = action;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus(); // safest default: Cancel, so Enter/Space can't confirm by accident

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onCancel]);

  const isRemove = kind === 'remove';

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <m.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.12 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
        >
          <m.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] text-center text-[var(--text)] shadow-2xl"
          >
            <div className="grid justify-items-center gap-3 px-6 pb-6 pt-8">
              <Avatar username={user.username} src={user.avatarUrl} large />
              <h2 id={titleId} className="text-sm font-medium">
                {isRemove ? 'Remove follower?' : `Unfollow @${user.username}?`}
              </h2>
              {isRemove && (
                <p className="max-w-[300px] text-xs text-[var(--muted)]">
                  Doc Campus won&apos;t tell {user.username} they were removed from your followers.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onConfirm}
              className="block w-full cursor-pointer border-t border-[var(--line)] py-3.5 text-sm font-bold text-red-400 transition-colors hover:bg-[var(--panel-2)]"
            >
              {isRemove ? 'Remove' : 'Unfollow'}
            </button>
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              className="block w-full cursor-pointer border-t border-[var(--line)] py-3.5 text-sm transition-colors hover:bg-[var(--panel-2)]"
            >
              Cancel
            </button>
          </m.div>
        </m.div>
      </LazyMotion>
    </MotionConfig>
  );
}