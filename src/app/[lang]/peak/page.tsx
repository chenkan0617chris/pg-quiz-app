import Breadcrumbs from '@/components/seo/Breadcrumbs';
import PeakTraining from '@/components/exam/PeakTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/peak',title:lang==='zh'?'PEAK 工作风格熟悉练习':'PEAK work style familiarization',description:lang==='zh'?'了解宝洁 PEAK 工作风格流程，通过原创陈述熟悉自我判断与工作情境反思。':'Explore the PEAK work style process through original reflection statements.'});}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'工作风格熟悉练习':'Work style practice',href:localePath(lang,'/peak')}]}/><PeakTraining/></>;
}
