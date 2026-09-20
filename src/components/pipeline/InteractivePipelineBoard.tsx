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
        <h3 className="rounded-full border border-sky-100 bg-white/90 px-4 py-1.5 text-xs font-bold tracking-[0.12em] text-[#31566B] shadow-sm">
          {t('pipelineBoxes')}
        </h3>
        {boxes.map((box, index) => {
          const label = t('pipelineStage', index + 1);
          return (
            <PipelineStage
              key={index}
              label={label}
              state={{ key: index, value: box.value, unknown: box.unknown }}
              valueEditor={(
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[1-4]*"
                  maxLength={4}
                  value={box.value}
                  disabled={box.unknown}
                  onChange={(event) => updateBox(index, {
                    value: event.target.value.replace(/[^1-4]/g, ''),
                  })}
                  placeholder={box.unknown ? '????' : '____'}
                  aria-label={label}
                  className="w-28 bg-transparent text-center font-mono text-xl font-bold tracking-[0.25em] text-inherit outline-none placeholder:text-current placeholder:opacity-70 disabled:cursor-not-allowed"
                />
              )}
            >
              <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#526F82]">
                <input
                  type="checkbox"
                  checked={box.unknown}
                  onChange={(event) => updateBox(index, { unknown: event.target.checked })}
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
          onClick={() => onBoxesChange([...boxes, { value: '', unknown: false }])}
          className="rounded-full border border-dashed border-[#79CDED] bg-sky-50 px-5 py-2 text-sm font-bold text-[#1458C7] transition hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1458C7]"
        >
          {t('addBox')}
        </button>
        <p className="text-xs text-slate-400">{t('boxUnknownHint')}</p>
      </div>
    </div>
  );
}
