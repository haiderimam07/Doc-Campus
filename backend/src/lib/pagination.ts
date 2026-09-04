// lib/pagination.ts
export function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}_${id}`).toString('base64url');
}

export function decodeCursor(cursor: string): { createdAt: Date; id: string } {
  if (!/^[A-Za-z0-9_-]+$/.test(cursor)) {
    throw new Error('Invalid cursor');
  }

  const [iso, id, extra] = Buffer.from(cursor, 'base64url').toString('utf8').split('_');
  const createdAt = new Date(iso);

  if (extra !== undefined || !id || Number.isNaN(createdAt.getTime())) {
    throw new Error('Invalid cursor');
  }

  return { createdAt, id };
}