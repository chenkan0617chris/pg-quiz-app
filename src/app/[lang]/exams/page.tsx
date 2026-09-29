import ExamCenter from '@/components/exam/ExamCenter';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return pageMetadata({lang,path:'/exams',title:lang==='zh'?'模拟考中心 · 限时考试与成绩复盘':'Mock exam centre · timed exams and reports',description:lang==='zh'?'完整管道、数字、空间记忆模拟考试，会员全屏限时作答，保存逐题成绩与耗时。免费预览考场与报告。':'Timed Switch, Digit and Grid mock exams with saved question reviews. Free exam and report previews.'});
}
export default function Page(){return <ExamCenter/>;}
