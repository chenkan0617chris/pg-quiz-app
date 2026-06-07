'use client';

import { useRef, useState } from 'react';
import { useI18n, type DictKey } from '@/lib/i18n';
import { Shape } from '@/lib/shapes';
import { shapeNameKey } from '@/lib/i18n';

export default function OrderCard({
  titleKey,
  order,
  unknown,
  onChangeUnknown,
  onChangeOrder,
}: {
  titleKey: DictKey;
  order: number[];
  unknown: boolean;
  onChangeUnknown: (v: boolean) => void;
  onChangeOrder: (order: number[]) => void;
}) {
  const { t } = useI18n();
  const dragIdx = useRef<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const onDragStart = (i: number) => { dragIdx.current = i; };
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setOverIdx(i);
  };
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) { setOverIdx(null); return; }
    const next = order.slice();
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    onChangeOrder(next);
    dragIdx.current = null;
    setOverIdx(null);
  };
  const onDragEnd = () => { dragIdx.current = null; setOverIdx(null); };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{t(titleKey)}</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={unknown}
            onChange={(e) => onChangeUnknown(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          {t('unknown')}
        </label>
      </div>

      <div
        className={[
          'flex items-center gap-3 transition',
          unknown ? 'pointer-events-none opacity-40' : '',
        ].join(' ')}
      >
        {order.map((id, i) => (
          <div
            key={id}
            draggable={!unknown}
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={onDragEnd}
            title={t(shapeNameKey(id))}
            className={[
              'flex h-14 w-14 cursor-grab items-center justify-center rounded-xl border-2 bg-white transition select-none active:cursor-grabbing',
              overIdx === i && dragIdx.current !== i
                ? 'scale-105 border-indigo-400 shadow-md'
                : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm',
            ].join(' ')}
          >
            <Shape id={id} size={30} title={t(shapeNameKey(id))} />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-400">{t('orderHint')}</p>
    </section>
  );
}
