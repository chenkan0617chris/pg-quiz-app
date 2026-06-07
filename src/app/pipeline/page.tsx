'use client';

import { useState } from 'react';
import {
  solvePuzzle,
  type BoxInput,
  type SolveResult,
} from '@/lib/engine';
import { useI18n } from '@/lib/i18n';
import OrderCard from '@/components/pipeline/OrderCard';
import BoxesCard from '@/components/pipeline/BoxesCard';
import ResultView from '@/components/pipeline/ResultView';

export default function PipelinePage() {
  const { t } = useI18n();

  const [inputUnknown, setInputUnknown] = useState(false);
  const [outputUnknown, setOutputUnknown] = useState(false);
  const [inputOrder, setInputOrder] = useState<number[]>([1, 2, 3, 4]);
  const [outputOrder, setOutputOrder] = useState<number[]>([4, 3, 2, 1]);
  const [boxes, setBoxes] = useState<BoxInput[]>([{ value: '', unknown: true }]);
  const [candidates, setCandidates] = useState('');
  const [result, setResult] = useState<SolveResult | null>(null);

  const solve = () =>
    setResult(
      solvePuzzle({
        inputUnknown,
        outputUnknown,
        inputOrder,
        outputOrder,
        boxes,
        candidates,
      }),
    );

  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-500">{t('subtitle')}</p>
      </header>

      {/* Problem (left) and Result (right) side by side */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ===== Problem column ===== */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Input order (top) */}
          <OrderCard
            titleKey="inputOrder"
            order={inputOrder}
            unknown={inputUnknown}
            onChangeUnknown={setInputUnknown}
            onChangeOrder={setInputOrder}
          />

          {/* Pipeline boxes (middle) */}
          <BoxesCard boxes={boxes} onChange={setBoxes} />

          {/* Output order (bottom) */}
          <OrderCard
            titleKey="outputOrder"
            order={outputOrder}
            unknown={outputUnknown}
            onChangeUnknown={setOutputUnknown}
            onChangeOrder={setOutputOrder}
          />

          {/* Candidates */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-800">{t('candidates')}</h2>
            <input
              type="text"
              value={candidates}
              onChange={(e) => setCandidates(e.target.value)}
              placeholder="2143, 1324, 2413"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-gray-800 transition focus:border-indigo-400 focus:outline-none"
            />
            <p className="mt-3 text-xs text-gray-400">{t('candHint')}</p>
          </section>

          {/* Solve */}
          <button
            type="button"
            onClick={solve}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-lg font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800"
          >
            {t('solve')}
          </button>
        </div>

        {/* ===== Result column ===== */}
        <section className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-8 lg:w-96 lg:shrink-0">
          <h2 className="mb-4 text-base font-semibold text-gray-800">{t('result')}</h2>
          {result === null ? (
            <p className="text-sm text-gray-400">{t('resultPlaceholder')}</p>
          ) : (
            <ResultView result={result} />
          )}
        </section>
      </div>
    </div>
  );
}
