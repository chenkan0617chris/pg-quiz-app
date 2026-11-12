'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { VERBAL_LABELS, VERBAL_PASSAGES, type VerbalAnswer, type VerbalPassage } from '@/content/verbal-bank';

const PER_ROUND = 3;
const CHOICES: VerbalAnswer[] = ['T', 'F', 'C'];

function draw(previous: string[] = []): VerbalPassage[] {
  const fresh = VERBAL_PASSAGES.filter(p => !previous.includes(p.id));
  const pool = fresh.length >= PER_ROUND ? fresh : VERBAL_PASSAGES;
  const result = [...pool];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result.slice(0, PER_ROUND);
}

/** Free True / False / Cannot Say practice. Answers stay in the browser; nothing is saved. */
export default function VerbalTraining() {
  const { lang } = useI18n(), zh = lang === 'zh';
  const labels = VERBAL_LABELS[lang];
  // Drawn after mount so server and client markup match.
  const [passages, setPassages] = useState<VerbalPassage[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, VerbalAnswer>>({});
  const [done, setDone] = useState(false);
  const startedAt = useRef(0);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { const timer = setTimeout(() => setPassages(draw()), 0); return () => clearTimeout(timer); }, []);

  const keys = passages?.flatMap(p => p.statements.map((_, i) => `${p.id}:${i}`)) ?? [];
  const answered = keys.filter(k => answers[k]).length;
  const correct = passages?.reduce((sum, p) => sum + p.statements.filter((s, i) => answers[`${p.id}:${i}`] === s.answer).length, 0) ?? 0;

  function pick(key: string, value: VerbalAnswer, at: number) {
    if (!startedAt.current) startedAt.current = at;
    setAnswers({ ...answers, [key]: value });
  }
  function finish(at: number) { setSeconds(startedAt.current ? Math.round((at - startedAt.current) / 1000) : 0); setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function next() {
    setPassages(draw(passages?.map(p => p.id)));
    setAnswers({}); setDone(false); startedAt.current = 0; setSeconds(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return <div className="space-y-6">
    <span className="text-xs font-semibold tracking-wider text-indigo-600">{zh ? '言语推理 · 英文' : 'VERBAL REASONING'}</span>
    <h1 className="text-3xl font-bold">{zh ? '英文言语推理练习：True / False / Cannot Say' : 'Verbal reasoning test practice: True, False or Cannot Say'}</h1>
    <p className="text-sm leading-7 text-slate-600">{zh
      ? '外企、四大、投行和快消公司的在线测评（SHL、Aon/cut-e、Talent Q 等）常考英文言语推理：读一段短文，判断每个陈述是正确、错误还是无法判断。每轮随机抽 3 篇原创短文、12 个陈述，提交后逐题给出依据。'
      : 'Many graduate and professional online assessments, including SHL, Aon (cut-e) and Talent Q tests used by banks, consultancies and consumer goods firms, include verbal reasoning: read a short passage and decide whether each statement is True, False or Cannot Say. Each round draws 3 original passages and 12 statements, with the reasoning shown for every answer.'}</p>
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
      <p className="font-medium text-slate-800">{zh ? '判断规则（只看原文，不用常识）' : 'The rule: use only the passage, never outside knowledge'}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        <li>{zh ? 'True：原文直接写明，或必然能推出。' : 'True: the passage states it, or it must follow from what is stated.'}</li>
        <li>{zh ? 'False：原文与陈述矛盾。' : 'False: the passage contradicts the statement.'}</li>
        <li>{zh ? 'Cannot Say：原文信息不够，哪怕陈述听起来合理。' : 'Cannot Say: the passage does not give enough to decide, however plausible the statement sounds.'}</li>
      </ul>
    </div>

    {done && <div role="status" className="rounded-xl bg-indigo-50 p-5">
      <h2 className="font-semibold">{zh ? `本轮得分 ${correct} / ${keys.length}` : `Score ${correct} / ${keys.length}`}</h2>
      <p className="mt-1 text-sm text-slate-600">{zh ? `用时 ${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒。真实测试通常每篇约 2 分钟，先求准确，再练速度。` : `Time ${Math.floor(seconds / 60)} min ${seconds % 60} s. Real tests often allow about 2 minutes per passage: get accurate first, then speed up.`}</p>
      <button onClick={next} className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">{zh ? '换 3 篇新短文' : 'Next 3 passages'}</button>
    </div>}

    {!passages ? <p role="status" className="text-sm text-slate-500">{zh ? '正在抽题…' : 'Drawing passages…'}</p> : passages.map((p, n) => <section key={p.id} className="rounded-xl border border-slate-200 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{zh ? `短文 ${n + 1}` : `Passage ${n + 1}`} · {p.topic}</p>
      <p lang="en" className="mt-3 text-[15px] leading-7 text-slate-800">{p.text}</p>
      <ol className="mt-5 space-y-4">{p.statements.map((s, i) => {
        const key = `${p.id}:${i}`, mine = answers[key], right = mine === s.answer;
        return <li key={key}>
          <fieldset disabled={done}>
            <legend lang="en" className="text-sm font-medium text-slate-900">{i + 1}. {s.text}</legend>
            <div className="mt-2 flex flex-wrap gap-2">{CHOICES.map(c => <label key={c} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${done && c === s.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : mine === c ? (done ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-indigo-500 bg-indigo-50 text-indigo-800') : 'border-slate-200'}`}>
              <input type="radio" className="sr-only" name={key} checked={mine === c} onChange={e => pick(key, c, e.timeStamp)} />{labels[c]}
            </label>)}</div>
          </fieldset>
          {done && <p className={`mt-2 text-sm ${right ? 'text-emerald-800' : 'text-amber-800'}`}>{right ? '✓ ' : `✗ ${zh ? '正确答案' : 'Answer'}: ${labels[s.answer]}. `}<span lang="en">{s.why}</span></p>}
        </li>;
      })}</ol>
    </section>)}

    {passages && !done && <button disabled={answered !== keys.length} onClick={e => finish(e.timeStamp)} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-40">{zh ? `提交并查看解析（${answered}/${keys.length}）` : `Check answers (${answered}/${keys.length})`}</button>}
    <p className="text-xs text-slate-500">{zh ? '短文和题目均为本站原创，不是任何公司的真题。本页免费，不保存作答。' : 'All passages are original and not taken from any employer’s test. Free to use; answers are not saved.'}</p>
    <div><Link href={`/${lang}/practice`} className="text-sm font-semibold text-indigo-600">{zh ? '去练数字推理和资料分析 →' : 'Practise numerical and data interpretation next →'}</Link></div>
  </div>;
}
