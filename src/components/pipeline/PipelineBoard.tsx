'use client';

import { useRef, useState, type Key, type ReactNode } from 'react';
import { Shape } from '@/lib/shapes';
import { shapeNameKey, useI18n } from '@/lib/i18n';

export type PipelineStageState = {
  key: Key;
  value: string;
  unknown?: boolean;
  solved?: boolean;
  active?: boolean;
};

function PipelineFunnel({ direction }: { direction: 'in' | 'out' }) {
  const incoming = direction === 'in';
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 260 82"
      className="pointer-events-none relative z-0 h-[70px] w-[min(100%,260px)] overflow-visible"
    >
      <g
        fill="none"
        stroke="#BFE8F8"
        strokeLinecap="round"
        strokeWidth="8"
        opacity="0.9"
      >
        {incoming ? (
          <>
            <path d="M24 2v16c0 18 36 10 70 34" />
            <path d="M94 2v16c0 14 17 18 28 34" />
            <path d="M166 2v16c0 14-17 18-28 34" />
            <path d="M236 2v16c0 18-36 10-70 34" />
          </>
        ) : (
          <>
            <path d="M94 30C60 54 24 46 24 64v16" />
            <path d="M122 30c-11 16-28 20-28 34v16" />
            <path d="M138 30c11 16 28 20 28 34v16" />
            <path d="M166 30c34 24 70 16 70 34v16" />
          </>
        )}
      </g>
      <path
        d={incoming ? 'M91 18h78l-20 35h-38z' : 'M111 29h38l20 35H91z'}
        fill="#1761C9"
      />
      <rect
        x="116"
        y={incoming ? 49 : 20}
        width="28"
        height="12"
        rx="5"
        fill="#0F4EAC"
      />
      <g fill="#B9DDF8">
        {[122, 130, 138].map((x) => (
          <circle key={x} cx={x} cy={incoming ? 55 : 26} r="1.7" />
        ))}
      </g>
    </svg>
  );
}

export function PipelineBoard({
  ariaLabel,
  inputLane,
  outputLane,
  children,
  className = '',
}: {
  ariaLabel: string;
  inputLane: ReactNode;
  outputLane: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      role="group"
      aria-label={ariaLabel}
      data-pipeline-board
      className={`relative mx-auto w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-sky-100 bg-[#F8FBFE] px-3 py-6 shadow-[0_22px_60px_-38px_rgba(20,88,199,0.5)] sm:px-7 sm:py-8 ${className}`}
    >
      <div className="relative z-10">{inputLane}</div>
      <div className="flex justify-center"><PipelineFunnel direction="in" /></div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <span className="absolute top-0 bottom-0 left-1/2 -z-10 w-2 -translate-x-1/2 rounded-full bg-[#BFE8F8]" aria-hidden="true" />
        {children}
      </div>
      <div className="flex justify-center"><PipelineFunnel direction="out" /></div>
      <div className="relative z-10">{outputLane}</div>
    </section>
  );
}

