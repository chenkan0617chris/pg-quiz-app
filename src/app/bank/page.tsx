'use client';

import { useCallback, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { PUZZLE_BANK, type Difficulty } from '@/lib/puzzleBank';
import PuzzleCard from '@/components/bank/PuzzleCard';

type Filter = 'all' | Difficulty;

const FILTERS: Filter[] = ['all', 'easy', 'medium', 'hard'];

const FILTER_KEYS = {
  all:    'bankAll',
  easy:   'bankEasy',
  medium: 'bankMedium',
  hard:   'bankHard',
} as const;

const DIFF_DOT: Record<Difficulty, string> = {
  easy:   'bg-emerald-400',
  medium: 'bg-amber-400',
  hard:   'bg-rose-400',
};

export default function BankPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');
  // id -> true (correct) | false (wrong)
  const [results, setResults] = useState<Record<number, boolean>>({});

  const handleSolved = useCallback((id: number, correct: boolean) => {
    setResults(prev => ({ ...prev, [id]: correct }));
  }, []);

  const visible = filter === 'all' ? PUZZLE_BANK : PUZZLE_BANK.filter(p => p.difficulty === filter);
  const solvedCount = Object.values(results).filter(Boolean).length;
  const answeredCount = Object.keys(results).length;

  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('bankTitle')}</h1>
        <p className="mt-1 text-gray-500">{t('bankSubtitle')}</p>
      </header>

      {/* Progress + controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(solvedCount / 30) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {t('bankProgress', solvedCount, 30)}
          </span>
        </div>

        {/* Reset */}
        {answeredCount > 0 && (
          <button
            type="button"
            onClick={() => setResults({})}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition hover:bg-gray-50"
          >
            {t('bankReset')}
          </button>
        )}
      </div>

      {/* Difficulty filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={[
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition',
              filter === f
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            {f !== 'all' && (
              <span className={`h-2 w-2 rounded-full ${DIFF_DOT[f as Difficulty]}`} />
            )}
            {t(FILTER_KEYS[f])}
            <span className={`text-xs ${filter === f ? 'opacity-70' : 'opacity-50'}`}>
              {f === 'all' ? 30 : PUZZLE_BANK.filter(p => p.difficulty === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map(puzzle => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            onSolvedChange={handleSolved}
          />
        ))}
      </div>
    </div>
  );
}
