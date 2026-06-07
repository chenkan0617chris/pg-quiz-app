'use client';

import { useEffect, useRef, useState } from 'react';
import { Shape, SHAPE_IDS } from '@/lib/shapes';
import { useI18n, shapeNameKey } from '@/lib/i18n';

/** Icon-only custom dropdown for picking a shape id (1..4). */
export default function ShapeSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (id: number) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t(shapeNameKey(value))}
        className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Shape id={value} size={22} title={t(shapeNameKey(value))} />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
        >
          {SHAPE_IDS.map((id) => (
            <li key={id} role="option" aria-selected={id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(id);
                  setOpen(false);
                }}
                title={t(shapeNameKey(id))}
                className={[
                  'flex h-10 w-12 items-center justify-center rounded-md transition hover:bg-indigo-50',
                  id === value ? 'bg-indigo-100 ring-1 ring-indigo-400' : '',
                ].join(' ')}
              >
                <Shape id={id} size={22} title={t(shapeNameKey(id))} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