export function PipelineShapeLane({
  label,
  lane,
  order,
  disabled = false,
  controls,
  onChangeOrder,
  highlight = false,
}: {
  label: string;
  lane: 'input' | 'output';
  order: number[];
  disabled?: boolean;
  controls?: ReactNode;
  onChangeOrder?: (next: number[]) => void;
  highlight?: boolean;
}) {
  const { t } = useI18n();
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragIdxRef = useRef<number | null>(null);
  const overIdxRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<HTMLElement | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const interactive = Boolean(onChangeOrder) && !disabled;

  const resetDrag = () => {
    dragIdxRef.current = null;
    overIdxRef.current = null;
    pointerIdRef.current = null;
    pointerTargetRef.current = null;
    setDragIdx(null);
    setOverIdx(null);
  };

  const indexAtPointer = (event: React.PointerEvent) => {
    const pointedAt = document.elementFromPoint(event.clientX, event.clientY) ?? event.target;
    const item = pointedAt instanceof Element
      ? pointedAt.closest<HTMLElement>('[data-order-index]')
      : null;
    if (!item || !rowRef.current?.contains(item)) return null;
    const index = Number(item.dataset.orderIndex);
    return Number.isInteger(index) ? index : null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (!interactive || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    dragIdxRef.current = index;
    overIdxRef.current = index;
    pointerIdRef.current = event.pointerId;
    pointerTargetRef.current = event.currentTarget;
    setDragIdx(index);
    setOverIdx(index);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Programmatically-dispatched pointer events do not create a capturable pointer.
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId || dragIdxRef.current === null) return;
    event.preventDefault();
    const nextOver = indexAtPointer(event);
    if (nextOver === null || nextOver === overIdxRef.current) return;
    overIdxRef.current = nextOver;
    setOverIdx(nextOver);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId || !onChangeOrder) return;
    event.preventDefault();
    const from = dragIdxRef.current;
    const to = indexAtPointer(event) ?? overIdxRef.current;
    if (from !== null && to !== null && from !== to) {
      const next = order.slice();
      [next[from], next[to]] = [next[to], next[from]];
      onChangeOrder(next);
    }
    if (pointerTargetRef.current?.hasPointerCapture(event.pointerId)) {
      pointerTargetRef.current.releasePointerCapture(event.pointerId);
    }
    resetDrag();
  };

  const positions = (
    <div className="grid grid-cols-4 gap-2 px-1 text-center font-mono text-[11px] font-bold tracking-[0.2em] text-[#648399] sm:gap-4">
      {[1, 2, 3, 4].map((position) => (
        <span key={position} aria-label={t('position', position)}>{position}</span>
      ))}
    </div>
  );

  return (
    <div
      data-pipeline-lane={lane}
      className={disabled ? 'opacity-45' : ''}
    >
      <div className="mb-3 flex min-h-7 items-center justify-between gap-3 px-1">
        <h3 className="text-sm font-bold tracking-wide text-[#31566B]">{label}</h3>
        {controls}
      </div>
      {lane === 'input' && positions}
      <div
        ref={rowRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
        className="mt-1 grid grid-cols-4 gap-2 sm:gap-4"
      >
        {order.map((id, index) => (
          <div
            key={id}
            data-order-index={index}
            onPointerDown={(event) => onPointerDown(event, index)}
            title={t(shapeNameKey(id))}
            className={[
              'mx-auto flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-white/80 bg-[#EEF1F3] shadow-[0_5px_12px_rgba(48,75,93,0.13)] transition sm:h-14 sm:w-14',
              interactive ? 'touch-none cursor-grab select-none active:cursor-grabbing' : '',
              overIdx === index && dragIdx !== index ? 'scale-105 ring-3 ring-[#79CDED]' : '',
              highlight ? 'ring-2 ring-emerald-400' : '',
            ].join(' ')}
          >
            <Shape id={id} size={30} title={t(shapeNameKey(id))} />
          </div>
        ))}
      </div>
      {lane === 'output' && <div className="mt-1">{positions}</div>}
    </div>
  );
}

export function PipelineStage({
  label,
  state,
  valueEditor,
  children,
}: {
  label: string;
  state: PipelineStageState;
  valueEditor?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div data-pipeline-stage data-stage-key={String(state.key)} className="relative flex w-full flex-col items-center">
      <div className="pointer-events-none absolute top-7 left-[12%] right-[12%] -z-10 h-8 rounded-b-[1.5rem] border-r-[7px] border-b-[7px] border-l-[7px] border-[#BFE8F8]" aria-hidden="true" />
      <div
        aria-label={label}
        className={[
          'relative flex min-h-14 min-w-36 items-center justify-center rounded-xl border-2 px-5 py-2.5 shadow-[0_9px_18px_-12px_rgba(20,88,199,0.8)] transition',
          state.unknown ? 'border-[#0F4EAC] bg-[#1458C7] text-white' : 'border-[#70C4E5] bg-[#8BD5F0] text-[#31566B]',
          state.solved ? 'ring-3 ring-emerald-400 ring-offset-2' : '',
          state.active ? 'scale-[1.03] ring-3 ring-indigo-400 ring-offset-2' : '',
        ].join(' ')}
      >
        {valueEditor ?? (
          <span className="font-mono text-xl font-bold tracking-[0.28em]" aria-label={`${label}: ${state.value}`}>
            {state.value || (state.unknown ? '????' : '____')}
          </span>
        )}
      </div>
      {children && (
        <div className="mt-3 flex max-w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-sky-100 bg-white/90 px-3 py-2 shadow-sm">
          {children}
        </div>
      )}
    </div>
  );
}

export function PipelineAnswerInputs({
  values,
  disabled = false,
  onChange,
  labels,
}: {
  values: string[];
  disabled?: boolean;
  onChange: (index: number, value: string) => void;
  labels: string[];
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  return (
    <div className="flex gap-1.5">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(node) => { refs.current[index] = node; }}
          aria-label={labels[index]}
          inputMode="numeric"
          pattern="[1-4]"
          maxLength={1}
          required
          disabled={disabled}
          value={value}
          onChange={(event) => {
            const next = event.target.value.replace(/[^1-4]/g, '').slice(-1);
            onChange(index, next);
            if (next && index < values.length - 1) refs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !value && index > 0) refs.current[index - 1]?.focus();
          }}
          className="h-9 w-8 rounded-md border border-white/40 bg-white/15 text-center font-mono text-lg font-bold text-white outline-none transition focus:bg-white/25 focus:ring-2 focus:ring-white disabled:opacity-60 sm:w-9"
        />
      ))}
    </div>
  );
}
