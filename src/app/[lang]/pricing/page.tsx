import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME } from '@/lib/seo';
import { priceFor } from '@/lib/payment-product';
import { PRODUCT_INFO } from '@/content/product-info';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
 const {lang}=await params;if(!isLanguage(lang))notFound();const copy=PRODUCT_INFO[lang];
 return pageMetadata({lang,path:'/pricing',title:copy.pricingTitle,description:copy.pricingDescription});
}
export default async function Pricing({params}:Props){
 const {lang}=await params;if(!isLanguage(lang))notFound();const c=PRODUCT_INFO[lang];const zh=lang==='zh';const price=priceFor(lang);
 return <>
  <Breadcrumbs items={[{name:zh?'首页':'Home',href:localePath(lang)},{name:zh?'价格':'Pricing',href:localePath(lang,'/pricing')}]}/>
  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{zh?'价格':'Pricing'}</h1>
  <p className="mt-2 text-[15px] text-slate-500">{zh?'免费开始，需要时再买 7 天会员。一次付款，不自动续费。':'Start free. Buy a 7-day pass when you need it: one payment, no auto-renewal.'}</p>
  <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
   <section className="rounded-2xl border border-indigo-200 p-6 sm:p-7">
    <p className="text-sm font-medium text-indigo-600">{zh?'7 天会员':'7-day pass'}</p>
    <h2 className="mt-1 text-3xl font-bold">{price.label}<span className="ml-1 text-base font-normal text-slate-400">/ {zh?'7 天':'7 days'}</span></h2>
    <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-700">{c.included.map(item=><li key={item} className="flex gap-2"><span aria-hidden="true" className="text-indigo-500">✓</span><span>{item}</span></li>)}</ul>
    <Link href="/billing" className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">{c.action}</Link>
    <p className="mt-4 text-xs leading-5 text-slate-400">{c.access}</p>
   </section>
   <section className="rounded-2xl bg-slate-50 p-6 sm:p-7">
    <p className="text-sm font-medium text-slate-600">{zh?'注册即可':'With a free account'}</p>
    <h2 className="mt-1 text-3xl font-bold">{zh?'免费':'Free'}</h2>
    <p className="mt-5 text-sm leading-6 text-slate-600">{c.trial}</p>
    <p className="mt-4 text-xs leading-5 text-slate-400">{c.limits}</p>
   </section>
  </div>
  <p className="mt-8 text-sm"><Link className="text-indigo-600 hover:underline" href={localePath(lang,'/about')}>{zh?'题目来源与工具范围 →':'Question sources and tool scope →'}</Link></p>
  <JsonLd data={{'@context':'https://schema.org','@type':'SoftwareApplication',name:SITE_NAME[lang],url:absolute(localePath(lang)),applicationCategory:'EducationalApplication',operatingSystem:'Web browser',description:c.pricingDescription,offers:{'@type':'Offer',price:(price.amount/100).toFixed(2),priceCurrency:price.code,url:absolute(localePath(lang,'/pricing')),description:c.access}}}/>
 </>;
}
