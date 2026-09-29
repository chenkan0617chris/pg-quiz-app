'use client';

import { useI18n } from '@/lib/i18n';

export default function PageLoading() {
  const { lang } = useI18n();
  return (
    <section role="status" aria-live="polite" className="space-y-7 py-2" data-page-loading>
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <span aria-hidden="true" className="size-4 rounded-full border-2 border-indigo-100 border-t-indigo-600 motion-safe:animate-spin" />
        {lang === 'zh' ? '正在加载内容…' : 'Loading content…'}
      </p>
      <div aria-hidden="true" className="space-y-7 motion-safe:animate-pulse">
        <div className="space-y-3"><div className="h-8 w-2/3 max-w-sm rounded-lg bg-slate-200" /><div className="h-4 w-4/5 rounded bg-slate-100" /></div>
        <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 h-5 w-32 rounded bg-slate-200" />
          <div className="h-48 rounded-xl bg-slate-100 sm:h-64" />
          <div className="mt-6 h-10 w-32 rounded-lg bg-indigo-50" />
        </div>
      </div>
    </section>
  );
}
