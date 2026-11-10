import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EnglishTestContent from '@/components/seo/EnglishTestContent';
import PeakTraining from '@/components/exam/PeakTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/peak',title:lang==='zh'?'PEAK 工作风格熟悉练习':'P&G PEAK Performance Assessment Practice | CK Quiz',description:lang==='zh'?'宝洁 PEAK 工作风格专项训练：陈述打分、二选一和职场情境题，每轮随机抽题，附一致性检查与情境分析。':'Practise the P&G PEAK Performance Assessment formats: rating statements, forced-choice pairs and workplace scenarios, with consistency checks and tips.'});}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'工作风格熟悉练习':'PEAK assessment',href:localePath(lang,'/peak')}]}/><PeakTraining/>{lang==='en'&&<EnglishTestContent page="peak"/>}</>;
}
