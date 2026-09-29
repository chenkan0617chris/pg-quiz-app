import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { pageMetadata,localePath } from '@/lib/seo';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Link from 'next/link';
import MemoryTraining from '@/components/practice/MemoryTraining';

type Props = { params: Promise<{ lang: string }> };
const copy = {
  zh: { title: '记忆力训练：圆点顺序记忆', description: '观察蓝色板上依次亮起的粉色圆点，再按顺序点击。提供 3、5、7 个位置的练习，提交后可回看正确顺序。' },
  en: { title: 'Sequence memory training', description: 'Watch pink dots light up on a blue board, then repeat their order. Practise sequences of 3, 5 or 7 positions and review the correct order after submitting.' },
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ lang, path: '/memory', ...copy[lang] });
}
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <>
    <Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:copy[lang].title,href:localePath(lang,'/memory')}]}/>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{copy[lang].title}</h1>
    <p className="mb-8 mt-4 max-w-3xl text-sm leading-7 text-slate-600">{copy[lang].description}</p>
    <MemoryTraining />
    <p className="mt-6 text-sm"><Link className="text-indigo-600 underline" href={localePath(lang,'/guides/memory')}>{lang==='zh'?'阅读圆点记忆方法与 Grid 类题的区别':'Read the memory guide and how it differs from Grid-style tasks'}</Link></p>
    <p className="mt-8 text-xs leading-6 text-slate-500">{lang === 'zh' ? '原创顺序记忆练习，不代表任何雇主的真实试题。25 个白色圆点散布在蓝色画布上；观察结束后可用触屏、鼠标或 Tab 和 Enter 作答。' : 'Original sequence-memory practice, not actual assessment content from any employer. 25 white dots are scattered across a blue canvas. After watching, use touch, mouse, or Tab and Enter to answer.'}</p>
  </>;
}
