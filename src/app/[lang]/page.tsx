import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage, type Language } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { priceFor } from '@/lib/payment-product';
import { PUBLISHER_NAME } from '@/content/product-info';
import { HOME } from '@/content/home';
import JsonLd from '@/components/JsonLd';
import FaqSection from '@/components/seo/FaqSection';
import MoreInfo from '@/components/MoreInfo';

type Props = { params: Promise<{ lang: string }> };

async function resolve(params: Props['params']): Promise<Language> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return lang;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await resolve(params);
  const copy = HOME[lang];
  return pageMetadata({ lang, title: copy.title, description: copy.description, keywords: copy.keywords });
}

export default async function HomePage({ params }: Props) {
  const lang = await resolve(params);
  const copy = HOME[lang];
  const href = (path: string) => localePath(lang, path);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              '@id': `${absolute(href(''))}#website`,
              url: absolute(href('')),
              name: SITE_NAME[lang],
              inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
              publisher: { '@id': `${SITE_URL}/#org` },
            },
            {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#org`,
              name: PUBLISHER_NAME,
              url: SITE_URL,
              description: copy.description,
            },
            {
              '@type': 'WebPage',
              '@id': `${absolute(href(''))}#page`,
              url: absolute(href('')),
              name: copy.title,
              description: copy.description,
              isPartOf: { '@id': `${absolute(href(''))}#website` },
              inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
            },
          ],
        }}
      />

      <header className="pb-2 pt-2 sm:pt-6">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-[40px] sm:leading-[1.15]">{copy.h1}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{copy.tagline}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={href(copy.primaryCta.href)} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            {copy.primaryCta.label}
          </Link>
          <Link href={href(copy.secondaryCta.href)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {copy.secondaryCta.label}
          </Link>
        </div>
      </header>

      <section className="mt-14" aria-labelledby="home-cards">
        <h2 id="home-cards" className="text-lg font-semibold text-slate-900">{copy.cardsHeading}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map((card) => (
            <li key={card.href}>
              <Link href={href(card.href)} className="group flex h-full flex-col rounded-xl border border-slate-200 p-5 transition hover:border-indigo-300 hover:shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 group-hover:text-indigo-700">{card.name}</span>
                  {card.tag && <span className="rounded border border-slate-200 px-1.5 py-px text-[10px] font-medium text-slate-500">{card.tag}</span>}
                </span>
                <span className="mt-1.5 text-sm leading-6 text-slate-500">{card.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="home-guides">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="home-guides" className="text-lg font-semibold text-slate-900">{lang === 'zh' ? '解题攻略' : 'Guides'}</h2>
          <Link href={href('/guides')} className="text-sm text-indigo-600 hover:underline">{lang === 'zh' ? '全部攻略 →' : 'All guides →'}</Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {([
            ['/guides/assessment', lang === 'zh' ? '在线测评入门' : 'Getting started'],
            ...copy.types.map((type) => [`/guides/${type.slug}`, type.name] as const),
            ['/guides/aon-assessment', lang === 'zh' ? 'Aon / cut-e' : 'Aon (cut-e)'],
            ['/guides/shl-assessment', 'SHL'],
            ['/guides/company-assessments', lang === 'zh' ? '哪些公司考管道题' : 'Which companies use these tests'],
            ['/guides/pwc-assessment', lang === 'zh' ? '普华永道' : 'PwC'],
            ['/guides/deloitte-assessment', lang === 'zh' ? '德勤' : 'Deloitte'],
            ['/guides/kpmg-assessment', lang === 'zh' ? '毕马威' : 'KPMG'],
            ['/guides/ey-assessment', lang === 'zh' ? '安永' : 'EY'],
            ['/guides/unilever-assessment', lang === 'zh' ? '联合利华' : 'Unilever'],
          ] as const).map(([path, label]) => (
            <li key={path}>
              <Link href={href(path)} className="inline-block rounded-full border border-slate-200 px-3 py-1.5 text-slate-600 hover:border-indigo-300 hover:text-indigo-700">{label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 px-6 py-5">
        <div>
          <h2 className="font-semibold text-slate-900">{lang === 'zh' ? '免费开始，需要时再升级' : 'Start free, upgrade when you need to'}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {lang === 'zh'
              ? `每种工具 10 次、每类题 10 道免费 · 7 天会员 ${priceFor(lang).label}，不自动续费`
              : `10 free uses per tool and 10 questions per type · 7-day pass ${priceFor(lang).label}, no auto-renewal`}
          </p>
        </div>
        <Link href={href('/pricing')} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {copy.accessCta}
        </Link>
      </section>

      <FaqSection heading={copy.faqHeading} items={copy.faq} />

      <MoreInfo summary={lang === 'zh' ? '了解五种题型与使用方法' : 'About the question types and how to use this site'}>
        <div className="max-w-3xl space-y-8 text-sm leading-7 text-slate-600">
          <p>{copy.lede}</p>
          {lang === 'zh' && (
            <section aria-labelledby="pipeline-start">
              <h3 id="pipeline-start" className="font-semibold text-slate-900">宝洁管道题怎么做？先看一个重排例子</h3>
              <p className="mt-2">把四个不同图形依次记作 A、B、C、D。代码 3142 表示依次取当前序列的第 3、1、4、2 位，所以 A B C D 会变成 C A D B。数字代表位置，每经过一个方框，都要以刚得到的新序列为准。</p>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-center font-mono text-indigo-900" aria-label="输入 A B C D，经过规则 3142，输出 C A D B">A B C D → [3142] → C A D B</p>
              <p className="mt-3">有未知方框时，先正推它之前的已知规则，再从最终输出逆推它之后的规则。对照未知方框两端的顺序，就能确定代码；最后代回整条管道检查。<Link className="ml-1 text-indigo-600 underline" href={href('/guides/pipeline')}>阅读完整攻略</Link></p>
            </section>
          )}
          <section>
            <h3 className="font-semibold text-slate-900">{copy.typesHeading}</h3>
            <ul className="mt-2 space-y-3">
              {copy.types.map((type) => (
                <li key={type.slug}>
                  <Link href={href(`/guides/${type.slug}`)} className="font-medium text-slate-800 hover:text-indigo-700">{type.name}</Link>{lang === 'zh' ? '：' : ': '}{type.blurb}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-slate-900">{copy.howHeading}</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              {copy.how.map((step) => <li key={step.title}><span className="font-medium text-slate-800">{step.title}{lang === 'zh' ? '。' : '. '}</span>{step.text}</li>)}
            </ol>
          </section>
          <section>
            <h3 className="font-semibold text-slate-900">{copy.whyHeading}</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              {copy.why.map((item) => <li key={item.title}><span className="font-medium text-slate-800">{item.title}{lang === 'zh' ? '。' : '. '}</span>{item.text}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-slate-900">{copy.accessHeading}</h3>
            <p className="mt-2">{copy.accessText}</p>
          </section>
        </div>
      </MoreInfo>
    </>
  );
}
