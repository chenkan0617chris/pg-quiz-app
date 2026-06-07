/* =====================================================================
   SHAPES — visual metadata + a pure SVG renderer shared across pages.
   Shape ids 1..4 match the original solver. Names are localised via
   i18n (shapeNameKey), so this component stays language-neutral.
   ===================================================================== */

export type ShapeType = 'circle' | 'triangle' | 'square' | 'plus';

export interface ShapeMeta {
  id: number;
  color: string;
  type: ShapeType;
}

export const SHAPES: Record<number, ShapeMeta> = {
  1: { id: 1, color: '#22b04b', type: 'circle' },
  2: { id: 2, color: '#f5b50a', type: 'triangle' },
  3: { id: 3, color: '#e23b35', type: 'square' },
  4: { id: 4, color: '#2f86d6', type: 'plus' },
};

export const SHAPE_IDS = [1, 2, 3, 4];

export function Shape({
  id,
  size = 36,
  title,
}: {
  id: number;
  size?: number;
  title?: string;
}) {
  const s = SHAPES[id];
  if (!s) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-label={title} role="img">
      {title ? <title>{title}</title> : null}
      {s.type === 'circle' && <circle cx="20" cy="20" r="15" fill={s.color} />}
      {s.type === 'square' && <rect x="6" y="6" width="28" height="28" rx="5" fill={s.color} />}
      {s.type === 'triangle' && <polygon points="20,4 35,34 5,34" fill={s.color} />}
      {s.type === 'plus' && (
        <polygon
          points="14,5 26,5 26,14 35,14 35,26 26,26 26,35 14,35 14,26 5,26 5,14 14,14"
          fill={s.color}
        />
      )}
    </svg>
  );
}
