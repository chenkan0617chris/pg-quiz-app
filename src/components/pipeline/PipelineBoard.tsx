'use client';

import { Children, Fragment, useRef, useState, type Key, type ReactNode } from 'react';
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
      data-pipeline-funnel={direction}
      viewBox="0 0 400 48"
      preserveAspectRatio="none"
      className={`pointer-events-none relative z-0 h-12 w-full overflow-visible ${incoming ? 'mt-3' : 'mb-3'}`}
    >
      <path
        d={incoming ? 'M158 0h84l-22 34h-40z' : 'M180 7h40l22 34h-84z'}
        fill="#1761C9"
      />
      <rect
        x="186"
        y={incoming ? 30 : 1}
        width="28"
        height="11"
        rx="5"
        fill="#0F4EAC"
      />
      <g fill="#B9DDF8">
        {[192, 200, 208].map((x) => (
          <circle key={x} cx={x} cy={incoming ? 35.5 : 6.5} r="1.7" />
        ))}
      </g>
    </svg>
  );
}

export type PipelinePortCount = 1 | 3;

export function PipelineConnector({
  from,
  to,
}: {
  from: PipelinePortCount;
  to: PipelinePortCount;
}) {
  const paths = from === 1 && to === 1
    ? ['M200 0v64']
    : from === 1 && to === 3
      ? ['M200 0v14', 'M200 14c0 20-108 10-108 38v12', 'M200 14v50', 'M200 14c0 20 108 10 108 38v12']
      : from === 3 && to === 1
        ? ['M92 0v12c0 28 108 18 108 38v14', 'M200 0v64', 'M308 0v12c0 28-108 18-108 38v14']
        : ['M92 0v64', 'M200 0v64', 'M308 0v64'];

  return (
    <svg
      aria-hidden="true"
      data-pipeline-connector={`${from}-${to}`}
      viewBox="0 0 400 64"
      preserveAspectRatio="none"
      className="pointer-events-none h-12 w-full overflow-visible sm:h-14"
    >
      <g fill="none" stroke="#BFE8F8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7">
        {paths.map((path) => <path key={path} d={path} />)}
      </g>
    </svg>
  );
}

export function PipelineBoard({
  ariaLabel,
  inputLane,
  outputLane,
  children,
  stagePorts,
  className = '',
}: {
  ariaLabel: string;
  inputLane: ReactNode;
  outputLane: ReactNode;
  children: ReactNode;
  stagePorts?: PipelinePortCount[];
  className?: string;
}) {
  const stages = Children.toArray(children);
  const ports = stagePorts ?? stages.map(() => 1 as const);
  const firstPort = ports[0] ?? 1;
  const lastPort = ports.at(-1) ?? 1;

  return (
    <section
      role="group"
      aria-label={ariaLabel}
      data-pipeline-board
      className={`relative mx-auto w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-sky-100 bg-[#F8FBFE] px-3 py-6 shadow-[0_22px_60px_-38px_rgba(20,88,199,0.5)] sm:px-7 sm:py-8 ${className}`}
    >
      <div className="relative z-10">{inputLane}</div>
      <PipelineFunnel direction="in" />
      <PipelineConnector from={1} to={firstPort} />
      <div className="relative z-10 flex flex-col items-center">
        {stages.map((stage, index) => (
          <Fragment key={index}>
            {stage}
            {index < stages.length - 1 ? (
              <PipelineConnector from={ports[index] ?? 1} to={ports[index + 1] ?? 1} />
            ) : null}
          </Fragment>
        ))}
      </div>
      <PipelineConnector from={lastPort} to={1} />
      <PipelineFunnel direction="out" />
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

  const swapWith = (from: number, to: number) => {
    if (!onChangeOrder || from === to || to < 0 || to >= order.length) return;
    const next = order.slice();
    [next[from], next[to]] = [next[to], next[from]];
    onChangeOrder(next);
  };

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
      swapWith(from, to);
    }
    if (pointerTargetRef.current?.hasPointerCapture(event.pointerId)) {
      pointerTargetRef.current.releasePointerCapture(event.pointerId);
    }
    resetDrag();
  };

  return (
    <div
      data-pipeline-lane={lane}
      role="group"
      aria-label={label}
      className={`relative ${disabled ? 'opacity-45' : ''}`}
    >
      {controls ? <div className="absolute -top-1 right-1 z-20">{controls}</div> : null}
      <div
        ref={rowRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
        className="grid grid-cols-4 gap-2 sm:gap-4"
      >
        {order.map((id, index) => (
          <div
            key={id}
            data-order-index={index}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? `${t(shapeNameKey(id))}, ${t('position', index + 1)}` : undefined}
            onPointerDown={(event) => onPointerDown(event, index)}
            onKeyDown={(event) => {
              if (!interactive) return;
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                swapWith(index, index - 1);
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                swapWith(index, index + 1);
              }
            }}
            title={t(shapeNameKey(id))}
            className={[
              'mx-auto flex h-12 w-12 items-center justify-center rounded-[0.9rem] border border-white/80 bg-[#EEF1F3] shadow-[0_5px_12px_rgba(48,75,93,0.13)] transition sm:h-14 sm:w-14',
              interactive ? 'touch-none cursor-grab select-none active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1458C7]' : '',
              overIdx === index && dragIdx !== index ? 'scale-105 ring-3 ring-[#79CDED]' : '',
              highlight ? 'ring-2 ring-emerald-400' : '',
            ].join(' ')}
          >
            <Shape id={id} size={30} title={t(shapeNameKey(id))} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PipelineStage({
  label,
  state,
  ports = 1,
  valueEditor,
  children,
}: {
  label: string;
  state: PipelineStageState;
  ports?: PipelinePortCount;
  valueEditor?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      data-pipeline-stage
      data-stage-key={String(state.key)}
      data-stage-ports={ports}
      className="relative flex w-full flex-col items-center"
    >
      <div
        aria-label={label}
        className={[
          'relative flex items-center justify-center transition',
          ports === 3
            ? 'min-h-12 w-full bg-transparent'
            : 'min-h-14 min-w-36 rounded-xl border-2 border-[#70C4E5] bg-[#8BD5F0] px-5 py-2.5 text-[#31566B] shadow-[0_9px_18px_-12px_rgba(20,88,199,0.8)]',
          ports === 1 && state.unknown ? 'border-[#0F4EAC] bg-[#1458C7] text-white' : '',
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
