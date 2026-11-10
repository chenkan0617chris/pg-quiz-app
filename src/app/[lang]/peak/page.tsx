import Breadcrumbs from '@/components/seo/Breadcrumbs';
import PeakTraining from '@/components/exam/PeakTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/peak',title:lang==='zh'?'PEAK 工作风格熟悉练习':'PEAK work style familiarization',description:lang==='zh'?'宝洁 PEAK 工作风格专项训练：陈述打分、二选一和职场情境题，每轮随机抽题，附一致性检查与情境分析。':'PEAK work-style training with rating statements, forced-choice pairs and workplace scenarios, drawn at random each round with consistency checks.'});}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'工作风格熟悉练习':'Work style practice',href:localePath(lang,'/peak')}]}/><PeakTraining/></>;
}
