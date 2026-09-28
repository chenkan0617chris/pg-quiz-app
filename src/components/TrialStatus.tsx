'use client';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { useAccount } from '@/lib/use-account';
import { PRICE_LABEL } from '@/lib/payment-product';
export default function TrialStatus(){
 const {userId,isLoaded,account,failed}=useAccount();
 const {lang}=useI18n();const zh=lang==='zh';
 if(!isLoaded)return null;
 if(!userId)return <span className="text-gray-500">{zh?'每种解题器免费 10 次 · 固定样题免费练习':'10 free uses per solver · Free sample practice'}</span>;
 if(failed)return <span role="status" className="text-amber-700">{zh?'暂时无法获取账户状态，请稍后重试':'Account status temporarily unavailable'}</span>;
 if(!account)return <span className="text-gray-500">{zh?'正在读取账户状态…':'Loading account…'}</span>;
 const until=account.status==='paid'?account.paidUntil:account.trialEndsAt;
 const date=until?new Date(until).toLocaleString(zh?'zh-CN':'en-AU'):'';
 return <div role="status" className="max-w-xl text-right text-gray-600">
  {account.status==='expired'
   ? <><span>{zh?'免费解题剩余：':'Free solves left: '}{zh?'管道':'Pipeline'} {account.solverRemaining.pipeline}/10 · {zh?'数字':'Numerical'} {account.solverRemaining.numerical}/10 · {zh?'图形':'Figure'} {account.solverRemaining.figure}/10</span><p className="text-xs">{zh?'每种独立计数，不每日重置；固定样题可重复练习。':'Separate lifetime allowances; samples can be repeated.'} <Link href="/billing" className="text-indigo-600 underline">{zh?'解锁会员':'Unlock full access'} · {PRICE_LABEL}</Link></p></>
   : <><span>{account.status==='paid'?(zh?'会员有效期至：':'Paid access until: '):(zh?'原有免费试用保留至：':'Existing trial honoured until: ')}{date}</span><p className="text-xs text-gray-400">{zh?'有效期内解题不扣免费次数，可生成更多练习。':'Solving does not use free credits during access; generate more practice questions.'}</p></>}
 </div>;
}
