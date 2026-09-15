'use client';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import TrialStatus from './TrialStatus';
import { useI18n } from '@/lib/i18n';

export default function AccountControls() {
  const {lang} = useI18n();
  return <div className="mb-6 flex flex-wrap items-center justify-end gap-3 text-sm">
    <Link href="/billing" className="text-indigo-600 hover:underline">{lang==='zh'?'试用与购买':'Trial & pricing'}</Link>
    <TrialStatus />
    <Show when="signed-out">
      <SignInButton mode="modal"><button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">{lang==='zh'?'登录':'Sign in'}</button></SignInButton>
      <SignUpButton mode="modal"><button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">{lang==='zh'?'注册':'Sign up'}</button></SignUpButton>
    </Show>
    <Show when="signed-in"><UserButton /></Show>
  </div>;
}
