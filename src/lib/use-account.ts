'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import type { SolverRemaining } from './access-policy';

export type Account={memoryRemaining:number;practiceUsage:Record<string,{started:number;completed:number}>;status:'trial'|'paid'|'expired';trialEndsAt:string;paidUntil:string|null;solverRemaining:SolverRemaining};
export function useAccount() {
 const {userId,isLoaded}=useAuth();
 const [state,setState]=useState<{userId:string;account:Account}|null>(null);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  if(!userId)return;
  const controller=new AbortController();
  async function refresh(){
   try {
    const response=await fetch('/api/account',{signal:controller.signal,cache:'no-store'});
    if(!response.ok)throw new Error('Unavailable');
    const account=await response.json() as Account;
    if(!controller.signal.aborted){setState({userId:userId!,account});setFailed(false);}
   }catch{if(!controller.signal.aborted)setFailed(true);}
  }
  void refresh();
  window.addEventListener('focus',refresh);
  window.addEventListener('account-updated',refresh);
  return ()=>{controller.abort();window.removeEventListener('focus',refresh);window.removeEventListener('account-updated',refresh);};
 },[userId]);
 return {userId,isLoaded,account:state&&state.userId===userId?state.account:null,failed};
}
