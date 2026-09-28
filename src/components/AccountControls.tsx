'use client';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function AccountControls() {
  const {lang} = useI18n();
  return <div className="mb-6 flex flex-wrap items-center justify-end gap-3 text-sm">
    <Link href="/billing" className="text-indigo-600 hover:underline">{lang==='zh'?'会员与价格':'Membership & pricing'}</Link>
    <Show when="signed-in"><Link href="/account" className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-100">{lang==='zh'?'我的账号':'My account'}</Link></Show>
    <Show when="signed-out">
      <SignInButton mode="modal"><button className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">{lang==='zh'?'登录':'Sign in'}</button></SignInButton>
      <SignUpButton mode="modal"><button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">{lang==='zh'?'注册':'Sign up'}</button></SignUpButton>
    </Show>
    <Show when="signed-in"><UserButton /></Show>
  </div>;
}
