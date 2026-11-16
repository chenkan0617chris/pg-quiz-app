'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Shape } from '@/lib/shapes';
import { shapeNameKey } from '@/lib/i18n';
import { localePath } from '@/lib/seo';
import { SWITCH_QUESTIONS, codeText, switchOutput, unknownSpan, type SwitchQuestion } from '@/content/switch-practice';
import type { Perm } from '@/lib/engine';

function Row({ ids, label }: { ids: number[]; label: string }) {
  const { t, lang } = useI18n(), zh = lang === 'zh';
  return <div className="flex items-center gap-2">
    <span className="sr-only">{label}{zh ? '：' : ': '}{ids.map(id => t(shapeNameKey(id))).join(zh ? '、' : ', ')}{zh ? '。' : '.'}</span>
    {ids.map((id, i) => <span key={i} aria-hidden="true"><Shape id={id} size={26} variant="pipeline" /></span>)}
  </div>;
}

function Box({ code }: { code: Perm | null }) {
  const { lang } = useI18n();
  return <span className={`inline-flex min-w-16 justify-center rounded-md px-3 py-1 font-mono text-sm font-semibold ${code ? 'bg-blue-700 text-white' : 'border-2 border-dashed border-indigo-400 text-indigo-600'}`}>
    <span className="sr-only">{code ? (lang === 'zh' ? '已知方框 ' : 'Known box ') : (lang === 'zh' ? '未知方框' : 'Unknown box')}</span>{code ? codeText(code) : <span aria-hidden="true">????</span>}
  </span>;
}

function Explanation({ q, zh }: { q: SwitchQuestion; zh: boolean }) {
  const { t } = useI18n();
  const { index, from, to } = unknownSpan(q);
  const names = (ids: number[]) => ids.map(id => t(shapeNameKey(id))).join(zh ? '、' : ', ');
  const before = q.boxes.slice(0, index) as Perm[];
  const after = q.boxes.slice(index + 1) as Perm[];
  const steps: string[] = [];
  if (before.length) steps.push(zh
    ? `先算已知方框 ${before.map(codeText).join('、')}，未知方框收到的顺序是：${names(from)}。`
    : `Apply the known box ${before.map(codeText).join(', ')} first. The unknown box receives: ${names(from)}.`);
  if (after.length) steps.push(zh
    ? `未知方框后面还有 ${after.map(codeText).join('、')}，先从输出把它撤销，得到未知方框必须输出的顺序：${names(to)}。`
    : `Box ${after.map(codeText).join(', ')} comes after the unknown one, so undo it from the output first. The unknown box must produce: ${names(to)}.`);
  const positions = to.map(id => from.indexOf(id) + 1);
  steps.push(zh
    ? `逐位对照：${to.map((id, i) => `新第 ${i + 1} 位是${t(shapeNameKey(id))}，它在上一行第 ${positions[i]} 位`).join('；')}。所以答案是 ${codeText(q.answer)}。`
    : `Match slot by slot: ${to.map((id, i) => `new slot ${i + 1} holds the ${t(shapeNameKey(id)).toLowerCase()}, which was in position ${positions[i]}`).join('; ')}. So the code is ${codeText(q.answer)}.`);
  return <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">{steps.map(s => <li key={s}>{s}</li>)}</ol>;
}

