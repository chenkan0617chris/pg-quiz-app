'use client';

import { useState } from 'react';
import { useSolveRequest } from '@/lib/solve-request';
import {
  type BoxInput,
  type SolveResult,
} from '@/lib/engine';
import { useI18n } from '@/lib/i18n';
import InteractivePipelineBoard from '@/components/pipeline/InteractivePipelineBoard';
import ResultView from '@/components/pipeline/ResultView';

export default function PipelinePage() {
  const { t } = useI18n();

  const [inputOrder, setInputOrder] = useState<number[]>([1, 2, 3, 4]);
  const [outputOrder, setOutputOrder] = useState<number[]>([4, 3, 2, 1]);
  const [boxes, setBoxes] = useState<BoxInput[]>([
    { value: '', unknown: true, candidates: ['', '', ''] },
  ]);
  const [result, setResult] = useState<SolveResult | null>(null);

  const {run,busy,ready,error} = useSolveRequest<SolveResult>('/api/solve/pipeline');
  const solve = async () => {
    const next = await run({inputUnknown:false,outputUnknown:false,inputOrder,outputOrder,boxes,candidates:''});
    if (next) setResult(next);
  };

  return (
    <div className="w-full">
      {/* Problem (left) and Result (right) side by side */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ===== Problem column ===== */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <InteractivePipelineBoard
            inputOrder={inputOrder}
            outputOrder={outputOrder}
            boxes={boxes}
            onInputOrderChange={setInputOrder}
            onOutputOrderChange={setOutputOrder}
            onBoxesChange={setBoxes}
          />

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          {/* Solve */}
          <button
            type="button"
            onClick={solve}
            disabled={busy || !ready}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-lg font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800"
          >
            {busy ? '…' : t('solve')}
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
