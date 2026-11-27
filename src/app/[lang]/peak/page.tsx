import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EnglishTestContent from '@/components/seo/EnglishTestContent';
import PeakTraining from '@/components/exam/PeakTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/peak',title:lang==='zh'?'宝洁 PEAK 测评练习：工作风格问卷题型与作答技巧 | CK Quiz':'P&G PEAK Performance Assessment: Free Practice & Example Questions',description:lang==='zh'?'宝洁 PEAK 工作风格专项训练：陈述打分、二选一和职场情境题，每轮随机抽题，附一致性检查与情境分析。':'What the P&G PEAK Performance Assessment asks and how to answer it. Try free example questions in all three formats (rating, forced choice, scenarios) with a consistency check. No sign-up.'});}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'工作风格熟悉练习':'PEAK assessment',href:localePath(lang,'/peak')}]}/><PeakTraining/>{lang==='en'&&<EnglishTestContent page="peak"/>}</>;
}
