import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_URL } from '@/lib/seo';
import { PRODUCT_INFO, EDITORIAL_UPDATED, PUBLISHER_NAME, OFFICIAL_HIRING_URL } from '@/content/product-info';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
type Props={params:Promise<{lang:string}>};
export async function generateMetadata({params}:Props){const {lang}=await params;if(!isLanguage(lang))notFound();const c=PRODUCT_INFO[lang];return pageMetadata({lang,path:'/about',title:c.aboutTitle,description:c.aboutDescription});}
export default async function About({params}:Props){
 const {lang}=await params;if(!isLanguage(lang))notFound();const c=PRODUCT_INFO[lang];const zh=lang==='zh';
 return <>
  <Breadcrumbs items={[{name:zh?'首页':'Home',href:localePath(lang)},{name:zh?'关于本站':'About',href:localePath(lang,'/about')}]}/>
  <article className="space-y-5 text-[15px] leading-7 text-slate-700">
   <h1 className="text-3xl font-bold text-slate-900">{zh?'关于本站与题目编写方法':'About this site and our question methodology'}</h1>
   {c.about.map(p=><p key={p}>{p}</p>)}
   <h2 className="pt-4 text-xl font-bold">{c.methodTitle}</h2>
   <ul className="list-disc space-y-3 pl-5">{c.method.map(p=><li key={p}>{p}</li>)}</ul>
   <h2 className="pt-4 text-xl font-bold">{c.sourcesTitle}</h2>
   <p>{c.sourceNote}</p>
   <p><a href={OFFICIAL_HIRING_URL} className="text-indigo-600 underline">P&G Careers — Hiring process</a></p>
   <p>{zh?'阅读':'Read'} <Link className="text-indigo-600 underline" href={localePath(lang,'/guides')}>{zh?'四类解题攻略':'the four solving guides'}</Link> · <Link className="text-indigo-600 underline" href={localePath(lang,'/pricing')}>{zh?'会员价格与免费体验':'Pricing and free access'}</Link></p>
   <p className="text-sm text-slate-500">{PUBLISHER_NAME} · {zh?'更新于':'Updated'} <time dateTime={EDITORIAL_UPDATED}>{EDITORIAL_UPDATED}</time></p>
  </article>
  <JsonLd data={{'@context':'https://schema.org','@type':'AboutPage',url:absolute(localePath(lang,'/about')),name:c.aboutTitle,description:c.aboutDescription,mainEntity:{'@type':'Organization','@id':`${SITE_URL}/#org`,name:PUBLISHER_NAME,url:SITE_URL}}}/>
 </>;
}
