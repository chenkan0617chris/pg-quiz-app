'use client';

import { useEffect, useState } from 'react';
import { MEMORY_POINTS } from '@/lib/memory-layout';

type Props = {
  sequence: number[];
  zh: boolean;
  disabled?: boolean;
  review?: boolean;
  autoPlay?: boolean;
  preview?: boolean;
  onAnswer?: (answer: number[]) => void;
};

/** Positions are stable between observation and recall; each round has its own keyed instance. */
export default function MemoryBoard({ sequence, zh, disabled = false, review = false, autoPlay = false, preview = false, onAnswer }: Props) {
  const [phase, setPhase] = useState<'ready' | 'watch' | 'recall' | 'done'>(autoPlay ? 'watch' : 'ready');
  const [tick, setTick] = useState(-1);
  const [answer, setAnswer] = useState<number[]>([]);

  useEffect(() => {
    if (phase !== 'watch') return;
    const timer = setTimeout(() => {
      if (tick >= sequence.length * 2 - 1) {
        setPhase(review ? 'ready' : 'recall');
        setTick(-1);
      } else setTick(tick + 1);
    }, tick < 0 ? 600 : tick % 2 === 0 ? 700 : 300);
    return () => clearTimeout(timer);
  }, [phase, tick, sequence.length, review]);

  const active = phase === 'watch' && tick >= 0 && tick % 2 === 0 ? sequence[tick / 2] : null;
  const canClick = !disabled && !review && phase === 'recall';
  function pick(position: number) {
    if (!canClick || answer.includes(position)) return;
    const next = [...answer, position];
    setAnswer(next);
    if (next.length === sequence.length) {
      setPhase('done');
      onAnswer?.(next);
    }
  }
  return <div className="my-5 space-y-4">
    <p className="text-sm text-slate-600">{zh
      ? `记住 ${sequence.length} 个粉色圆点亮起的顺序。播放结束后，按相同顺序点击位置；每个位置只出现一次。`
      : `Remember the order of ${sequence.length} pink dots. After playback, click their positions in the same order. Each position appears once.`}</p>
    <p role="status" className="font-medium text-indigo-900">{phase === 'watch'
      ? (zh ? '观察中，请记住顺序…' : 'Watch and remember…')
      : phase === 'recall' ? (zh ? `轮到你了 · 已点击 ${answer.length} / ${sequence.length}` : `Your turn · ${answer.length} / ${sequence.length} selected`)
      : phase === 'done' ? (zh ? '已完成点击，请提交答案。' : 'Sequence entered. Check your answer below.')
      : (zh ? '准备好后开始播放' : 'Start playback when you are ready')}</p>
    <div aria-label={zh ? '记忆力训练板' : 'Memory board'} style={{ position: 'relative', width: '100%', aspectRatio: '1079 / 484', background: '#40b1d9', containerType: 'inline-size' }}>
      <p style={{ position: 'absolute', top: '1.6%', width: '100%', margin: 0, textAlign: 'center', color: '#d9f1f9', fontSize: '2.2cqw', fontWeight: 400 }}>
        {zh ? '圆点以何种顺序出现在网格的哪些位置？' : 'In what order and at which positions did the dots appear?'}
      </p>
      {MEMORY_POINTS.map(([x, y], index) => {
        const position = index + 1;
        const order = answer.indexOf(position);
        const selected = order !== -1;
        const lit = active === position || selected;
        return <button key={position} type="button" aria-label={zh ? `位置 ${position}` : `Position ${position}`}
          disabled={!canClick || selected} aria-pressed={selected} data-active={active === position}
          onClick={() => pick(position)}
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
          style={{ position: 'absolute', left: `${x / 1079 * 100}%`, top: `${y / 484 * 100}%`, transform: 'translate(-50%, -50%)', width: '3.9%', aspectRatio: '1', borderRadius: '50%', border: '0.46cqw solid white', padding: 0, background: lit ? '#c4449c' : '#fff', color: '#fff', fontSize: '2.05cqw', fontWeight: 300, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: canClick && !selected ? 'pointer' : 'default', opacity: 1 }}>
          {selected ? order + 1 : active === position ? tick / 2 + 1 : ''}
        </button>;
      })}
    </div>
    {phase === 'ready' && !preview && <button type="button" disabled={disabled} onClick={() => { setTick(-1); setPhase('watch'); }} className="rounded-lg bg-[#cf80bc] px-4 py-2 font-medium text-white disabled:opacity-50">
      {review ? (zh ? '回看正确顺序' : 'Replay correct sequence') : (zh ? '播放一次，开始记忆' : 'Play once and remember')}
    </button>}
    {review && <p className="text-sm text-slate-600">{zh ? '正确位置顺序：' : 'Correct order: '}{sequence.join(' → ')}</p>}
  </div>;
}
