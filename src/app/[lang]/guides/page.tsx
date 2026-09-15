import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage, type Language } from '@/lib/language';
import { localePath, pageMetadata } from '@/lib/seo';
import { GUIDE_LABELS, GUIDE_SLUGS, getGuide } from '@/content/guides';
import { UI } from '@/content/site';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

type Props = { params: Promise<{ lang: string }> };

const INDEX: Record<Language, { title: string; description: string; h1: string; lede: string; keywords: string[] }> = {
  zh: {
    title: '笔试解题攻略 | 管道·图形·数字·资料分析',
    description:
      '四类笔试推理题的完整解题攻略：管道推理、图形推理、数字推理与图表数据分析。每篇讲清题目结构、标准流程、示例推导与常见失分点。',
    h1: '笔试解题攻略',
    lede:
      '每篇攻略都围绕一个目标：把该题型从"看感觉"变成一套可以重复执行的流程。内容包括题目的底层结构、固定的排查顺序、完整的示例推导，以及最常见的失分点。',
    keywords: ['笔试解题技巧', '推理题攻略', '宝洁笔试技巧', '图形推理技巧', '管道题解法'],
  },
  en: {
    title: 'Solving Guides — Pipeline, Figure, Numerical, Data',
    description:
      'Full solving guides for four reasoning question types: pipeline logic, figure series, numerical reasoning and data interpretation. Each covers the structure, a standard procedure, worked examples and common mistakes.',
    h1: 'Solving guides',
    lede:
      'Every guide has the same goal: to turn a question type from something you eyeball into a procedure you can repeat. Each one covers the structure underneath the question, a fixed checking order, a full worked example, and the mistakes that cost the most marks.',
    keywords: ['aptitude test guides', 'reasoning test technique', 'P&G assessment tips', 'figure series technique', 'pipeline logic method'],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = INDEX[lang];
  return pageMetadata({ lang, path: '/guides', title: copy.title, description: copy.description, keywords: copy.keywords });
}

export default async function GuidesIndex({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = INDEX[lang];
  const ui = UI[lang];

  return (
    <>
      <Breadcrumbs items={[{ name: ui.home, href: localePath(lang) }, { name: ui.guides, href: localePath(lang, '/guides') }]} />
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{copy.h1}</h1>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.lede}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {GUIDE_SLUGS.map((slug) => {
          const guide = getGuide(lang, slug);
          return (
            <article key={slug} className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-base font-semibold text-slate-900">
                <Link href={localePath(lang, `/guides/${slug}`)} className="hover:text-indigo-600 hover:underline">
                  {GUIDE_LABELS[lang][slug]}
                </Link>
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guide.description}</p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href={localePath(lang, `/guides/${slug}`)} className="font-medium text-indigo-600 hover:underline">{ui.readGuide}</Link>
                <Link href={localePath(lang, guide.toolHref)} className="text-slate-600 hover:text-indigo-600 hover:underline">{guide.toolLabel}</Link>
              </p>
            </article>
          );
        })}
      </div>

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
