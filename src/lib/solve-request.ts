'use client';
import { useState } from 'react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useI18n } from './i18n';

export function useSolveRequest<T>(path:string) {
  const {isLoaded,isSignedIn} = useAuth();
  const clerk = useClerk();
  const {lang} = useI18n();
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  async function run(input:unknown):Promise<T | undefined> {
    if (!isLoaded || busy) return;
    setError('');
    if (!isSignedIn) { await clerk.openSignIn(); return; }
    setBusy(true);
    try {
      const response = await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
      window.dispatchEvent(new Event('account-updated'));
      if (response.status === 401) { await clerk.openSignIn(); return; }
      if (!response.ok) throw new Error(response.status === 403 ? 'expired' : response.status === 429 ? 'limit' : response.status === 400 ? 'input' : 'server');
      return await response.json() as T;
    } catch (e) {
      setError(e instanceof Error && e.message === 'expired'
        ? (lang==='zh'?'免费次数已用完，或该练习需要会员。请前往「会员与价格」解锁 30 天使用权。':'Free uses are exhausted or this practice requires paid access. Visit Membership & pricing to unlock 30 days.')
        : e instanceof Error && e.message === 'limit'
        ? (lang==='zh'?'操作太频繁，请一分钟后再试。':'Too many requests. Try again in a minute.')
        : e instanceof Error && e.message === 'input'
        ? (lang==='zh'?'请检查输入，或减少题目规模后重试。':'Check your input or reduce the puzzle size.')
        : (lang==='zh'?'暂时无法解题，请稍后重试。':'Unable to solve right now. Please try again.'));
    } finally { setBusy(false); }
  }
  return {run,busy,ready:isLoaded,error};
}
