import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EnglishTestContent from '@/components/seo/EnglishTestContent';
import VerbalTraining from '@/components/exam/VerbalTraining';
import { pageMetadata, localePath } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';

export async function generateMetadata({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return pageMetadata({lang,path:'/verbal',
    title:lang==='zh'?'英文言语推理练习 True/False/Cannot Say｜外企四大笔试 | CK Quiz':'Free Verbal Reasoning Test Practice: True, False, Cannot Say | CK Quiz',
    description:lang==='zh'?'免费英文言语推理练习：SHL、Aon、Talent Q 等外企、四大、投行笔试常考的 True / False / Cannot Say 题型。原创短文，逐题解析判断依据。':'Free verbal reasoning practice in the True / False / Cannot Say format used by SHL, Aon (cut-e) and Talent Q tests. Original passages with the reasoning for every answer.',
    keywords:lang==='zh'?['言语推理','英文言语推理','SHL 言语推理','四大笔试','外企笔试','True False Cannot Say']:['verbal reasoning test','verbal reasoning practice','true false cannot say','SHL verbal reasoning','graduate verbal reasoning test']});
}
export default async function Page({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!isLanguage(lang))notFound();
  return <><Breadcrumbs items={[{name:lang==='zh'?'首页':'Home',href:localePath(lang)},{name:lang==='zh'?'言语推理':'Verbal reasoning',href:localePath(lang,'/verbal')}]}/><VerbalTraining/>{lang==='en'&&<EnglishTestContent page="verbal"/>}</>;
}
