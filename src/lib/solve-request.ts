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
  /** The server refused for lack of free allowance or membership; callers show the upgrade card. */
  const [limited,setLimited] = useState(false);
  async function run(input:unknown):Promise<T | undefined> {
    if (!isLoaded || busy) return;
    setError('');setLimited(false);
    if (!isSignedIn) { await clerk.openSignIn(); return; }
    setBusy(true);
    try {
      const response = await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
      window.dispatchEvent(new Event('account-updated'));
      if (response.status === 401) { await clerk.openSignIn(); return; }
      if (response.status === 403) { setLimited(true); return; }
      if (!response.ok) throw new Error(response.status === 429 ? 'limit' : response.status === 400 ? 'input' : 'server');
      return await response.json() as T;
    } catch (e) {
      setError(e instanceof Error && e.message === 'limit'
        ? (lang==='zh'?'操作太频繁，请一分钟后再试。':'Too many requests. Try again in a minute.')
        : e instanceof Error && e.message === 'input'
        ? (lang==='zh'?'请检查输入，或减少题目规模后重试。':'Check your input or reduce the puzzle size.')
        : (lang==='zh'?'暂时无法解题，请稍后重试。':'Unable to solve right now. Please try again.'));
    } finally { setBusy(false); }
  }
  return {run,busy,ready:isLoaded,error,limited};
}
