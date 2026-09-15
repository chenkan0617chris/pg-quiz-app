'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

type Account={status:'trial'|'paid'|'expired';trialEndsAt:string;paidUntil:string|null};
export default function TrialStatus(){
 const {userId,isLoaded}=useAuth();
 const {lang}=useI18n();
 return <Status key={userId??'guest'} userId={userId} loaded={isLoaded} zh={lang==='zh'}/>;
}
function Status({userId,loaded,zh}:{userId:string|null|undefined;loaded:boolean;zh:boolean}){
 const [account,setAccount]=useState<Account|null>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!userId)return;
  const controller=new AbortController();
  async function refresh(){
   try{
    const response=await fetch('/api/account',{signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw new Error('Unavailable');
    setAccount(await response.json());setFailed(false);
   }catch{if(!controller.signal.aborted)setFailed(true);}
  }
  void refresh();
  const timer=setInterval(()=>void refresh(),60000);
  window.addEventListener('focus',refresh);
  return ()=>{controller.abort();clearInterval(timer);window.removeEventListener('focus',refresh);};
 },[userId]);
 if(!loaded)return null;
 if(!userId)return <span className="text-gray-500">{zh?'注册即享 7 天免费试用 · 无需绑卡':'7-day free trial · No card required'}</span>;
 if(failed)return <span role="status" className="text-amber-700">{zh?'暂时无法获取试用状态，请稍后重试':'Trial status temporarily unavailable'}</span>;
 if(!account)return <span className="text-gray-500">{zh?'正在读取账户状态…':'Loading account…'}</span>;
 const until=account.status==='paid'?account.paidUntil:account.trialEndsAt;
 const date=until?new Date(until).toLocaleString(zh?'zh-CN':'en-AU'):'';
 return <div role="status" className="max-w-xl text-right text-gray-600">
  {account.status==='expired'
   ? <><span className="font-medium text-amber-700">{zh?'7 天试用已结束':'Your 7-day trial has ended'}</span><p>{zh?'答题记录仍可查看。请前往「试用与购买」查看购买选项，不会自动扣款。':'Your history remains available. Visit Trial & pricing for purchase options. No automatic charge.'}</p></>
   : <><span>{account.status==='paid'?(zh?'付费有效期至：':'Paid access until: '):(zh?'免费试用至：':'Free trial until: ')}{date}</span><p className="text-xs text-gray-400">{account.status==='trial'?(zh?'试用期间也可购买，付款确认起 30 天有效':'Buy during your trial for 30 days from payment confirmation'):(zh?'一次购买，不会自动续费':'One-time purchase. No automatic renewal.')}</p></>}
 </div>;
}
