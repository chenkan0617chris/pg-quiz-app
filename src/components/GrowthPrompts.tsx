'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAccount } from '@/lib/use-account';
import { localePath } from '@/lib/seo';
import { priceFor } from '@/lib/payment-product';
import { reportConversion } from '@/lib/conversion-client';
import {
  ONBOARDING_KEY, TRIAL_DISMISS_KEY, UPGRADE_DISMISS_KEY, dayKey, isUnused, nextStepPath, parseOnboarding, reviewProgress, startPath, trialPrompt, upgradePrompt, usageTotals,
  type ExamWhen, type Onboarding, type TargetTest,
} from '@/lib/growth';

function readStorage(key: string): string | null {
  try { return typeof window === 'undefined' ? null : window.localStorage.getItem(key); } catch { return null; }
}
function writeStorage(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* private mode: prompt may show again */ }
}

/** Routes where an overlay would get in the way of the page's own job. */
const QUIET = ['/admin', '/sign-in', '/sign-up', '/billing'];

const TESTS: { id: TargetTest; zh: [string, string]; en: [string, string] }[] = [
  { id: 'aon', zh: ['Aon / cut-e 游戏化测评', '管道题 Switch、数字题 Digit、Grid 空间记忆（宝洁等公司在用）'], en: ['Aon / cut-e games', 'Switch, Digit and Grid Challenge (used by P&G and others)'] },
  { id: 'shl', zh: ['SHL 等言语 / 数字推理', '读短文判断 True/False/Cannot Say，图表数据题'], en: ['SHL-style verbal & numerical', 'True / False / Cannot Say passages, charts and tables'] },
  { id: 'big4', zh: ['四大 / 银行 / 咨询笔试', '毕马威、安永、普华永道、德勤等，以数字和资料分析为主'], en: ['Big Four, banks & consulting', 'KPMG, EY, PwC, Deloitte: mostly numerical and data'] },
  { id: 'unsure', zh: ['还不确定', '先随便练练，看看都有哪些题型'], en: ['Not sure yet', 'Look around the question types first'] },
];
const WHEN: { id: ExamWhen; zh: string; en: string }[] = [
  { id: '3d', zh: '3 天内', en: 'Within 3 days' },
  { id: '2w', zh: '2 周内', en: 'Within 2 weeks' },
  { id: 'later', zh: '更晚 / 还没收到邀请', en: 'Later / no invite yet' },
];

