import { AppError } from './errors.js';

/**
 * Keyset ("cursor") pagination helpers.
 *
 * `ts` is the row's timestamp as TEXT straight from Postgres (microsecond precision).
 * A JS Date only has milliseconds, so round-tripping through Date could skip or repeat rows.
 */
export interface Cursor {
  ts: string;
  id: string;
}

const TS_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}(:?\d{2})?)$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function encodeCursor(c: Cursor): string {
  return Buffer.from(JSON.stringify(c)).toString('base64url');
}

export function decodeCursor(raw?: string): Cursor | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (
      typeof parsed?.ts === 'string' &&
      typeof parsed?.id === 'string' &&
      TS_RE.test(parsed.ts) &&
      UUID_RE.test(parsed.id)
    ) {
      return { ts: parsed.ts, id: parsed.id };
    }
  } catch {
    /* fall through */
  }
  throw new AppError(400, 'Invalid cursor', 'INVALID_CURSOR');
}

/** Query `limit + 1` rows, then pass them here. The extra row only tells us there is a next page. */
export function toPage<T>(rows: T[], limit: number, cursorOf: (row: T) => Cursor) {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  return {
    items,
    hasMore,
    nextCursor: hasMore && last ? encodeCursor(cursorOf(last)) : null,
  };
}
