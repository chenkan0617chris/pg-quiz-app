'use client';

import { useState } from 'react';
import { useSolveRequest } from '@/lib/solve-request';
import { useI18n } from '@/lib/i18n';
import {
  defaultTokens,
  formatEquation,
  PRESET_SPECS,
  tokensFromSpec,
  type NumericResult,
  type Token,
} from '@/lib/numeric';
import EquationBuilder from '@/components/numerical/EquationBuilder';
import NumericResultView from '@/components/numerical/NumericResultView';

type Range = '1-9' | '0-9';

export default function NumericalPage() {
  const { t } = useI18n();

  const [tokens, setTokens] = useState<Token[]>(() => defaultTokens());
  const [target, setTarget] = useState('177');
  const [distinct, setDistinct] = useState(true);
  const [range, setRange] = useState<Range>('1-9');
  const [result, setResult] = useState<NumericResult | null>(null);

  const {run,busy,ready,error} = useSolveRequest<NumericResult>('/api/solve/numerical');
  const solve = async () => {
    const next = await run({tokens,target:target.trim() ? Number(target) : null,distinct,range});
    if (next) setResult(next);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ===== Problem column ===== */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Equation builder */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-800">{t('numEquation')}</h2>
            <EquationBuilder
              tokens={tokens}
              target={target}
              onChange={setTokens}
              onTarget={setTarget}
              onClear={() => {
                setTokens([]);
                setResult(null);
              }}
              onSample={() => {
                setTokens(defaultTokens());
                setTarget('177');
                setResult(null);
              }}
            />
          </section>

          {/* Equation templates */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-gray-800">{t('numTemplates')}</h2>
            <p className="mb-4 text-xs text-gray-400">{t('numTemplatesHint')}</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_SPECS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => {
                    setTokens(tokensFromSpec(spec));
                    setResult(null);
                  }}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {formatEquation(tokensFromSpec(spec))
                    .split('')
                    .map((ch, i) =>
                      ch === '?' ? (
                        <span
                          key={i}
                          className="mx-0.5 inline-block h-3.5 w-3.5 translate-y-[1px] rounded-sm border border-current"
                        />
                      ) : (
                        ch
                      ),
                    )}
                </button>
              ))}
            </div>
          </section>

          {/* Options */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-800">{t('numOptions')}</h2>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{t('numDigitRange')}</span>
                <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
                  {(['1-9', '0-9'] as Range[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={
                        'px-3 py-1.5 text-sm font-medium transition ' +
                        (range === r
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50')
                      }
                    >
                      {r === '1-9' ? '1–9' : '0–9'}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={distinct}
                  onChange={(e) => setDistinct(e.target.checked)}
                  className="h-4 w-4 accent-indigo-600"
                />
                {t('numDistinct')}
              </label>
            </div>
          </section>

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
            <p className="text-sm text-gray-400">{t('numResultPlaceholder')}</p>
          ) : (
            <NumericResultView result={result} tokens={tokens} target={target} />
          )}
        </section>
      </div>
    </div>
  );
}