export default function GrowthPrompts() {
  const { lang } = useI18n(), zh = lang === 'zh';
  const pathname = usePathname();
  const router = useRouter();
  const { account } = useAccount();
  const [onboarding, setOnboarding] = useState<Onboarding | null>(() => parseOnboarding(readStorage(ONBOARDING_KEY)));
  const [dismissed, setDismissed] = useState(() => readStorage(TRIAL_DISMISS_KEY));
  // One clock per mount is enough at hour granularity.
  const [now] = useState(() => Date.now());
  const [test, setTest] = useState<TargetTest | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reviewDialog = useRef<HTMLDialogElement>(null);

  const quiet = QUIET.some(path => pathname.startsWith(path));
  const showOnboarding = !!account && !quiet && onboarding === null && isUnused(account);
  const prompt = account && !quiet && dismissed !== dayKey(now) ? trialPrompt(account, now) : null;
  const [upgradeDismissed, setUpgradeDismissed] = useState(() => readStorage(UPGRADE_DISMISS_KEY));
  // The mock-exam centre already shows its own paywall, so the banner stays out of the way there.
  const upgrade = account && !quiet && !prompt && !showOnboarding && !pathname.includes('/exams') && upgradeDismissed !== dayKey(now)
    ? upgradePrompt(account) : null;
  const upgradeRecorded = useRef(false);
  useEffect(() => {
    if (!upgrade || upgradeRecorded.current) return;
    upgradeRecorded.current = true;
    reportConversion('upgrade_prompt_viewed');
  }, [upgrade]);

  useEffect(() => {
    const el = dialog.current;
    if (showOnboarding && el && !el.open) el.showModal();
  }, [showOnboarding]);

  useEffect(() => {
    const el = reviewDialog.current;
    if (prompt?.kind === 'ended' && el && !el.open) el.showModal();
  }, [prompt?.kind]);

  function save(value: Onboarding) {
    writeStorage(ONBOARDING_KEY, JSON.stringify(value));
    setOnboarding(value);
    dialog.current?.close();
  }
  function choose(when: ExamWhen) {
    if (!test) return;
    save({ test, when });
    router.push(localePath(lang, startPath(test)));
  }
  function dismissUpgrade() {
    const day = dayKey(now);
    writeStorage(UPGRADE_DISMISS_KEY, day);
    setUpgradeDismissed(day);
  }
  function dismiss() {
    const day = dayKey(now);
    writeStorage(TRIAL_DISMISS_KEY, day);
    setDismissed(day);
  }

  const totals = account ? usageTotals(account) : { practice: 0, solves: 0 };
  const rawProgress = account?.progress;
  const progress = rawProgress ? reviewProgress(rawProgress) : null;
  const plan = onboarding && 'test' in onboarding ? onboarding : null;
  const soon = plan && plan.when !== 'later';
  const price = priceFor(lang).label;
  const did = zh
    ? `你已经做了 ${totals.practice} 道练习、用了 ${totals.solves} 次解题器。`
    : `So far you have done ${totals.practice} practice question${totals.practice === 1 ? '' : 's'} and ${totals.solves} solve${totals.solves === 1 ? '' : 's'}.`;

  return <>
    {prompt?.kind === 'ended' && progress && rawProgress && <dialog ref={reviewDialog} aria-labelledby="trial-review-title" onCancel={dismiss}
      className="m-auto w-[min(38rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/40">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-wider text-indigo-600">{zh?'你的备考回顾':'YOUR PREP REVIEW'}</p>
        <h2 id="trial-review-title" className="mt-2 text-2xl font-semibold">{zh?'24 小时免费试用已结束':'Your 24-hour free trial has ended'}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{zh?`这段时间你完成了 ${rawProgress.completed} 道练习${rawProgress.mockExams?`，并完成 ${rawProgress.mockExams} 次限时模拟考`:''}。`: `You completed ${rawProgress.completed} practice question${rawProgress.completed===1?'':'s'}${rawProgress.mockExams?` and finished ${rawProgress.mockExams} timed mock exam${rawProgress.mockExams===1?'':'s'}`:''}.`}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs font-medium text-indigo-700">{zh?'已完成练习':'PRACTICE COMPLETED'}</p><p className="mt-1 text-3xl font-semibold text-indigo-950">{rawProgress.completed}</p></div>
          <div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs font-medium text-indigo-700">{zh?'当前正确率':'CURRENT ACCURACY'}</p><p className="mt-1 text-3xl font-semibold text-indigo-950">{progress.accuracy===null?'—':`${progress.accuracy}%`}</p></div>
        </div>
        {progress.hasComparableProgress ? <section className="mt-5 rounded-xl border border-slate-200 p-4"><div className="flex items-baseline justify-between gap-3"><h3 className="font-semibold">{zh?'正确率变化':'Accuracy progress'}</h3><span className={`text-sm font-semibold ${progress.change!>=0?'text-emerald-700':'text-amber-700'}`}>{progress.change!>=0?(zh?`提升 ${progress.change} 个百分点`:`${progress.change} percentage points`):(zh?`变化 ${progress.change} 个百分点`:`${progress.change} percentage points`)}</span></div><div className="mt-4 space-y-3 text-sm"><div><div className="mb-1 flex justify-between text-slate-500"><span>{zh?'最早 10 题':'First 10 questions'}</span><span>{progress.firstAccuracy}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-300" style={{width:`${progress.firstAccuracy}%`}}/></div></div><div><div className="mb-1 flex justify-between text-slate-500"><span>{zh?'最近 10 题':'Most recent 10'}</span><span>{progress.recentAccuracy}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{width:`${progress.recentAccuracy}%`}}/></div></div></div></section> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{zh?'你已经开始积累练习记录；继续完成更多题目后，账号页会显示更有意义的正确率变化。':'You have started building a practice record. Complete more questions to see a meaningful accuracy comparison.'}</p>}
        <section className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm leading-6"><h3 className="font-semibold text-indigo-950">{zh?`继续备考，解锁 ${priceFor(lang).label} / 7 天会员`:`Keep your momentum with a ${priceFor(lang).label} / 7-day pass`}</h3><ul className="mt-2 space-y-1 text-slate-700"><li>{zh?'• 不限次数的新题与解题器':'• Unlimited fresh questions and solvers'}</li><li>{zh?'• 限时模拟考、逐题成绩与报告':'• Timed mock exams with question-by-question reports'}</li><li>{zh?'• 不自动续费，付费后立即可用':'• No auto-renewal; access starts after payment'}</li></ul></section>
        <div className="mt-6 flex flex-wrap items-center gap-3"><Link href="/billing" className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">{zh?'继续备考，开通会员':'Continue with membership'}</Link><button type="button" onClick={dismiss} className="px-2 py-2 text-sm text-slate-600 underline">{zh?'今天先不用':'Not today'}</button></div>
      </div>
    </dialog>}
    {prompt && <div role="status" className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="w-full leading-6 sm:w-auto sm:min-w-0 sm:flex-1">
        <span className="font-semibold">{prompt.kind === 'ending'
          ? (zh ? `免费试用还剩约 ${prompt.hoursLeft} 小时。` : `About ${prompt.hoursLeft} hour${prompt.hoursLeft === 1 ? '' : 's'} left in your free trial. `)
          : (zh ? '24 小时免费试用已结束。' : 'Your 24-hour free trial has ended. ')}</span>
        {did}{' '}
        {soon
          ? (zh ? `考试临近？开通 7 天冲刺会员（${price}），继续不限次做限时模拟考和解题器。` : `Test coming up? A 7-day sprint pass (${price}) keeps timed mock exams and solvers unlimited.`)
          : (zh ? `7 天会员 ${price}，包含限时模拟考、不限次解题器和全部题库，不自动续费。` : `A 7-day pass is ${price}: timed mock exams, unlimited solvers and every question type. No auto-renewal.`)}
      </p>
      <div className="flex items-center gap-2">
        <Link href="/billing" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">{zh ? '开通 7 天会员' : 'Get the 7-day pass'}</Link>
        <button type="button" onClick={dismiss} aria-label={zh ? '今天不再提示' : 'Hide for today'} className="rounded-lg px-2 py-2 text-amber-800 hover:bg-amber-100">✕</button>
      </div>
    </div>}

    {upgrade && <div role="status" className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-950">
      <p className="w-full leading-6 sm:w-auto sm:min-w-0 sm:flex-1">
        <span className="font-semibold">{upgrade.reason === 'limit'
          ? (zh ? `你已用完 ${upgrade.exhausted} 项免费额度。` : `You have used up ${upgrade.exhausted} free allowance${upgrade.exhausted === 1 ? '' : 's'}. `)
          : (zh ? `你已经练了 ${upgrade.kindsTried} 种题型。` : `You have tried ${upgrade.kindsTried} question types. `)}</span>
        {zh
          ? `7 天会员 ${price}：所有题型不限新题、解题器不限次、限时模拟考和逐题报告。一次付款，不自动续费。`
          : `A 7-day pass is ${price}: unlimited fresh questions in every type, unlimited solvers, timed mock exams and question-by-question reports. One payment, no auto-renewal.`}
      </p>
      <div className="flex items-center gap-2">
        <Link href="/billing" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">{zh ? '看看会员包含什么' : 'See what the pass includes'}</Link>
        <button type="button" onClick={dismissUpgrade} aria-label={zh ? '今天不再提示' : 'Hide for today'} className="rounded-lg px-2 py-2 text-indigo-800 hover:bg-indigo-100">✕</button>
      </div>
    </div>}

    {showOnboarding && <dialog ref={dialog} aria-labelledby="onboarding-title" onCancel={() => save({ skipped: true })}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-2xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-950/40">
      <div className="p-6 sm:p-7">
        <p className="text-xs font-semibold tracking-wider text-indigo-600">{zh ? `第 ${test ? 2 : 1} 步，共 2 步` : `STEP ${test ? 2 : 1} OF 2`}</p>
        <h2 id="onboarding-title" className="mt-2 text-xl font-semibold">{test
          ? (zh ? '什么时候考？' : 'When is your test?')
          : (zh ? '你在准备哪种测评？' : 'Which test are you preparing for?')}</h2>
        <p className="mt-1 text-sm text-slate-500">{test
          ? (zh ? '我们会按时间给你安排练习顺序。' : 'We will order your practice around it.')
          : (zh ? '选一个，直接带你去对应的练习，30 秒开始第一题。' : 'Pick one and we will take you straight to matching practice.')}</p>
        <div className="mt-5 grid gap-2">{test
          ? WHEN.map(w => <button key={w.id} type="button" onClick={() => choose(w.id)} className="rounded-xl border border-slate-200 px-4 py-3 text-left font-medium hover:border-indigo-400 hover:bg-indigo-50">{zh ? w.zh : w.en}</button>)
          : TESTS.map(t => <button key={t.id} type="button" onClick={() => setTest(t.id)} className="rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-indigo-400 hover:bg-indigo-50">
            <span className="block font-medium">{(zh ? t.zh : t.en)[0]}</span>
            <span className="mt-0.5 block text-xs text-slate-500">{(zh ? t.zh : t.en)[1]}</span>
          </button>)}</div>
        <div className="mt-5 flex justify-between text-sm">
          {test ? <button type="button" onClick={() => setTest(null)} className="text-slate-500 hover:text-slate-800">{zh ? '← 返回' : '← Back'}</button> : <span />}
          <button type="button" onClick={() => save({ skipped: true })} className="text-slate-500 hover:text-slate-800">{zh ? '跳过' : 'Skip'}</button>
        </div>
      </div>
    </dialog>}

    {account && plan && soon && !prompt && pathname === localePath(lang) && <PlanCard lang={lang} test={plan.test} when={plan.when} />}
  </>;
}

/** A small reminder of the plan on the home page for people with a test coming up. */
function PlanCard({ lang, test, when }: { lang: 'zh' | 'en'; test: TargetTest; when: ExamWhen }) {
  const zh = lang === 'zh';
  const next = nextStepPath(test, when);
  return <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm">
    <p className="font-semibold text-indigo-950">{zh ? (when === '3d' ? '3 天冲刺计划' : '2 周备考计划') : (when === '3d' ? 'Your 3-day sprint' : 'Your 2-week plan')}</p>
    <p className="mt-1 leading-6 text-slate-600">{zh
      ? '先把对应题型练到稳定正确，再做限时模拟考熟悉节奏和压力。'
      : 'Get the question type consistently right first, then sit timed mock exams to get used to the pace.'}</p>
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-medium">
      <Link href={localePath(lang, startPath(test))} className="text-indigo-700">{zh ? '① 继续练习 →' : '1. Keep practising →'}</Link>
      {next && <Link href={localePath(lang, next)} className="text-indigo-700">{zh ? (next === '/exams' ? '② 限时模拟考 →' : '② 资料分析 →') : (next === '/exams' ? '2. Timed mock exam →' : '2. Data interpretation →')}</Link>}
    </div>
  </div>;
}
