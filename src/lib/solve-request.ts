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
      if (response.status === 401) { await clerk.openSignIn(); return; }
      if (!response.ok) throw new Error(response.status === 403 ? 'expired' : response.status === 429 ? 'limit' : response.status === 400 ? 'input' : 'server');
      return await response.json() as T;
    } catch (e) {
      setError(e instanceof Error && e.message === 'expired'
        ? (lang==='zh'?'七天试用已结束。请前往「试用与购买」查看购买选项。':'Your seven-day trial has ended. Visit Trial & pricing for purchase options.')
        : e instanceof Error && e.message === 'limit'
        ? (lang==='zh'?'操作太频繁，请一分钟后再试。':'Too many requests. Try again in a minute.')
        : e instanceof Error && e.message === 'input'
        ? (lang==='zh'?'请检查输入，或减少题目规模后重试。':'Check your input or reduce the puzzle size.')
        : (lang==='zh'?'暂时无法解题，请稍后重试。':'Unable to solve right now. Please try again.'));
    } finally { setBusy(false); }
  }
  return {run,busy,ready:isLoaded,error};
}
