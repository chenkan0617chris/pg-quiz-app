import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ExamCenter from '@/components/exam/ExamCenter';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return pageMetadata({lang,path:'/exams',title:lang==='zh'?'宝洁管道题模拟考试｜计算与空间记忆训练 | CK Quiz':'Mock exam centre · timed exams and reports',description:lang==='zh'?'宝洁管道题模拟考试与计算题、空间记忆训练：会员可限时作答，保存逐题成绩和耗时。可免费预览考场与报告；题目为独立原创，非官方测评。':'Timed Switch, Digit and Grid mock exams with saved question reviews. Free exam and report previews.'});
}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'宝洁管道题模拟考试':'Mock exams',href:localePath(lang,'/exams')}]}/><ExamCenter/></>;
}
