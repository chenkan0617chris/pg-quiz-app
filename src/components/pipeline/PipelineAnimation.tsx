'use client';

import { useEffect, useMemo, useState } from 'react';
import { Shape } from '@/lib/shapes';
import { shapeNameKey, useI18n } from '@/lib/i18n';

/**
 * Step-by-step animation of shapes travelling through a Switch Challenge pipeline.
 *
 * A box code such as 2314 means "new position 1 takes the shape from old
 * position 2, new position 2 from old position 3 …". The animation moves the
 * four shapes one at a time from the row above a box to the row below it, with
 * an arrow from where each shape comes from to where it lands, so the meaning
 * of every digit is visible. Rows already passed keep faded copies, so the whole
 * history stays on screen, and the final row turns green when it reaches the output.
 */

export type AnimationStage = { box: number[]; unknown?: boolean };

type Event =
  | { type: 'start' }
  | { type: 'stage'; stage: number }
  | { type: 'move'; stage: number; slot: number }
  | { type: 'done' };

const TILE = 44;
const ROW_H = 56; // tile row
const BOX_H = 40; // box band between rows
const GAP = 14;
const COLS = [12.5, 37.5, 62.5, 87.5]; // column centres, % of width
const SPEEDS = [{ ms: 950, label: '1×' }, { ms: 1900, label: '0.5×' }];

const rowTop = (row: number) => 22 + row * (ROW_H + BOX_H + GAP * 2);
const boxTop = (stage: number) => rowTop(stage) + ROW_H + GAP;

