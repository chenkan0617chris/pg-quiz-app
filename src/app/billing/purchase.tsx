'use client';
import PlanComparison from './plan-comparison';
import { useAccount } from '@/lib/use-account';
import { useCheckout } from '@/lib/use-checkout';
import { useEffect, useRef } from 'react';
import { reportConversion } from '@/lib/conversion-client';
import { useAuth } from '@clerk/nextjs';
import { useI18n } from '@/lib/i18n';
export default function Purchase({enabled}:{enabled:boolean}){
 const {isSignedIn}=useAuth();const {lang}=useI18n();const zh=lang==='zh';
 const {account,isLoaded,failed}=useAccount();
 const {buy,busy,error}=useCheckout();
 // Funnel step between "saw an upgrade prompt" and "opened checkout": a free account looked at the price.
 const pricingRecorded=useRef(false);
 useEffect(()=>{
  if(!isSignedIn || !account || account.status==='paid' || pricingRecorded.current)return;
  pricingRecorded.current=true;
  reportConversion('pricing_viewed');
 },[isSignedIn,account]);
 return <PlanComparison zh={zh} enabled={enabled} busy={busy} error={error} account={account}
  signedIn={!!isSignedIn} loading={!isLoaded || (!!isSignedIn && !account && !failed)} failed={failed} onBuy={()=>void buy()}/>;
}
