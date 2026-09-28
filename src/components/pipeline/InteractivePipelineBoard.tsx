'use client';

import { useId } from 'react';
import styles from './PipelineBoard.module.css';
import type { BoxInput } from '@/lib/engine';
import { useI18n } from '@/lib/i18n';
import {
  PipelineBoard,
  PipelineShapeLane,
  PipelineStage,
} from './PipelineBoard';

export default function InteractivePipelineBoard({
  inputOrder,
  outputOrder,
  boxes,
  onInputOrderChange,
  onOutputOrderChange,
  onBoxesChange,
}: {
  inputOrder: number[];
  outputOrder: number[];
  boxes: BoxInput[];
  onInputOrderChange: (value: number[]) => void;
  onOutputOrderChange: (value: number[]) => void;
  onBoxesChange: (value: BoxInput[]) => void;
}) {
  const { t, lang } = useI18n();
  const hintId = useId();
  const candidatesRequired = boxes.filter((box) => box.unknown).length > 1;
  const candidateRequirement = candidatesRequired
    ? (lang === 'zh' ? '必填' : 'Required')
    : (lang === 'zh' ? '可选' : 'Optional');

  const updateBox = (index: number, patch: Partial<BoxInput>) => {
    onBoxesChange(boxes.map((box, i) => (i === index ? { ...box, ...patch } : box)));
  };
  const updateCandidate = (boxIndex: number, candidateIndex: number, value: string) => {
    const candidates = [...(boxes[boxIndex].candidates ?? ['', '', ''])];
    candidates[candidateIndex] = value;
    updateBox(boxIndex, { candidates });
  };
  const removeBox = (index: number) => {
    if (boxes.length === 1) return;
    onBoxesChange(boxes.filter((_, i) => i !== index));
  };

  return (
    <div>
      <PipelineBoard
        ariaLabel={t('pipelineDiagram')}
        stagePorts={boxes.map((box) => box.unknown ? 3 : 1)}
        inputLane={(
          <PipelineShapeLane
            label={t('inputOrder')}
            lane="input"
            order={inputOrder}
            onChangeOrder={onInputOrderChange}
          />
        )}
        outputLane={(
          <PipelineShapeLane
            label={t('outputOrder')}
            lane="output"
            order={outputOrder}
            onChangeOrder={onOutputOrderChange}
          />
        )}
      >
        {boxes.map((box, index) => {
          const label = t('pipelineStage', index + 1);
          const candidates = box.candidates ?? ['', '', ''];
          return (
            <PipelineStage
              key={index}
              label={label}
              state={{ key: index, value: box.value, unknown: box.unknown }}
              ports={box.unknown ? 3 : 1}
              annotation={box.unknown ? (
                <span id={`${hintId}-${index}`} className={styles.requirement}>
                  {candidateRequirement}
                </span>
              ) : undefined}
              valueEditor={(
                box.unknown ? (
                  <div className={styles.candidates} aria-label={t('stageCandidates', index + 1)}>
                    {candidates.map((candidate, candidateIndex) => (
                      <input
                        key={candidateIndex}
                        type="text"
                        inputMode="numeric"
                        pattern="[1-4]*"
                        maxLength={4}
                        value={candidate}
                        onChange={(event) => updateCandidate(
                          index,
                          candidateIndex,
                          event.target.value.replace(/[^1-4]/g, ''),
                        )}
                        placeholder="____"
                        aria-label={t('stageCandidate', index + 1)}
                        aria-describedby={`${hintId}-${index}`}
                        aria-required={candidatesRequired}
                        className={`${styles.candidate} ${styles.digits}`}
                      />
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-4]*"
                    maxLength={4}
                    value={box.value}
                    onChange={(event) => updateBox(index, {
                      value: event.target.value.replace(/[^1-4]/g, ''),
                    })}
                    placeholder="____"
                    aria-label={label}
                    className={`${styles.knownInput} ${styles.digits}`}
                  />
                )
              )}
            />
          );
        })}
      </PipelineBoard>

      <div className="mx-auto mt-3 max-w-[360px] border-t border-slate-100 pt-2">
        {boxes.map((box, index) => (
          <div key={index} role="group" aria-label={`${t('pipelineStage', index + 1)} ${lang === 'zh' ? '设置' : 'settings'}`} className="flex items-center gap-3 px-2">
            <span className="mr-auto text-xs text-slate-400">{t('pipelineStage', index + 1)}</span>
            <label className="flex min-h-9 cursor-pointer items-center gap-1.5 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={box.unknown}
                onChange={(event) => updateBox(index, {
                  unknown: event.target.checked,
                  candidates: box.candidates ?? ['', '', ''],
                })}
                aria-label={`${t('pipelineStage', index + 1)}: ${t('unknown')}`}
                className="h-3.5 w-3.5 accent-[#204FC1]"
              />
              {t('unknown')}
            </label>
            <button
              type="button"
              disabled={boxes.length === 1}
              onClick={() => removeBox(index)}
              aria-label={`${t('remove')} ${index + 1}`}
              title={t('remove')}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1458C7] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onBoxesChange([
            ...boxes,
            { value: '', unknown: false, candidates: ['', '', ''] },
          ])}
          className="rounded-full border border-dashed border-[#79CDED] bg-sky-50 px-5 py-2 text-sm font-bold text-[#1458C7] transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1458C7]"
        >
          {t('addBox')}
        </button>
        <p className="text-xs text-slate-400">{t('boxUnknownHint')}</p>
      </div>
    </div>
  );
}