export default function PipelineAnimation({
  input,
  stages,
  autoPlay = false,
}: {
  input: number[];
  stages: AnimationStage[];
  autoPlay?: boolean;
}) {
  const { t, lang } = useI18n();
  const zh = lang === 'zh';

  // rows[r] is the order of shapes above box r; rows[stages.length] is the output.
  const rows = useMemo(() => {
    const out = [input];
    for (const stage of stages) out.push(stage.box.map((src) => out[out.length - 1][src - 1]));
    return out;
  }, [input, stages]);

  const events = useMemo<Event[]>(() => {
    const list: Event[] = [{ type: 'start' }];
    stages.forEach((_, stage) => {
      list.push({ type: 'stage', stage });
      for (let slot = 0; slot < 4; slot++) list.push({ type: 'move', stage, slot });
    });
    list.push({ type: 'done' });
    return list;
  }, [stages]);

  const last = events.length - 1;
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTick((current) => {
        if (current >= last) { setPlaying(false); return current; }
        return current + 1;
      });
    }, SPEEDS[speed].ms);
    return () => window.clearInterval(timer);
  }, [playing, speed, last]);

  // When did each shape arrive in row r+1? (index in events)
  const moveTick = (stage: number, slot: number) => 1 + stage * 5 + 1 + slot;

  // Where is each shape at this tick?
  const positions = useMemo(() => {
    const pos = new Map<number, { row: number; col: number }>();
    rows[0].forEach((id, col) => pos.set(id, { row: 0, col }));
    for (let stage = 0; stage < stages.length; stage++) {
      for (let slot = 0; slot < 4; slot++) {
        if (moveTick(stage, slot) <= tick) pos.set(rows[stage + 1][slot], { row: stage + 1, col: slot });
      }
    }
    return pos;
  }, [rows, stages.length, tick]);

  const event = events[tick];
  const activeStage = event.type === 'stage' || event.type === 'move' ? event.stage : null;
  const move = event.type === 'move' ? event : null;
  const movingId = move ? rows[move.stage + 1][move.slot] : null;
  const fromCol = move ? stages[move.stage].box[move.slot] - 1 : null;
  const done = event.type === 'done';
  const height = rowTop(stages.length) + ROW_H + 22;
  const shapeName = (id: number) => t(shapeNameKey(id));
  const revealed = (stage: number) => !stages[stage].unknown || tick >= 1 + stage * 5;

  let caption: string;
  if (event.type === 'start') {
    caption = zh ? '起点：题目给出的输入顺序。点「播放」看图形逐个移动。' : 'Start: the input order from the question. Press Play to watch each shape move.';
  } else if (event.type === 'stage') {
    const code = stages[event.stage].box.join('');
    caption = stages[event.stage].unknown
      ? (zh ? `方框 ${event.stage + 1} 是未知方框，答案是 ${code}。每一位数字表示：新位置从原来第几位取图形。` : `Box ${event.stage + 1} is the unknown box: its answer is ${code}. Each digit says which old position the new position takes its shape from.`)
      : (zh ? `方框 ${event.stage + 1} · ${code}：每一位数字表示新位置从原来第几位取图形。` : `Box ${event.stage + 1} · ${code}: each digit says which old position the new position takes its shape from.`);
  } else if (event.type === 'move') {
    const from = stages[event.stage].box[event.slot];
    caption = zh
      ? `新第 ${event.slot + 1} 位 ← 原第 ${from} 位：${shapeName(movingId!)}`
      : `New position ${event.slot + 1} ← old position ${from}: ${shapeName(movingId!)}`;
  } else {
    caption = zh ? '完成：最后一排就是输出顺序 ✓' : 'Done: the last row is the output order ✓';
  }

  const stageStart = (stage: number) => 1 + stage * 5;
  const go = (next: number) => { setPlaying(false); setTick(Math.max(0, Math.min(last, next))); };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    setTick((current) => (current >= last ? 0 : current + 1));
    setPlaying(true);
  };

  const btn = 'cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-default disabled:opacity-40';

  return (
    <div className="pipeline-animation rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
      <style>{`
        .pipeline-animation .pa-move { transition: left 600ms cubic-bezier(.4,0,.2,1), top 600ms cubic-bezier(.4,0,.2,1), box-shadow 200ms; }
        @media (prefers-reduced-motion: reduce) { .pipeline-animation .pa-move { transition: none; } }
      `}</style>

      {/* Progress: Input → Box 1 → … → Output */}
      <div className="mb-3 flex flex-wrap items-center gap-1 text-xs">
        {[
          { label: zh ? '输入' : 'Input', at: 0, on: tick === 0 },
          ...stages.map((_, stage) => ({ label: zh ? `方框 ${stage + 1}` : `Box ${stage + 1}`, at: stageStart(stage), on: activeStage === stage })),
          { label: zh ? '输出' : 'Output', at: last, on: done },
        ].map((step, index, all) => (
          <span key={index} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(step.at)}
              className={`cursor-pointer rounded-full px-2.5 py-1 font-medium transition ${step.on ? 'bg-indigo-600 text-white' : tick > step.at ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}
            >
              {step.label}
            </button>
            {index < all.length - 1 && <span aria-hidden className="text-slate-300">→</span>}
          </span>
        ))}
      </div>

      <div
        role="img"
        aria-label={zh ? '图形流动动画' : 'Shape flow animation'}
        className="relative mx-auto w-full max-w-[340px] select-none"
        style={{ height }}
      >
        {/* Position numbers */}
        {COLS.map((x, col) => (
          <span key={col} className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-slate-400" style={{ left: `${x}%` }}>{col + 1}</span>
        ))}

        {/* Empty slots for every row */}
        {rows.map((_, row) => COLS.map((x, col) => (
          <span
            key={`slot-${row}-${col}`}
            className={`absolute rounded-xl border-2 border-dashed ${done && row === stages.length ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}
            style={{ left: `calc(${x}% - ${TILE / 2}px)`, top: rowTop(row) + (ROW_H - TILE) / 2, width: TILE, height: TILE }}
          />
        )))}

        {/* Faded copies left behind in rows the shapes have already moved on from */}
        {rows.slice(0, -1).map((seq, row) => seq.map((id, col) => {
          const slot = rows[row + 1].indexOf(id);
          if (moveTick(row, slot) > tick) return null;
          return (
            <span
              key={`ghost-${row}-${col}`}
              className="absolute flex items-center justify-center opacity-30"
              style={{ left: `calc(${COLS[col]}% - ${TILE / 2}px)`, top: rowTop(row) + (ROW_H - TILE) / 2, width: TILE, height: TILE }}
            >
              <Shape id={id} size={26} variant="pipeline" />
            </span>
          );
        }))}

        {/* Boxes, with each digit under the column it feeds */}
        {stages.map((stage, index) => {
          const active = activeStage === index;
          const show = revealed(index);
          return (
            <div
              key={`box-${index}`}
              className={`absolute inset-x-0 rounded-lg transition ${active ? 'bg-sky-200 ring-2 ring-indigo-400' : 'bg-sky-100'} ${stage.unknown && show ? 'ring-2 ring-emerald-400' : ''}`}
              style={{ top: boxTop(index), height: BOX_H }}
            >
              <span className="absolute -left-1 top-1/2 -translate-x-full -translate-y-1/2 pr-1 text-[10px] text-slate-400 max-sm:hidden">{zh ? `方框${index + 1}` : `Box ${index + 1}`}</span>
              {stage.box.map((digit, col) => (
                <span
                  key={col}
                  className={`absolute top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md font-mono text-base font-bold transition ${
                    move && move.stage === index && move.slot === col ? 'scale-110 bg-indigo-600 text-white' : stage.unknown && show ? 'text-emerald-700' : 'text-[#1458C7]'
                  }`}
                  style={{ left: `${COLS[col]}%` }}
                >
                  {show ? digit : '?'}
                </span>
              ))}
            </div>
          );
        })}

        {/* Arrow for the current move: from the old position above to the new one below */}
        {move && fromCol !== null && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <marker id="pa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#4f46e5" />
              </marker>
            </defs>
            <line
              x1={`${COLS[fromCol]}%`} y1={rowTop(move.stage) + ROW_H - 4}
              x2={`${COLS[move.slot]}%`} y2={rowTop(move.stage + 1) + 4}
              stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#pa-arrow)"
            />
          </svg>
        )}

        {/* The four moving shapes */}
        {rows[0].map((id) => {
          const p = positions.get(id)!;
          const isMoving = id === movingId;
          const atOutput = done && p.row === stages.length;
          return (
            <span
              key={id}
              title={shapeName(id)}
              className={`pa-move absolute z-10 flex items-center justify-center rounded-xl bg-white shadow-sm ${isMoving ? 'z-20 ring-3 ring-indigo-500 shadow-lg' : atOutput ? 'ring-2 ring-emerald-500' : 'ring-1 ring-slate-200'}`}
              style={{ left: `calc(${COLS[p.col]}% - ${TILE / 2}px)`, top: rowTop(p.row) + (ROW_H - TILE) / 2, width: TILE, height: TILE }}
            >
              <Shape id={id} size={28} variant="pipeline" title={shapeName(id)} />
            </span>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-3 min-h-10 rounded-lg bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">{caption}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => go(tick - 1)} disabled={tick === 0} className={btn}>{zh ? '上一步' : 'Back'}</button>
        <button type="button" onClick={togglePlay} className="min-w-24 cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          {playing ? (zh ? '暂停' : 'Pause') : tick >= last ? (zh ? '重播' : 'Replay') : (zh ? '播放' : 'Play')}
        </button>
        <button type="button" onClick={() => go(tick + 1)} disabled={tick >= last} className={btn}>{zh ? '下一步' : 'Next'}</button>
        <button type="button" onClick={() => setSpeed((speed + 1) % SPEEDS.length)} className={`${btn} ml-auto`} aria-label={zh ? `速度 ${SPEEDS[speed].label}` : `Speed ${SPEEDS[speed].label}`}>
          {zh ? '速度' : 'Speed'} {SPEEDS[speed].label}
        </button>
      </div>
    </div>
  );
}
