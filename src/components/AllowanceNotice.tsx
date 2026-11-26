'use client';
import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';
import type { AllowanceState } from '@/lib/allowance';
import { reportConversion } from '@/lib/conversion-client';
import { useI18n } from '@/lib/i18n';
import { priceFor } from '@/lib/payment-product';
import { useCheckout } from '@/lib/use-checkout';
import { useAnnounceUpgradeCard } from '@/lib/upgrade-card-presence';

type Unit = 'solve' | 'question' | 'round';

/** Free solves left, a warning when few remain, and the upgrade card once they are gone. */
export default function AllowanceNotice({ state, unit, remaining, limit }: { state: AllowanceState; unit: Unit; remaining?: number; limit: number }) {
  const { lang } = useI18n(), zh = lang === 'zh';
  if (state === 'hidden') return null;
  if (state === 'empty' || state === 'locked') return <UpgradeCard locked={state === 'locked'} unit={unit} limit={limit} />;
  if (state === 'ok') return <p className="text-sm text-slate-500">{zh ? `免费求解剩 ${remaining}/${limit} 次` : `${remaining} of ${limit} free solves left`}</p>;
  return <p role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950">
    <span className="font-semibold">{zh ? `还剩 ${remaining} 次免费求解` : `${remaining} free solve${remaining === 1 ? '' : 's'} left`}</span>
    <Link href="/billing" className="font-medium text-indigo-700 underline underline-offset-4">{zh ? `7 天不限次 · ${priceFor(lang).label}` : `Unlimited for 7 days · ${priceFor(lang).label}`}</Link>
  </p>;
}

/** In-place offer shown where a free account runs out, with checkout one click away. */
export function UpgradeCard({ locked = false, unit, limit }: { locked?: boolean; unit: Unit; limit: number }) {
  const { lang } = useI18n(), zh = lang === 'zh';
  const { buy, busy, error } = useCheckout('upgrade_card');
  const price = priceFor(lang).label;
  const bodyId = useId();
  const reported = useRef(false);
  useAnnounceUpgradeCard();
  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    reportConversion('upgrade_prompt_viewed');
  }, []);

  const heading = locked
    ? (zh ? '这一项需要会员' : 'This item needs membership')
    : unit === 'solve' ? (zh ? `这个解题器的 ${limit} 次免费求解已用完` : `You have used all ${limit} free solves here`)
    : unit === 'question' ? (zh ? `这类题的 ${limit} 道免费新题已用完` : `You have used all ${limit} free new questions of this type`)
    : (zh ? `${limit} 轮免费训练已用完` : `You have used all ${limit} free rounds`);
  const stillFree = locked ? null
    : unit === 'question' ? (zh ? '用免费额度做过的题，仍可在「最近练习」里重练。' : 'Questions you did on the free allowance can still be retried from Recent practice.')
    : unit === 'solve' ? (zh ? '其他解题器和题型的免费次数单独计算。' : 'Other solvers and question types have their own free allowance.')
    : null;

  return <section aria-label={zh ? '开通 7 天会员' : 'Get the 7-day pass'} aria-describedby={bodyId} className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 text-left text-sm text-indigo-950">
    <p className="text-base font-semibold">{heading}</p>
    <p id={bodyId} className="mt-1 leading-6 text-slate-700">{zh
      ? '7 天会员：解题器不限次、所有题型不限新题、限时模拟考和逐题报告。一次付款，不自动续费。'
      : 'The 7-day pass: unlimited solvers, unlimited new questions in every type, timed mock exams and question-by-question reports. One payment, no auto-renewal.'}</p>
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
      <button type="button" onClick={() => void buy()} disabled={busy} className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-default disabled:opacity-50">{busy
        ? (zh ? '正在打开…' : 'Opening…')
        : (zh ? `开通 7 天会员 · ${price}` : `Get 7 days · ${price}`)}</button>
      <Link href="/billing" className="font-medium text-indigo-700 underline underline-offset-4">{zh ? '看看包含什么' : 'What is included'}</Link>
    </div>
    {error && <p role="alert" className="mt-3 text-red-600">{error}</p>}
    {stillFree && <p className="mt-3 text-xs leading-5 text-slate-500">{stillFree}</p>}
  </section>;
}
