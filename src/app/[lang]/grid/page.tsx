import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EnglishTestContent from '@/components/seo/EnglishTestContent';
import GridTraining from '@/components/exam/GridTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/grid',title:lang==='zh'?'空间记忆训练 · Grid 风格练习':'P&G Grid Challenge Practice: Dot Memory Training | CK Quiz',description:lang==='zh'?'练习记忆圆点位置、判断图案对称并按顺序回忆。免费体验完整空间记忆样题。':'Practise the P&G Grid Challenge: remember dot positions in order while answering symmetry questions. Free sample board, random rounds and memory tips.'});}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'空间记忆训练':'Grid Challenge',href:localePath(lang,'/grid')}]}/><GridTraining/>{lang==='en'&&<EnglishTestContent page="grid"/>}</>;
}
