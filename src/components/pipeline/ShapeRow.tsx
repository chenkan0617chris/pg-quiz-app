'use client';

import { Shape } from '@/lib/shapes';
import { useI18n, shapeNameKey } from '@/lib/i18n';

/** A rounded chip containing a horizontal row of shape icons. */
export default function ShapeRow({
  seq,
  size = 28,
  highlight = false,
}: {
  seq: number[];
  size?: number;
  highlight?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div
      className={[
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-2',
        highlight ? 'bg-green-50 ring-2 ring-green-500' : 'bg-gray-50 border border-gray-200',
      ].join(' ')}
    >
      {seq.map((id, i) => (
        <Shape key={i} id={id} size={size} title={t(shapeNameKey(id))} />
      ))}
    </div>
  );
}
