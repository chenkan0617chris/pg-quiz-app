'use client';

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
  inputUnknown,
  outputUnknown,
  boxes,
  onInputOrderChange,
  onOutputOrderChange,
  onInputUnknownChange,
  onOutputUnknownChange,
  onBoxesChange,
}: {
  inputOrder: number[];
  outputOrder: number[];
  inputUnknown: boolean;
  outputUnknown: boolean;
  boxes: BoxInput[];
  onInputOrderChange: (value: number[]) => void;
  onOutputOrderChange: (value: number[]) => void;
  onInputUnknownChange: (value: boolean) => void;
  onOutputUnknownChange: (value: boolean) => void;
  onBoxesChange: (value: BoxInput[]) => void;
}) {
  const { t } = useI18n();

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

  const unknownControl = (
    checked: boolean,
    onChange: (value: boolean) => void,
  ) => (
    <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#526F82]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#1458C7]"
      />
      {t('unknown')}
    </label>
  );

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
            disabled={inputUnknown}
            controls={unknownControl(inputUnknown, onInputUnknownChange)}
            onChangeOrder={onInputOrderChange}
          />
        )}
        outputLane={(
          <PipelineShapeLane
            label={t('outputOrder')}
            lane="output"
            order={outputOrder}
            disabled={outputUnknown}
            controls={unknownControl(outputUnknown, onOutputUnknownChange)}
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
              valueEditor={(
                box.unknown ? (
                  <div className="flex items-center justify-center gap-2" aria-label={t('stageCandidates', index + 1)}>
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
                        className="h-12 w-[4.5rem] rounded-lg border-2 border-[#63BFDF] bg-[#83D0EB] text-center font-mono text-base font-bold tracking-[0.16em] text-[#31566B] shadow-[0_8px_16px_-11px_rgba(20,88,199,0.9)] outline-none transition placeholder:text-[#31566B]/55 focus:border-[#1458C7] focus:ring-2 focus:ring-[#79CDED] sm:w-[5.25rem] sm:text-lg"
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
                    className="w-28 bg-transparent text-center font-mono text-xl font-bold tracking-[0.25em] text-inherit outline-none placeholder:text-current placeholder:opacity-70"
                  />
                )
              )}
            >
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#526F82]">
                <input
                  type="checkbox"
                  checked={box.unknown}
                  onChange={(event) => updateBox(index, {
                    unknown: event.target.checked,
                    candidates: box.candidates ?? ['', '', ''],
                  })}
                  className="h-4 w-4 accent-[#1458C7]"
                />
                {t('unknown')}
              </label>
              <button
                type="button"
                disabled={boxes.length === 1}
                onClick={() => removeBox(index)}
                aria-label={t('remove')}
                title={t('remove')}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1458C7] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ✕
              </button>
            </PipelineStage>
          );
        })}
      </PipelineBoard>

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
