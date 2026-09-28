'use client';

import { Children, Fragment, useId, useRef, useState, type Key, type ReactNode } from 'react';
import { Shape } from '@/lib/shapes';
import { shapeNameKey, useI18n } from '@/lib/i18n';
import styles from './PipelineBoard.module.css';

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
      className={`${styles.funnel} ${incoming ? 'mt-3' : 'mb-3'}`}
    >
      <path
        d={incoming ? 'M171 6h58l-20 33h-18z' : 'M191 9h18l20 33h-58z'}
        fill="#31A9EF"
      />
      <rect x="170" y={incoming ? 0 : 39} width="60" height="9" rx="2" fill="#204FC1" />
      <rect x="189" y={incoming ? 39 : 0} width="22" height="9" rx="2" fill="#204FC1" />
      <g fill="#D4EEFF">
        {[177, 186, 195, 204, 213, 222].map((x) => (
          <circle key={x} cx={x} cy={incoming ? 4.5 : 43.5} r="1.4" />
        ))}
        {[193, 200, 207].map((x) => (
          <circle key={x} cx={x} cy={incoming ? 43.5 : 4.5} r="1.4" />
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
  const stripeId = useId();
  const paths = from === 1 && to === 1
    ? ['M200 0v32']
    : from === 1 && to === 3
      ? ['M200 0V16H102Q90 16 90 28V32', 'M200 16V32', 'M200 16H298Q310 16 310 28V32']
      : from === 3 && to === 1
        ? ['M90 0V4Q90 16 102 16H200V32', 'M200 0V32', 'M310 0V4Q310 16 298 16H200']
        : ['M90 0v32', 'M200 0v32', 'M310 0v32'];

  return (
    <svg
      aria-hidden="true"
      data-pipeline-connector={`${from}-${to}`}
      viewBox="0 0 400 32"
      preserveAspectRatio="none"
      className={styles.connector}
    >
      <defs>
        <pattern id={stripeId} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="12" height="12" fill={from === 1 && to === 1 ? '#38ACEB' : '#B6E6F3'} />
          <rect width="2" height="12" fill="#FFFFFF" fillOpacity="0.75" />
        </pattern>
      </defs>
      <g fill="none" stroke={`url(#${stripeId})`} strokeLinecap="butt" strokeLinejoin="round" strokeWidth="11">
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
      className={`${styles.board} ${className}`}
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
  onChangeOrder,
  highlight = false,
}: {
  label: string;
  lane: 'input' | 'output';
  order: number[];
  disabled?: boolean;
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

  const positions = (
    <div className={`${styles.shapeRow} text-center font-mono text-[10px] text-slate-400`}>
      {[1, 2, 3, 4].map((position) => (
        <span key={position} aria-label={t('position', position)}>{position}</span>
      ))}
    </div>
  );

  return (
    <div
      data-pipeline-lane={lane}
      role="group"
      aria-label={label}
      className={`relative ${disabled ? 'opacity-45' : ''}`}
    >
      {lane === 'input' ? <div className="mb-1">{positions}</div> : null}
      <div
        ref={rowRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
        className={styles.shapeRow}
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
              styles.shapeTile,
              interactive ? 'touch-none cursor-grab select-none active:cursor-grabbing focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1458C7]' : '',
              overIdx === index && dragIdx !== index ? 'scale-105 ring-3 ring-[#79CDED]' : '',
              highlight ? 'ring-2 ring-emerald-400' : '',
            ].join(' ')}
          >
            <Shape id={id} size={40} variant="pipeline" title={t(shapeNameKey(id))} />
          </div>
        ))}
      </div>
      {lane === 'output' ? <div className="mt-1">{positions}</div> : null}
    </div>
  );
}

export function PipelineStage({
  label,
  state,
  ports = 1,
  valueEditor,
  children,
  annotation,
}: {
  label: string;
  state: PipelineStageState;
  ports?: PipelinePortCount;
  valueEditor?: ReactNode;
  children?: ReactNode;
  annotation?: ReactNode;
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
            ? 'min-h-11 w-full bg-transparent'
            : styles.stageValue,
          state.solved ? 'ring-3 ring-emerald-400 ring-offset-2' : '',
          state.active ? 'scale-[1.03] ring-3 ring-indigo-400 ring-offset-2' : '',
        ].join(' ')}
      >
        {valueEditor ?? (
          <span className={styles.digits} aria-label={`${label}: ${state.value}`}>
            {state.value || (state.unknown ? '????' : '____')}
          </span>
        )}
      </div>
      {annotation}
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
