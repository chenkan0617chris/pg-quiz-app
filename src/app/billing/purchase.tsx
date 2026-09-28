'use client';
import Link from 'next/link';
import { PRICE_LABEL } from '@/lib/payment-product';
import { useState } from 'react';
import { useAuth,useClerk } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
export default function Purchase({enabled}:{enabled:boolean}){
 const {isSignedIn}=useAuth();const clerk=useClerk();const {lang}=useI18n();const zh=lang==='zh';
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 async function buy(){
  if(!isSignedIn){await clerk.openSignIn();return;}
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/checkout',{method:'POST'});
   if(response.status===401){await clerk.openSignIn();return;}
   if(!response.ok){setError(response.status===409?(zh?'当前付费使用权仍有效，或付款正在确认，请稍后刷新账户状态。':'Paid access is still active or payment is processing. Please refresh shortly.'):(zh?'暂时无法付款，请稍后重试。':'Checkout is currently unavailable.'));return;}
   const {url}=await response.json();
   if(typeof url!=='string'||new URL(url).hostname!=='checkout.stripe.com')throw new Error('Invalid checkout');
   window.location.assign(url);
  }catch{setError(zh?'暂时无法付款，请稍后重试。':'Checkout is currently unavailable.');}finally{setBusy(false);}
 }
 return <section className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8">
  <h1 className="text-2xl font-bold">{zh?'会员与价格':'Membership and access'}</h1>
  <p className="mt-4 text-gray-600">{zh?'每种解题器各有 10 次免费机会，不每日重置；每种练习题型有 5 道固定样题。记忆训练累计免费 10 轮，其他样题可反复练习。无需绑卡。':'Get 10 lifetime free uses per solver and 5 fixed samples per practice type. Memory has 10 lifetime free rounds; other samples can be repeated. No card required.'}</p>
  <p className="mt-6 text-3xl font-bold">{PRICE_LABEL} <span className="text-base font-normal">/ {zh?'30 天':'30 days'}</span></p>
  <p className="mt-2 text-gray-600">{zh?'一次付款，付款确认后立即生效 30 天，不自动续费，不叠加原有试用时间。':'One payment for 30 days from payment confirmation. No automatic renewal or addition of unused trial days.'}</p>
  <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
   <h2 className="text-lg font-semibold text-indigo-950">{zh?'升级会员，你将获得':'What membership unlocks'}</h2>
   <ul className="mt-4 space-y-5 text-sm text-slate-600">
    <li><h3 className="font-semibold text-slate-900">{zh?'解题器与记忆训练，不限次数':'Unlimited solvers and memory training'}</h3><p className="mt-1">{zh?'会员有效期内，管道、数字、图形解题器及记忆训练均不限使用次数，不消耗你的免费额度。':'Use pipeline, numerical and figure solvers, plus memory training, without a usage-count limit during membership. Your free credits stay intact.'}</p></li>
    <li><h3 className="font-semibold text-slate-900">{zh?'五类练习，新题不限生成次数':'Unlimited new questions across five practice types'}</h3><p className="mt-1">{zh?'管道推理、数字运算、图形推理、资料分析和记忆训练均可持续生成新题，不再局限于每类 5 道固定样题。':'Keep generating new pipeline, numerical, figure, data and memory exercises, beyond the five fixed samples per type on Free Plan.'}</p></li>
    <li><h3 className="font-semibold text-slate-900">{zh?'按水平选择难度，逐步提高':'Choose your challenge and build up'}</h3><p className="mt-1">{zh?'管道练习可选简单、中等和困难；记忆训练可选 3、5、7 个位置，循序渐进地练习。':'Choose easy, medium or hard pipeline exercises and memory sequences of 3, 5 or 7 positions.'}</p></li>
   </ul>
  </div>
  <p className="mt-4 text-sm text-gray-600">{zh?'学习记录与复习：免费样题和会员练习均支持查看作答记录、解析与错题重练。会员还可重练会员生成题，方便针对薄弱项反复练习。':'Learning history and review: both free samples and member exercises include attempt history, explanations and retries. Membership also lets you retry member-generated questions to work on weaker areas.'}</p>
  <p className="mt-3 text-sm text-gray-500">{zh?'到期后恢复 Free Plan，未用完的免费次数保留；记忆训练的免费额度共 10 轮，不每日重置，开始或重练一轮均计 1 次。':'After expiry, Free Plan resumes with unused credits. Free memory training has 10 lifetime rounds, with no daily reset; starting or retrying a round uses one credit.'}</p>
  <p className="mt-4 text-sm text-gray-500">{zh?'付款后在「我的账号」查看有效期；支付通知可能稍有延迟。':'After payment, check your expiry in My account. Payment confirmation may take a moment.'}</p>
  <Link href="/account" className="mt-3 inline-block text-sm text-indigo-600 underline">{zh?'查看我的账号与使用情况':'View my account and usage'}</Link>
  {enabled&&<p className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">{zh?'通过 Stripe 安全结账，支持支付宝、微信支付及 Visa、Mastercard 等银行卡；实际可用方式以结账页显示为准。':'Pay securely through Stripe with Alipay, WeChat Pay, Visa, Mastercard and other supported cards. Available methods appear at checkout.'}</p>}
  {!enabled&&<p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">{zh?'支付开通中，目前不会收取费用。支付宝、微信支付以正式商户审核和结账页实际可用方式为准。':'Payments are not open yet. No charges are taken. Alipay and WeChat Pay depend on merchant approval and checkout availability.'}</p>}
  <button disabled={!enabled||busy} onClick={buy} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white disabled:opacity-50">{busy?(zh?'正在打开…':'Opening…'):enabled?(zh?'购买 30 天使用权':'Buy 30-day access'):(zh?'即将开放':'Coming soon')}</button>
  {error&&<p role="alert" className="mt-4 text-red-600">{error}</p>}
 </section>;
}
