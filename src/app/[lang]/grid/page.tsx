import GridTraining from '@/components/exam/GridTraining';
import { pageMetadata } from '@/lib/seo';
import { isLanguage } from '@/lib/language';
import { notFound } from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!isLanguage(lang))notFound();return pageMetadata({lang,path:'/grid',title:lang==='zh'?'空间记忆训练 · Grid 风格练习':'Grid memory training',description:lang==='zh'?'练习记忆圆点位置、判断图案对称并按顺序回忆。免费体验完整空间记忆样题。':'Practise dot memory with interleaved spatial judgements and ordered recall. Try a free sample.'});}
export default function Page(){return <GridTraining/>;}
