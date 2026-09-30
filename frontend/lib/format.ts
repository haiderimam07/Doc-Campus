// "5s", "12m", "3h", "2d"
export function timeAgo(value: string) {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 1000));

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

// 1200 -> "1.2K"
const compact = new Intl.NumberFormat('en', { notation: 'compact' });
export function formatCount(value: number) {
  return compact.format(value);
}