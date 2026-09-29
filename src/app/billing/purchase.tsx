'use client';
import PlanComparison from './plan-comparison';
import { useAccount } from '@/lib/use-account';
import { useState } from 'react';
import { useAuth,useClerk } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
export default function Purchase({enabled}:{enabled:boolean}){
 const {isSignedIn}=useAuth();const clerk=useClerk();const {lang}=useI18n();const zh=lang==='zh';
 const {account,isLoaded,failed}=useAccount();
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
 return <PlanComparison zh={zh} enabled={enabled} busy={busy} error={error} account={account}
  signedIn={!!isSignedIn} loading={!isLoaded || (!!isSignedIn && !account && !failed)} failed={failed} onBuy={buy}/>;
}
