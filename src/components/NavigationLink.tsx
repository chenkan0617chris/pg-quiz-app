'use client';

import Link, { useLinkStatus } from 'next/link';
import { useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  const { lang } = useI18n();
  if (!pending) return null;
  // A portal keeps feedback visible when the mobile drawer closes after a click.
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[100]" data-navigation-pending>
      <div aria-hidden="true" className="h-0.5 w-full bg-indigo-600 motion-safe:animate-pulse" />
      <div role="status" className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2.5 text-sm font-medium text-indigo-700 shadow-lg">
        <span aria-hidden="true" className="size-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 motion-safe:animate-spin" />
        {lang === 'zh' ? '正在打开页面…' : 'Opening page…'}
      </div>
    </div>,
    document.body,
  );
}

/** Prefetch the loading shell normally, and the full route on navigation intent. */
export default function NavigationLink({ children, prefetch, onMouseEnter, onFocus, onTouchStart, ...props }: ComponentProps<typeof Link>) {
  const [intent, setIntent] = useState(false);
  return (
    <Link {...props} prefetch={prefetch ?? (intent ? true : null)}
      onMouseEnter={event => { setIntent(true); onMouseEnter?.(event); }}
      onFocus={event => { setIntent(true); onFocus?.(event); }}
      onTouchStart={event => { setIntent(true); onTouchStart?.(event); }}>
      {children}
      <NavigationFeedback />
    </Link>
  );
}
