// No 'use client' here: this is static, so it renders on the server and ships no client JS.
import { Sparkles } from 'lucide-react';
import { ui } from '@/lib/ui';

const QUICK_START_STEPS = [
  'Upload a study resource',
  'Add context for others',
  'Find your next idea',
];

export function FeedRightRail() {
  return (
    // desktop only, sticky under the navbar
    <aside
      aria-label="Tips"
      className={`hidden min-w-0 space-y-4 min-[1121px]:block ${ui.stickyColumn}`}
    >
      <section className={`${ui.card} relative overflow-hidden p-5`}>
        <div className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-accent/30 blur-3xl" />

        <p className={`relative ${ui.sectionLabel}`}>Today&apos;s focus</p>
        <h2 className="relative mb-3 mt-3 text-lg font-semibold leading-snug text-content">
          Small notes compound into big understanding.
        </h2>
        <p className="relative text-xs leading-relaxed text-muted">
          Share what helped you today. Someone else is probably looking for it.
        </p>
        <div className="relative mt-5 h-0.5 w-1/3 rounded bg-accent" />
      </section>

      <section className={`${ui.card} p-4`}>
        <div className="mb-3 flex items-center justify-between">
          <span className={ui.sectionLabel}>Quick start</span>
          <Sparkles size={14} className="text-subtle" aria-hidden="true" />
        </div>

        <ol className="m-0 list-none p-0">
          {QUICK_START_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 py-1.5 text-[13px] text-muted">
              <span className="text-[10px] font-semibold leading-5 text-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}