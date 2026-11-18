'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n';

/**
 * First-visit walkthrough for the Switch Challenge solver. The solver has four
 * non-obvious controls (draggable shapes, optional candidate slots, the
 * known/unknown toggle and extra stages), so new users get a spotlight tour the
 * first time they open it; the "How to use" button replays it at any time.
 *
 * Targets are found by selector so the board components stay unaware of the tour.
 * The overlay ignores pointer events, which lets people try the highlighted
 * control (e.g. drag a shape) while the step is open.
 */

const STORAGE_KEY = 'ckquiz.switchSolverTour.v1';
const PAD = 8;
const CARD_WIDTH = 360;

type Copy = { title: string; body: ReactNode };
type Step = { target: string; zh: Copy; en: Copy; demo?: boolean };

const STEPS: Step[] = [
  {
    target: '[data-pipeline-lane="input"]',
    demo: true,
    en: {
      title: 'Drag the shapes to copy your question',
      body: <>
        <p>Shapes move by <b>dragging</b>: drop one shape on another to swap them.</p>
        <p className="mt-2">Set the <b>top row</b> to the input order and the <b>bottom row</b> to the output order shown in your question.</p>
        <p className="mt-2 text-xs text-slate-500">Keyboard: focus a shape and press ← / →.</p>
      </>,
    },
    zh: {
      title: '拖动图形，照着题目摆好',
      body: <>
        <p>图形需要<b>拖动</b>：把一个图形拖到另一个上，两者就会交换位置。</p>
        <p className="mt-2"><b>上面一排</b>摆成题目的输入顺序，<b>下面一排</b>摆成题目的输出顺序。</p>
        <p className="mt-2 text-xs text-slate-500">键盘：选中图形后按 ← / → 也能移动。</p>
      </>,
    },
  },
  {
    target: '[data-pipeline-stage]',
    en: {
      title: 'The box you need to solve',
      body: <>
        <p>A box marked <b>unknown</b> is the one the solver works out. The three slots are the <b>answer options</b> from your question.</p>
        <ul className="mt-2 space-y-1.5">
          <li><b>One unknown box: optional.</b> Leave them empty and the solver gives the answer directly. Fill them in to see which option matches.</li>
          <li><b>Two or more unknown boxes: required.</b> Enter the options for each unknown box.</li>
        </ul>
      </>,
    },
    zh: {
      title: '这是要求解的方框',
      body: <>
        <p>标为<b>未知</b>的方框就是要算出来的那个。下面三个小格是题目给出的<b>备选答案</b>。</p>
        <ul className="mt-2 space-y-1.5">
          <li><b>只有一个未知方框：可以不填。</b>留空时直接算出答案；填了会帮你标出哪个选项对。</li>
          <li><b>两个及以上未知方框：必须填。</b>把每个未知方框的选项都填上。</li>
        </ul>
      </>,
    },
  },
  {
    target: '[data-tour="stage-settings"]',
    en: {
      title: 'Known or unknown?',
      body: <>
        <p>If your question <b>shows a box’s code</b> (for example 2314), untick <b>unknown</b> and type the code into that box.</p>
        <p className="mt-2">Keep <b>unknown</b> ticked for the box with the question mark.</p>
      </>,
    },
    zh: {
      title: '已知还是未知？',
      body: <>
        <p>如果题目里<b>直接给出了方框的代码</b>（例如 2314），就取消勾选<b>未知</b>，把代码填进这个方框。</p>
        <p className="mt-2">题目里打问号的方框，保持勾选<b>未知</b>。</p>
      </>,
    },
  },
  {
    target: '[data-tour="add-box"]',
    en: {
      title: 'Questions with 2 or 3 boxes',
      body: <>
        <p>Harder questions chain several boxes. Press <b>+ Add box</b> once for each extra box, in order from top to bottom.</p>
        <p className="mt-2">Then set each box to known or unknown. Remove a box with <b>✕</b>.</p>
      </>,
    },
    zh: {
      title: '两层、三层的题目',
      body: <>
        <p>难一点的题会串联多个方框。每多一层，点一次<b>＋ 添加方框</b>，按从上到下的顺序添加。</p>
        <p className="mt-2">再把每个方框设成已知或未知。点 <b>✕</b> 可以删掉一层。</p>
      </>,
    },
  },
  {
    target: '[data-tour="solve"]',
    en: {
      title: 'Solve',
      body: <p>Press <b>Solve</b> to get the answer and watch the shapes move through each box step by step.</p>,
    },
    zh: {
      title: '求解',
      body: <p>点<b>求解</b>得到答案，还能逐步看到图形在每个方框里怎么移动。</p>,
    },
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function readSeen() {
  try { return window.localStorage.getItem(STORAGE_KEY) === 'done'; } catch { return true; }
}
function markSeen() {
  try { window.localStorage.setItem(STORAGE_KEY, 'done'); } catch { /* storage unavailable */ }
}

export default function SolverTour() {
  const { lang } = useI18n();
  const zh = lang === 'zh';
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (readSeen()) return;
    const timer = window.setTimeout(() => setStep(0), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => { markSeen(); setStep(null); setRect(null); }, []);

  const measure = useCallback(() => {
    if (step === null) return;
    const el = document.querySelector(STEPS[step].target);
    setVw(window.innerWidth);
    setVh(window.innerHeight);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [step]);

  useLayoutEffect(() => {
    if (step === null) return;
    const target = document.querySelector(STEPS[step].target);
    if (target && window.innerWidth < 768) {
      // Leave room for the fixed mobile header above and the bottom-sheet card below.
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
    } else {
      target?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    nextRef.current?.focus({ preventScroll: true });
    let frame = requestAnimationFrame(measure);
    const onChange = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    window.addEventListener('scroll', onChange, true);
    window.addEventListener('resize', onChange);
    // Smooth scrolling and board re-layout keep moving the target for a moment.
    const poll = window.setInterval(measure, 150);
    const stopPoll = window.setTimeout(() => window.clearInterval(poll), 2000);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onChange, true);
      window.removeEventListener('resize', onChange);
      window.clearInterval(poll);
      window.clearTimeout(stopPoll);
    };
  }, [step, measure]);

  useEffect(() => {
    if (step === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      const typing = event.target instanceof HTMLElement && /^(INPUT|TEXTAREA)$/.test(event.target.tagName);
      if (typing) return;
      if (event.key === 'ArrowRight') setStep((s) => (s === null ? s : Math.min(s + 1, STEPS.length - 1)));
      if (event.key === 'ArrowLeft') setStep((s) => (s === null ? s : Math.max(s - 1, 0)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, close]);

  const replay = (
    <button
      type="button"
      onClick={() => setStep(0)}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-700"
    >
      <span aria-hidden className="flex size-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">?</span>
      {zh ? '使用指引' : 'How to use'}
    </button>
  );

  if (step === null) return replay;

  const current = STEPS[step];
  const copy = current[zh ? 'zh' : 'en'];
  const last = step === STEPS.length - 1;
  const cardWidth = Math.min(CARD_WIDTH, vw - 32);

  // Prefer the side of the target with more room; fall back to centred.
  let cardStyle: React.CSSProperties = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: cardWidth };
  if (vw < 768) {
    // Phones: a bottom sheet, so the highlighted control above it stays visible.
    cardStyle = { bottom: 16, left: 16, width: vw - 32 };
  } else if (rect) {
    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - cardWidth / 2), vw - cardWidth - 16);
    const roomRight = vw - (rect.left + rect.width);
    if (roomRight >= cardWidth + 32 && vw >= 1024) {
      cardStyle = { top: Math.min(Math.max(16, rect.top), vh - 320), left: rect.left + rect.width + 16, width: cardWidth };
    } else if (vh - (rect.top + rect.height) >= 300) {
      cardStyle = { top: rect.top + rect.height + 12, left, width: cardWidth };
    } else {
      cardStyle = { bottom: vh - rect.top + 12, left, width: cardWidth };
    }
  }

  return <>
    {replay}
    {createPortal(
      <div className="pointer-events-none fixed inset-0 z-[60]" aria-live="polite">
        {rect
          ? <div
              className="absolute rounded-2xl ring-2 ring-indigo-400 transition-all duration-200"
              style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55)' }}
            />
          : <div className="absolute inset-0 bg-slate-900/55" />}
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="solver-tour-title"
          className="pointer-events-auto absolute rounded-2xl bg-white p-5 text-sm leading-6 text-slate-700 shadow-2xl"
          style={cardStyle}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-indigo-600">
              {zh ? `第 ${step + 1} 步，共 ${STEPS.length} 步` : `Step ${step + 1} of ${STEPS.length}`}
            </span>
            <div className="flex gap-1" aria-hidden>
              {STEPS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-indigo-600' : 'w-1.5 bg-slate-200'}`} />)}
            </div>
          </div>
          <h2 id="solver-tour-title" className="text-base font-semibold text-slate-900">{copy.title}</h2>
          {current.demo && <DragDemo />}
          <div className="mt-2">{copy.body}</div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={close} className="cursor-pointer text-sm text-slate-500 hover:text-slate-800">
              {last ? '' : (zh ? '跳过指引' : 'Skip tour')}
            </button>
            <div className="flex gap-2">
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50">{zh ? '上一步' : 'Back'}</button>}
              <button
                ref={nextRef}
                type="button"
                onClick={() => (last ? close() : setStep(step + 1))}
                className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 font-medium text-white hover:bg-indigo-700"
              >
                {last ? (zh ? '开始使用' : 'Got it') : (zh ? '下一步' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    )}
  </>;
}

/** Two tiles trading places under a pointer, to show that shapes are dragged. */
function DragDemo() {
  return (
    <div aria-hidden className="relative mt-3 flex h-16 items-center justify-center gap-3 rounded-xl bg-slate-50">
      <style>{`
        @keyframes tour-a { 0%,15% { transform: translateX(0) } 45%,100% { transform: translateX(52px) } }
        @keyframes tour-b { 0%,30% { transform: translateX(0) } 55%,100% { transform: translateX(-52px) } }
        @keyframes tour-hand { 0%,10% { transform: translate(-26px, 14px); opacity: 0 } 15% { opacity: 1 } 45% { transform: translate(26px, 14px); opacity: 1 } 60%,100% { transform: translate(26px, 14px); opacity: 0 } }
        .tour-a { animation: tour-a 2.4s ease-in-out infinite; }
        .tour-b { animation: tour-b 2.4s ease-in-out infinite; }
        .tour-hand { animation: tour-hand 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .tour-a, .tour-b, .tour-hand { animation: none; } }
      `}</style>
      <span className="tour-a z-10 flex size-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <span className="size-5 rounded-full bg-emerald-500" />
      </span>
      <span className="tour-b flex size-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <span className="size-5 bg-rose-500" />
      </span>
      <span className="tour-hand absolute z-20 text-xl">👆</span>
    </div>
  );
}
