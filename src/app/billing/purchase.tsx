'use client';
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
  <h1 className="text-2xl font-bold">{zh?'试用与购买':'Trial and access'}</h1>
  <p className="mt-4 text-gray-600">{zh?'注册即享七天免费试用，无需绑卡。试用期间也可随时购买。':'Enjoy a seven-day free trial with no card required. You can also purchase at any time during your trial.'}</p>
  <p className="mt-6 text-3xl font-bold">{PRICE_LABEL} <span className="text-base font-normal">/ {zh?'30 天':'30 days'}</span></p>
  <p className="mt-2 text-gray-600">{zh?'包含解题与练习。付款确认后立即生效，有效期 30 天，不叠加剩余试用时间。一次购买，不自动续费。':'Includes solving and practice. Access starts when payment is confirmed and lasts 30 days; unused trial days are not added. One-time purchase, no automatic renewal.'}</p>
  <p className="mt-4 text-sm text-gray-500">{zh?'付款后以页面上方的账户有效期为准；支付通知可能稍有延迟。':'After payment, check your access expiry above. Payment confirmation may take a moment.'}</p>
  {enabled&&<p className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">{zh?'支持 Visa、Mastercard 等银行卡，通过 Stripe 安全结账。支付宝、微信支付仍待批准，以结账页显示为准。':'Pay securely through Stripe with Visa, Mastercard and other supported cards. Alipay and WeChat Pay are awaiting approval; available methods appear at checkout.'}</p>}
  {!enabled&&<p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">{zh?'支付开通中，目前不会收取费用。支付宝、微信支付以正式商户审核和结账页实际可用方式为准。':'Payments are not open yet. No charges are taken. Alipay and WeChat Pay depend on merchant approval and checkout availability.'}</p>}
  <button disabled={!enabled||busy} onClick={buy} className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white disabled:opacity-50">{busy?(zh?'正在打开…':'Opening…'):enabled?(zh?'购买 30 天使用权':'Buy 30-day access'):(zh?'即将开放':'Coming soon')}</button>
  {error&&<p role="alert" className="mt-4 text-red-600">{error}</p>}
 </section>;
}
