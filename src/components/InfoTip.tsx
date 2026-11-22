'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * A small "?" button that reveals secondary explanation on hover, focus or tap.
 * Use it for how-to notes and rules that most visitors do not need to read
 * before acting, so the page itself can stay to a title and the tool.
 */
export default function InfoTip({
  label,
  children,
  align = 'left',
  className = '',
}: {
  label: string;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}) {
  // Hover previews; a click or tap pins it open until an outside click or Escape.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) { setPinned(false); setHovered(false); }
    }
    function key(event: KeyboardEvent) {
      if (event.key === 'Escape') { setPinned(false); setHovered(false); }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  return (
    <span
      ref={root}
      className={`relative inline-flex align-middle ${className}`}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovered(false); }}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setPinned((v) => !v)}
        className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold leading-none text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
      >
        ?
      </button>
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={`absolute top-full z-30 mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-xl border border-slate-200 bg-white p-4 text-left text-[13px] font-normal leading-6 text-slate-600 shadow-lg ${align === 'right' ? 'right-0' : 'left-0'}`}
      >
        {children}
      </span>
    </span>
  );
}
