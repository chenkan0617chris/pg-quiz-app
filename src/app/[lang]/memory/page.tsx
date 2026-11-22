import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { pageMetadata,localePath } from '@/lib/seo';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Link from 'next/link';
import MemoryTraining from '@/components/practice/MemoryTraining';
import InfoTip from '@/components/InfoTip';

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
    <div className="flex items-center gap-2.5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{copy[lang].title}</h1>
      <InfoTip label={lang==='zh'?'玩法说明':'How it works'}>{copy[lang].description} {lang === 'zh' ? '观察结束后可用触屏、鼠标或 Tab 和 Enter 作答。' : 'After watching, answer with touch, mouse, or Tab and Enter.'}</InfoTip>
    </div>
    <p className="mb-7 mt-2 text-[15px] text-slate-500">{lang==='zh'?'记住圆点亮起的顺序，再按顺序点击。':'Remember the order the dots light up, then tap them in order.'}</p>
    <MemoryTraining />
    <p className="mt-6 text-sm"><Link className="text-indigo-600 hover:underline" href={localePath(lang,'/guides/memory')}>{lang==='zh'?'记忆训练攻略 →':'Memory training guide →'}</Link></p>
  </>;
}
