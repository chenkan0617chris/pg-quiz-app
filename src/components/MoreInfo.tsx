import type { ReactNode } from 'react';

/**
 * Collapsed reading material placed below a tool. The text stays in the server
 * HTML (so it is still crawlable) but does not compete with the tool for attention.
 */
export default function MoreInfo({
  summary,
  children,
  open = false,
  className = 'mt-12',
}: {
  summary: string;
  children: ReactNode;
  open?: boolean;
  className?: string;
}) {
  return (
    <details open={open} className={`group rounded-xl border border-slate-200 ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        {summary}
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90">
          <path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-slate-200 px-5 pb-6 pt-2">{children}</div>
    </details>
  );
}
