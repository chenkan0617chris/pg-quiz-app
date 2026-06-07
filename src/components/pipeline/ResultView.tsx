'use client';

import type { SolveResult } from '@/lib/engine';
import { useI18n, type DictKey } from '@/lib/i18n';
import ShapeRow from './ShapeRow';
import FlowDiagram from './FlowDiagram';

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-green-600 px-3 py-1 font-mono text-base font-bold tracking-[0.25em] text-white">
      {children}
    </span>
  );
}

function ErrorRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span aria-hidden>⚠️</span>
      <span>{text}</span>
    </div>
  );
}

export default function ResultView({ result }: { result: SolveResult }) {
  const { t } = useI18n();

  if (result.kind === 'errors') {
    return (
      <div className="flex flex-col gap-2">
        {result.errors.map((err, i) => (
          <ErrorRow key={i} text={t(err.key as DictKey, ...(err.params ?? []))} />
        ))}
      </div>
    );
  }

  if (result.kind === 'order') {
    return (
      <div>
        <Banner>
          <span className="font-semibold">{t(result.labelKey)} =</span>
          <ShapeRow seq={result.solvedSeq} size={24} highlight />
        </Banner>
        <FlowDiagram flow={result.flow} highlightOutput={result.labelKey === 'outputOrder'} />
      </div>
    );
  }

  if (result.kind === 'singleBox') {
    return (
      <div className="flex flex-col gap-3">
        <Banner>
          <span className="font-semibold">{t('ansBox', result.boxIndex + 1)}</span>
          <Code>{result.box.join('')}</Code>
        </Banner>

        {result.candidates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.candidates.map((c, i) => (
              <span
                key={i}
                className={[
                  'inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-sm',
                  c.match
                    ? 'border-green-300 bg-green-100 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-500',
                ].join(' ')}
              >
                {c.match && <span aria-hidden>✓</span>}
                {c.str}
              </span>
            ))}
          </div>
        )}

        {result.noMatch && <ErrorRow text={t('noCandMatch')} />}
        {!result.consistent && <ErrorRow text={t('inconsistent')} />}

        <FlowDiagram flow={result.flow} />
      </div>
    );
  }

  // multiBox
  return (
    <div className="flex flex-col gap-3">
      {result.solutions.map((sol, i) => (
        <Banner key={i}>
          {sol.map((s, k) => (
            <span key={k} className="flex items-center gap-1.5">
              {k > 0 && <span className="text-green-400">·</span>}
              <span className="font-semibold">{t('ansBox', s.boxIndex + 1)}</span>
              <Code>{s.box.join('')}</Code>
            </span>
          ))}
        </Banner>
      ))}

      {result.solutions.length > 1 && (
        <p className="text-sm text-gray-500">{t('multiCombos', result.solutions.length)}</p>
      )}

      <FlowDiagram flow={result.flow} />
    </div>
  );
}
