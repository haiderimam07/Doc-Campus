// Shared Tailwind class strings for the feed. Change a look here once and
// every component that uses it updates. Colors come from the theme tokens
// in globals.css (bg-surface, border-line, text-muted, ...), never hard-coded.

export const ui = {
  // standard card
  card: 'rounded-xl border border-line bg-surface',

  // side columns: sticky under the navbar (72px) + page padding (34px) = 106px
  stickyColumn:
    'sticky top-[106px] max-h-[calc(100vh-126px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',

  // small uppercase heading used on cards
  sectionLabel: 'text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle',

  textLink: 'text-[13px] font-medium text-accent hover:underline',

  emptyState:
    'rounded-xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted',
} as const;