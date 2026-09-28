import Image from 'next/image';
import type { Language } from '@/lib/language';
import type { GuideSlug } from '@/content/guides';

export default function GuideIllustration({slug,lang}:{slug:GuideSlug;lang:Language}) {
 if(slug!=='pipeline'&&slug!=='numerical')return null;
 const pipeline=slug==='pipeline';
 const alt=pipeline?(lang==='zh'?'输入 ABCD，按第 3、1、4、2 位取出符号，得到 CADB。':'Input ABCD, read positions 3, 1, 4, 2 to get CADB.'):(lang==='zh'?'不重复数字例题：3 × 6 + 5 = 23，是一个可行解。':'Distinct-digit example: 3 × 6 + 5 = 23 is one valid solution.');
 return <figure className="mb-8">
  <Image src={`/learn/${pipeline?'permutation':'numerical'}-example.svg`} alt={alt} width={1200} height={675} className="h-auto w-full rounded-xl border border-slate-200"/>
  <figcaption className="mt-2 text-sm text-slate-500">{lang==='zh'?'本站原创练习示例：':'Original practice example: '}{alt}</figcaption>
 </figure>;
}