/** Free, no-sign-in Switch Challenge questions with worked answers. */
export default function FreeSwitchPractice() {
  const { lang } = useI18n(), zh = lang === 'zh';
  const [picks, setPicks] = useState<Record<string, string>>({});
  const done = Object.keys(picks).length;
  const correct = SWITCH_QUESTIONS.filter(q => picks[q.id] === codeText(q.answer)).length;

  return <section id="free-practice" aria-labelledby="free-practice-title" className="mt-10 scroll-mt-24 rounded-xl border border-slate-200 p-5 sm:p-7">
    <p className="text-xs font-semibold tracking-wider text-indigo-600">{zh ? '免费 · 无需登录' : 'FREE · NO SIGN-UP'}</p>
    <h2 id="free-practice-title" className="mt-1 text-xl font-semibold">{zh ? '管道题免费练习：8 道原创题与解析' : 'Free Switch Challenge practice questions with answers'}</h2>
    <p className="mt-2 text-sm leading-7 text-slate-600">{zh
      ? '每题四个图形经过一个或两个方框，选出未知方框（????）的代码。前 3 题只有一个方框，后 5 题有一个已知方框，难度和真实测评后半段接近。选完立刻显示答案和逐步解析。'
      : 'Four symbols pass through one or two boxes. Pick the code for the unknown box (????). Questions 1–3 have a single box; 4–8 chain a known box with the unknown one, like the harder questions in the real test. The answer and a step-by-step explanation appear as soon as you choose.'}</p>
    <p role="status" className="mt-3 text-sm font-medium text-slate-800">{zh ? `已答 ${done} / 8，答对 ${correct} 题` : `Answered ${done} of 8 · ${correct} correct`}</p>

    <ol className="mt-5 space-y-6">{SWITCH_QUESTIONS.map((q, n) => {
      const mine = picks[q.id], answered = mine !== undefined, right = mine === codeText(q.answer);
      return <li key={q.id} className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">{zh ? `第 ${n + 1} 题` : `Question ${n + 1}`}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Row ids={q.input} label={zh ? '输入' : 'Input'} />
          {q.boxes.map((b, i) => <span key={i} className="flex items-center gap-3"><span aria-hidden="true" className="text-slate-400">→</span><Box code={b} /></span>)}
          <span aria-hidden="true" className="text-slate-400">→</span>
          <Row ids={switchOutput(q)} label={zh ? '输出' : 'Output'} />
        </div>
        <fieldset className="mt-4" disabled={answered}>
          <legend className="sr-only">{zh ? '选择未知方框的代码' : 'Choose the code for the unknown box'}</legend>
          <div className="flex flex-wrap gap-2">{q.options.map(o => {
            const code = codeText(o), isAnswer = code === codeText(q.answer);
            const style = !answered ? 'border-slate-300 bg-white hover:border-indigo-400'
              : isAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
              : code === mine ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-400';
            return <button key={code} type="button" onClick={() => setPicks({ ...picks, [q.id]: code })} aria-pressed={code === mine} className={`rounded-lg border px-4 py-2 font-mono text-sm font-semibold ${style}`}>{code}</button>;
          })}</div>
        </fieldset>
        {answered && <div className="mt-3">
          <p className={`text-sm font-semibold ${right ? 'text-emerald-700' : 'text-amber-800'}`}>{right ? (zh ? '✓ 正确' : '✓ Correct') : (zh ? `✗ 正确答案是 ${codeText(q.answer)}` : `✗ The answer is ${codeText(q.answer)}`)}</p>
          <Explanation q={q} zh={zh} />
        </div>}
      </li>;
    })}</ol>

    <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 text-sm">
      <p className="font-semibold text-indigo-950">{zh ? '下一步：限时练习' : 'Next: practise against the clock'}</p>
      <p className="mt-1 leading-6 text-slate-600">{zh
        ? '真实测评大约 6 分钟，题目越做越难。会做之后，用题库生成新题，或用模拟考在限时条件下连续作答。'
        : 'The real test gives you about six minutes and the questions get harder as you go. Once these feel easy, generate new questions in the practice bank or sit a timed mock exam.'}</p>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-medium">
        <Link className="text-indigo-700 underline" href={localePath(lang, '/practice?kind=pipeline')}>{zh ? '更多管道题练习 →' : 'More Switch practice →'}</Link>
        <Link className="text-indigo-700 underline" href={localePath(lang, '/exams')}>{zh ? '限时模拟考 →' : 'Timed mock exam →'}</Link>
      </p>
    </div>
  </section>;
}
