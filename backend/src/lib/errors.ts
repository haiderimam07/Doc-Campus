// Fastify's default error handler respects `statusCode`, so these map straight to HTTP responses.
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (what = 'Resource') => new AppError(404, `${what} not found`, 'NOT_FOUND');
export const forbidden = (msg = 'You are not allowed to do that') => new AppError(403, msg, 'FORBIDDEN');

// Postgres FK violation (e.g. post deleted between our check and the insert).
// Newer drizzle versions wrap driver errors, so check `cause` too.
export function isForeignKeyViolation(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } } | null;
  return e?.code === '23503' || e?.cause?.code === '23503';
}
