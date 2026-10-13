'use client';

import Link from 'next/link';
import type { Account } from '@/lib/use-account';
import { PRICE_LABEL } from '@/lib/payment-product';
import { FREE_MEMORY_ROUNDS, FREE_SAMPLES_PER_KIND, FREE_SOLVES_PER_KIND } from '@/lib/access-policy';

type Props = {
  zh: boolean; enabled: boolean; busy: boolean; error: string;
  account: Account | null; signedIn: boolean; loading: boolean; failed: boolean;
  onBuy: () => void;
};

export default function PlanComparison({ zh, enabled, busy, error, account, signedIn, loading, failed, onBuy }: Props) {
  const t = (cn: string, en: string) => zh ? cn : en;
  const paid = signedIn && account?.status === 'paid';
  const free = signedIn && account?.status === 'expired';
  const trial = signedIn && account?.status === 'trial';
  const badge = <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">✓ {t('当前方案', 'Current plan')}</span>;
  const rows: { name: string; free: string | boolean; member: string | boolean }[] = [
    { name: t('四类解题攻略', 'Four solving guides'), free: true, member: true },
    { name: t('四类固定练习样题', 'Fixed samples across four practice types'), free: t(`每类 ${FREE_SAMPLES_PER_KIND} 道`, `${FREE_SAMPLES_PER_KIND} per type`), member: true },
    { name: t('作答记录与答案解析', 'Attempt history & explanations'), free: true, member: true },
    { name: t('免费样题错题重练', 'Retry free sample questions'), free: true, member: true },
    { name: t('管道 / 数字 / 图形解题器', 'Pipeline / numerical / figure solvers'), free: t(`每种累计 ${FREE_SOLVES_PER_KIND} 次`, `${FREE_SOLVES_PER_KIND} lifetime uses each`), member: t('不限次数', 'Unlimited') },
    { name: t('记忆训练', 'Memory training'), free: t(`累计 ${FREE_MEMORY_ROUNDS} 轮`, `${FREE_MEMORY_ROUNDS} lifetime rounds`), member: t('不限轮数', 'Unlimited') },
    { name: t('四类练习持续生成新题', 'Generate new questions in all four types'), free: false, member: true },
    { name: t('生成题难度选择', 'Difficulty selection for generated questions'), free: false, member: true },
    { name: t('全屏限时模拟考试', 'Fullscreen timed mock exams'), free: t('考场与报告预览', 'Exam & report previews'), member: true },
    { name: t('模拟考历史与逐题成绩', 'Exam history & question reports'), free: t('保留已有报告', 'Keep existing reports'), member: true },
    { name: t('会员生成题错题重练', 'Retry member-generated questions'), free: false, member: true },
  ];
  function value(v: string | boolean) {
    if (typeof v === 'string') return <span className="font-medium">{v}</span>;
    return <span className={`inline-flex size-7 items-center justify-center rounded-full text-lg ${v ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}><span aria-hidden="true">{v ? '✓' : '×'}</span><span className="sr-only">{v ? t('包含', 'Included') : t('不包含', 'Not included')}</span></span>;
  }
  return <section className="mx-auto max-w-4xl">
    <header className="mb-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{t('从体验到完整练习', 'From first practice to full preparation')}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t('会员与价格', 'Membership and access')}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{t('注册即享 24 小时全功能试用；喜欢再花 ¥19.9 一次开通永久会员。', 'Try every feature free for 24 hours from registration, then pay ¥19.9 once for lifetime access.')}</p>
    </header>
    <div aria-live="polite" className="mb-5 text-sm text-slate-600">
      {loading ? t('正在确认当前方案…', 'Checking your current plan…') : signedIn && failed && !account ? t('暂时无法读取当前方案，请刷新重试。', 'Unable to load your plan. Please refresh to retry.') : trial ? t('你正在免费试用全部功能，与永久会员享有相同功能，试用期间不扣免费次数。', 'Your free trial includes every member feature without consuming free credits.') : !signedIn ? t('登录后可查看当前方案与剩余额度，免费体验无需绑卡。', 'Sign in to see your plan and remaining credits. No card needed for free access.') : null}
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <article aria-label="Free Plan" className={`flex flex-col rounded-2xl border p-6 ${free ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' : 'border-slate-200 bg-white'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Free Plan</h2>{free && badge}</div>
        <p className="mt-2 text-sm text-slate-600">{t('24 小时全功能试用，到期保留免费权益', '24-hour full trial, then free allowances')}</p>
        <p className="mt-5"><span className="text-4xl font-semibold tracking-tight">¥0</span><span className="ml-2 text-sm text-slate-500">CNY</span></p>
        <p className="mt-2 text-sm text-slate-500">{t('无需付款 · 无需绑卡', 'No payment · No card required')}</p>
        <p className="mb-6 mt-5 text-sm leading-6 text-slate-600">{t('注册起 24 小时内全部应用不限次数；到期未购买，保留每种解题器 10 次、记忆训练 10 轮和固定样题。', 'All apps are unlimited for 24 hours from registration. Afterwards, keep 10 uses per solver, 10 memory rounds and fixed samples.')}</p>
        <Link href={signedIn ? '/practice' : '/sign-in'} className="mt-auto rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600">{signedIn ? t('开始练习', 'Start practicing') : t('登录免费体验', 'Sign in to try for free')}</Link>
      </article>
      <article aria-label="Member Plan" className={`flex flex-col rounded-2xl border p-6 ${paid ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' : 'border-indigo-200 bg-indigo-50/50'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">Member Plan</h2>{paid ? badge : <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">{t('完整练习', 'Full practice access')}</span>}</div>
        <p className="mt-2 text-sm text-slate-600">{t('更多新题，集中备考', 'Fresh questions for focused preparation')}</p>
        <p className="mt-5"><span className="text-4xl font-semibold tracking-tight">{PRICE_LABEL}</span><span className="ml-2 text-sm text-slate-600">CNY / {t('永久', 'Lifetime')}</span></p>
        <p className="mt-2 text-sm text-slate-500">{t('一次付款 · 不自动续费', 'One-time payment · No auto-renewal')}</p>
        <p className="mb-6 mt-5 text-sm leading-6 text-slate-600">{t('解题器和记忆训练不限次数，四类练习持续生成新题，并保留未使用的免费额度。', 'Unlimited solvers and memory training, fresh questions across four types, and your unused free credits stay intact.')}</p>
        {paid ? <Link href="/account" className="mt-auto rounded-xl bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">{t('查看我的会员', 'View my membership')}</Link> : <button disabled={!enabled || busy || loading || (signedIn && !account)} onClick={onBuy} className="mt-auto rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50">{busy ? t('正在打开…', 'Opening…') : !enabled ? t('支付即将开放', 'Payments coming soon') : t('购买永久会员', 'Buy lifetime access')}</button>}
      </article>
    </div>
    {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-5 sm:px-6"><h2 className="text-lg font-semibold">{t('逐项对比，选适合你的方案', 'Compare what each plan includes')}</h2><p className="mt-1 text-sm text-slate-500">{t('试用期间享有右侧全部会员权益；左侧为试用到期未购买后的免费权益。', 'Trial access includes every feature in the member column. Free Plan limits apply after the trial ends.')}</p></div>
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">{t('免费与会员权益对比', 'Free and member plan comparison')}</caption>
        <thead><tr className="border-b border-slate-200 bg-slate-50"><th scope="col" className="w-[44%] px-3 py-4 text-left font-medium text-slate-500 sm:px-6">{t('功能与权益', 'Features')}</th><th scope="col" className={`px-2 py-4 ${free ? 'bg-emerald-50 text-emerald-800' : ''}`}>Free Plan</th><th scope="col" className={`px-2 py-4 ${paid ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-900'}`}>Member Plan</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.name} className="border-b border-slate-100 last:border-0"><th scope="row" className="px-3 py-4 text-left font-medium leading-6 text-slate-700 sm:px-6">{row.name}</th><td className={`px-2 py-4 text-center text-xs leading-5 sm:text-sm ${free ? 'bg-emerald-50/40' : ''}`}>{value(row.free)}</td><td className={`px-2 py-4 text-center text-xs leading-5 sm:text-sm ${paid ? 'bg-emerald-50/40' : 'bg-indigo-50/30'}`}>{value(row.member)}</td></tr>)}</tbody>
      </table>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-xs leading-6 text-slate-500 sm:px-6">
        <p>{t('免费次数为累计额度，不每日重置。记忆训练开始或重练一轮均计 1 次；其他免费样题可重复练习。', 'Free allowances are lifetime totals, with no daily reset. Each memory start or retry uses one round; other free samples can be repeated.')}</p>
        <p>{t('难度选择适用于会员生成题：管道简单 / 中等 / 困难；记忆 3 / 5 / 7 个位置。', 'Generated question settings: easy / medium / hard pipeline exercises; memory sequences of 3 / 5 / 7 positions.')}</p>
      </div>
    </div>
    <aside className="mt-5 flex flex-wrap items-start gap-3 rounded-xl border border-dashed border-slate-300 px-5 py-4">
      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{t('会员功能', 'Member feature')}</span><div className="flex-1"><h2 className="text-sm font-semibold">{t('模拟考试与模拟卷', 'Mock exams & practice papers')}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{t('试用用户与永久会员均可使用三项限时模拟考、全屏考场与逐题成绩报告。试用到期后仍保留已有报告。', 'Trial users and lifetime members get all three timed challenges, fullscreen exams and question reports. Existing reports remain available after the trial ends.')} <Link href="/exams" className="text-indigo-600 underline">{t('查看模拟考中心', 'Explore mock exams')}</Link></p></div>
    </aside>
    <div className="mt-6 space-y-3 text-sm leading-6 text-slate-500">
      <p>{t('¥19.9 一次付款，永久使用全部应用，无需续费。24 小时试用到期未购买则恢复 Free Plan，未用完的免费次数保留。', 'Pay ¥19.9 once for permanent access to all apps. No renewal. After the 24-hour trial, non-paying accounts return to Free Plan with unused credits intact.')}</p>
      <p>{enabled ? t('通过 Stripe 安全结账，支持支付宝、微信支付及银行卡；实际可用方式以结账页为准。支付确认可能稍有延迟。', 'Secure Stripe checkout with Alipay, WeChat Pay and cards, subject to checkout availability. Payment confirmation may take a moment.') : t('支付开通中，目前不会收取费用。', 'Payments are not open yet. No charges are taken.')}</p>
      <Link href="/account" className="inline-block font-medium text-indigo-700 underline underline-offset-4">{t('查看我的账号与使用情况', 'View my account and usage')} →</Link>
    </div>
  </section>;
}
