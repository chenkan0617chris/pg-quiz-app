'use client';

import type { BoxInput } from '@/lib/engine';
import { useI18n } from '@/lib/i18n';

/** Card managing the editable list of pipeline boxes. */
export default function BoxesCard({
  boxes,
  onChange,
}: {
  boxes: BoxInput[];
  onChange: (boxes: BoxInput[]) => void;
}) {
  const { t } = useI18n();

  const update = (i: number, patch: Partial<BoxInput>) => {
    onChange(boxes.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  };
  const remove = (i: number) => onChange(boxes.filter((_, idx) => idx !== i));
  const add = () => onChange([...boxes, { value: '', unknown: false }]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">{t('pipelineBoxes')}</h2>

      <ul className="flex flex-col gap-3">
        {boxes.map((box, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-6 text-sm font-medium text-gray-400">{i + 1}</span>
            <input
              type="text"
              maxLength={4}
              value={box.value}
              disabled={box.unknown}
              onChange={(e) => update(i, { value: e.target.value.replace(/[^1-4]/g, '') })}
              placeholder={box.unknown ? '????' : '____'}
              className="w-20 rounded-lg border border-gray-300 px-2 py-2 text-center font-mono text-lg tracking-widest text-gray-800 transition focus:border-indigo-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            />
            <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={box.unknown}
                onChange={(e) => update(i, { unknown: e.target.checked })}
                className="h-4 w-4 accent-indigo-600"
              />
              {t('unknown')}
            </label>
            <button
              type="button"
              onClick={() => remove(i)}
              title={t('remove')}
              aria-label={t('remove')}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={add}
        className="mt-4 rounded-lg border border-dashed border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
      >
        {t('addBox')}
      </button>

      <p className="mt-3 text-xs text-gray-400">{t('boxUnknownHint')}</p>
    </section>
  );
}
