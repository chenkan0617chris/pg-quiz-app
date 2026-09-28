import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME } from '@/lib/seo';
import { PRICE_AMOUNT, PRICE_CURRENCY, PRICE_LABEL } from '@/lib/payment-product';
import { PRODUCT_INFO } from '@/content/product-info';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/JsonLd';

type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
 const {lang}=await params;if(!isLanguage(lang))notFound();const copy=PRODUCT_INFO[lang];
 return pageMetadata({lang,path:'/pricing',title:copy.pricingTitle,description:copy.pricingDescription});
}
export default async function Pricing({params}:Props){
 const {lang}=await params;if(!isLanguage(lang))notFound();const c=PRODUCT_INFO[lang];const zh=lang==='zh';
 return <>
  <Breadcrumbs items={[{name:zh?'首页':'Home',href:localePath(lang)},{name:zh?'价格':'Pricing',href:localePath(lang,'/pricing')}]}/>
  <h1 className="text-3xl font-bold">{zh?'会员价格与免费体验':'Pricing and free access'}</h1>
  <p className="mt-5 leading-7 text-slate-600">{c.trial}</p>
  <section className="mt-8 rounded-2xl border border-slate-200 p-6">
   <h2 className="text-2xl font-bold">{PRICE_LABEL} / {zh?'30 天':'30 days'}</h2>
   <p className="mt-4 leading-7">{c.access}</p>
   <ul className="mt-5 list-disc space-y-2 pl-5">{c.included.map(item=><li key={item}>{item}</li>)}</ul>
   <p className="mt-5 text-sm leading-6 text-slate-600">{c.limits}</p>
   <Link href="/billing" className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white">{c.action}</Link>
  </section>
  <p className="mt-8"><Link className="text-indigo-600 underline" href={localePath(lang,'/about')}>{zh?'了解题目来源和工具范围':'Read about question sources and tool scope'}</Link></p>
  <JsonLd data={{'@context':'https://schema.org','@type':'SoftwareApplication',name:SITE_NAME[lang],url:absolute(localePath(lang)),applicationCategory:'EducationalApplication',operatingSystem:'Web browser',description:c.pricingDescription,offers:{'@type':'Offer',price:(PRICE_AMOUNT/100).toFixed(2),priceCurrency:PRICE_CURRENCY.toUpperCase(),url:absolute(localePath(lang,'/pricing')),description:c.access}}}/>
 </>;
}
