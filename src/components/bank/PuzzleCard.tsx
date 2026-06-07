'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Shape } from '@/lib/shapes';
import type { BankPuzzle, Difficulty } from '@/lib/puzzleBank';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const DIFF_STYLE: Record<Difficulty, string> = {
  easy:   'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  medium: 'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
  hard:   'bg-rose-50   text-rose-700   ring-1 ring-rose-200',
};

/** A row of 4 shape icons. */
function ShapeRow({ ids, size = 22 }: { ids: number[]; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {ids.map((id, i) => <Shape key={i} id={id} size={size} />)}
    </div>
  );
}

/** One pipeline box node: known shows the perm string, unknown shows "?". */
function BoxNode({ value, solvedValue }: { value: string | null; solvedValue?: string }) {
  if (value === null) {
    return (
      <div className={[
        'flex h-8 items-center justify-center rounded-lg px-3 font-mono text-sm font-bold tracking-widest',
        solvedValue ? 'bg-indigo-600 text-white shadow' : 'border-2 border-dashed border-indigo-300 text-indigo-300',
      ].join(' ')}>
        {solvedValue ?? '?'}
      </div>
    );
  }
  return (
    <div className="flex h-8 items-center justify-center rounded-lg bg-slate-100 px-3 font-mono text-sm font-semibold tracking-widest text-slate-700">
      {value}
    </div>
  );
}

export default function PuzzleCard({
  puzzle,
  onSolvedChange,
}: {
  puzzle: BankPuzzle;
  onSolvedChange?: (id: number, correct: boolean) => void;
}) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);

  const answered = selected !== null;
  const correct = selected === puzzle.answer;

  const pick = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    onSolvedChange?.(puzzle.id, opt === puzzle.answer);
  };

  const diffKey = puzzle.difficulty === 'easy' ? 'bankEasy' : puzzle.difficulty === 'medium' ? 'bankMedium' : 'bankHard';

  return (
    <div className={[
      'flex flex-col rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
      answered && correct  ? 'border-emerald-200' :
      answered && !correct ? 'border-rose-200' :
                             'border-gray-200',
    ].join(' ')}>

      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400">#{puzzle.id}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${DIFF_STYLE[puzzle.difficulty]}`}>
          {t(diffKey)}
        </span>
      </div>

      {/* pipeline visual */}
      <div className="flex flex-col items-center gap-1.5">
        {/* input */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-gray-400">{t('bankInput')}</span>
          <ShapeRow ids={puzzle.inputOrder} />
        </div>

        {/* boxes with arrows */}
        {puzzle.boxes.map((box, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-gray-300 text-sm">↓</span>
            <BoxNode
              value={box}
              solvedValue={answered && box === null ? puzzle.answer : undefined}
            />
          </div>
        ))}

        {/* output */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-gray-300 text-sm">↓</span>
          <span className="text-[10px] text-gray-400">{t('bankOutput')}</span>
          <ShapeRow ids={puzzle.outputOrder} />
        </div>
      </div>

      {/* divider */}
      <div className="my-3 border-t border-gray-100" />

      {/* options */}
      <div className="grid grid-cols-2 gap-2">
        {puzzle.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isAnswer = opt === puzzle.answer;
          let cls = 'rounded-lg border px-2 py-1.5 text-center font-mono text-sm font-semibold tracking-widest transition ';
          if (!answered) {
            cls += 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer';
          } else if (isSelected && correct) {
            cls += 'border-emerald-400 bg-emerald-50 text-emerald-700';
          } else if (isSelected && !correct) {
            cls += 'border-rose-400 bg-rose-50 text-rose-700';
          } else if (!isSelected && isAnswer && !correct) {
            cls += 'border-emerald-400 bg-emerald-50 text-emerald-700';
          } else {
            cls += 'border-gray-100 bg-gray-50 text-gray-300';
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => pick(opt)}
              className={cls}
            >
              <span className="mr-1 text-[10px] font-normal text-current opacity-60">{OPTION_LABELS[i]}</span>
              {opt}
              {answered && isAnswer && <span className="ml-1 text-[11px]">✓</span>}
              {answered && isSelected && !correct && <span className="ml-1 text-[11px]">✗</span>}
            </button>
          );
        })}
      </div>

      {/* result label */}
      {answered && (
        <p className={`mt-2 text-center text-xs font-semibold ${correct ? 'text-emerald-600' : 'text-rose-500'}`}>
          {correct ? t('bankCorrect') : t('bankWrong')}
        </p>
      )}
    </div>
  );
}
