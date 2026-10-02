import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage, type Language } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { PRICE_LABEL } from '@/lib/payment-product';
import { PUBLISHER_NAME } from '@/content/product-info';
import { HOME } from '@/content/home';
import { UI } from '@/content/site';
import JsonLd from '@/components/JsonLd';
import FaqSection from '@/components/seo/FaqSection';

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
  const ui = UI[lang];
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

      <header className="border-b border-slate-200 pb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{copy.h1}</h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.lede}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={href(copy.primaryCta.href)} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
            {copy.primaryCta.label}
          </Link>
          <Link href={href(copy.secondaryCta.href)} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {copy.secondaryCta.label}
          </Link>
        </div>
        <p className="mt-5 text-sm"><Link href={href('/guides/assessment')} className="text-indigo-600 underline">{lang==='zh'?'第一次准备在线测评？从这里开始':'Preparing for an online assessment? Start here'}</Link></p>
      </header>

      {lang === 'zh' && <section className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 sm:p-8" aria-labelledby="pipeline-start">
        <h2 id="pipeline-start" className="text-xl font-bold text-slate-900">宝洁管道题怎么做？先看一个重排例子</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">把四个不同图形依次记作 A、B、C、D。代码 3142 表示依次取当前序列的第 3、1、4、2 位，所以 A B C D 会变成 C A D B。数字代表位置，每经过一个方框，都要以刚得到的新序列为准。</p>
        <p className="mt-4 rounded-lg border border-indigo-100 bg-white p-4 text-center font-mono text-base text-indigo-900" aria-label="输入 A B C D，经过规则 3142，输出 C A D B">A B C D → [3142] → C A D B</p>
        <p className="mt-4 text-sm leading-7 text-slate-600">有未知方框时，先正推它之前的已知规则，再从最终输出逆推它之后的规则。对照未知方框两端的顺序，就能确定代码；最后代回整条管道检查。</p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-indigo-700">
          <Link className="underline underline-offset-4" href={href('/guides/pipeline')}>阅读管道题正推与逆推完整攻略</Link>
          <Link className="underline underline-offset-4" href={href('/pipeline')}>用管道题求解器逐步验算</Link>
        </div>
        <p className="mt-4 text-xs leading-6 text-slate-500">这是本站原创教学例题，无需登录即可阅读。使用解题器和题库需登录；每种解题器各有 10 次免费机会，管道题库提供固定免费样题。</p>
      </section>}

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">{copy.typesHeading}</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.typesIntro}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {copy.types.map((type) => (
            <article key={type.slug} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-semibold text-slate-900">{type.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{type.blurb}</p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <Link href={href(`/guides/${type.slug}`)} className="font-medium text-indigo-600 hover:underline">
                  {ui.readGuide}
                </Link>
                <Link href={href(type.toolHref)} className="text-slate-600 hover:text-indigo-600 hover:underline">
                  {type.toolLabel}
                </Link>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">{copy.howHeading}</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {copy.how.map((step, i) => (
            <li key={step.title} className="rounded-2xl bg-slate-50 p-6">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">{copy.whyHeading}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {copy.why.map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 p-7">
        <h2 className="text-xl font-bold text-slate-900">{copy.accessHeading}</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.accessText}</p>
        <p className="mt-4 text-xl font-semibold">{PRICE_LABEL} / {lang === 'zh' ? '30 天 · 不自动续费' : '30 days · No automatic renewal'}</p>
        <Link href={href('/pricing')} className="mt-5 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {copy.accessCta}
        </Link>
      </section>

      <section className="mt-12 rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold">{lang === 'zh' ? '也在准备其他公司的笔试？' : 'Preparing for another company’s assessment?'}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{lang === 'zh' ? '比较宝洁、普华永道、德勤与联合利华的测评范围，按邀请中的题型选择练习。公司间可能考查相近能力，但题目格式不一定相同。' : 'Compare P&G, PwC, Deloitte and Unilever assessment guidance, then choose practice that matches your invitation. Shared reasoning skills do not mean identical tests.'}</p>
        <Link href={href('/guides/company-assessments')} className="mt-3 inline-block text-sm text-indigo-600 underline">{lang === 'zh' ? '查看公司测评对比与官方来源' : 'Compare company assessments and official sources'}</Link>
      </section>

      <FaqSection heading={copy.faqHeading} items={copy.faq} />

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
