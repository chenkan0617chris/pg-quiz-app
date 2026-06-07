'use client';

import type { Flow } from '@/lib/engine';
import { useI18n } from '@/lib/i18n';
import ShapeRow from './ShapeRow';

function Arrow() {
  return (
    <div className="flex justify-center text-gray-300" aria-hidden>
      <svg width="20" height="22" viewBox="0 0 20 22">
        <path d="M10 0v16M4 11l6 7 6-7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

/** Vertical pipeline diagram: input chip -> box pills -> intermediate/output chips. */
export default function FlowDiagram({
  flow,
  highlightOutput = false,
}: {
  flow: Flow;
  highlightOutput?: boolean;
}) {
  const { t } = useI18n();
  const lastIndex = flow.stages.length - 1;

  return (
    <div className="mt-6 flex flex-col items-center">
      <span className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        {t('stageInput')}
      </span>
      <ShapeRow seq={flow.input} />

      {flow.stages.map((stage, i) => {
        const isLast = i === lastIndex;
        return (
          <div key={i} className="flex flex-col items-center">
            <Arrow />
            <div
              className={[
                'rounded-xl px-5 py-2.5 font-mono text-lg font-bold tracking-[0.3em]',
                stage.solved
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 border border-slate-200',
              ].join(' ')}
            >
              {stage.box.join('')}
            </div>
            <Arrow />
            <ShapeRow seq={stage.seqAfter} highlight={isLast && highlightOutput} />
          </div>
        );
      })}
    </div>
  );
}
