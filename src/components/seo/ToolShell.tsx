import Link from 'next/link';
import type { Language } from '@/lib/language';
import { localePath } from '@/lib/seo';
import { GUIDE_LABELS, getGuide } from '@/content/guides';
import type { ToolCopy } from '@/content/tools';
import { UI } from '@/content/site';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

/**
 * Server-rendered frame around each interactive solver. The tools themselves
 * are client components with almost no crawlable text, so the surrounding copy,
 * breadcrumbs and guide links are what give these URLs something to rank on.
 */
export default function ToolShell({
  lang,
  path,
  copy,
  children,
}: {
  lang: Language;
  path: string;
  copy: ToolCopy;
  children: React.ReactNode;
}) {
  const ui = UI[lang];
  const guide = getGuide(lang, copy.guide);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: ui.home, href: localePath(lang) },
          { name: copy.label, href: localePath(lang, path) },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{copy.h1}</h1>
      <p className="mt-4 mb-8 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.intro}</p>

      {children}

      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900">{lang === 'zh' ? '使用说明与限制' : 'How to use it, and what it does not do'}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-600 marker:text-slate-400">
          {copy.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href={localePath(lang, `/guides/${copy.guide}`)} className="font-medium text-indigo-600 hover:underline">
            {lang === 'zh' ? `${GUIDE_LABELS.zh[copy.guide]}解题攻略` : `${GUIDE_LABELS.en[copy.guide]} guide`}
          </Link>
          <Link href={localePath(lang, guide.toolHref === path ? '/practice' : guide.toolHref)} className="text-slate-600 hover:text-indigo-600 hover:underline">
            {ui.practice}
          </Link>
        </p>
      </section>

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
