import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage, type Language } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
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
              '@id': `${SITE_URL}/#website`,
              url: absolute(href('')),
              name: SITE_NAME[lang],
              inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
              publisher: { '@id': `${SITE_URL}/#org` },
            },
            {
              '@type': 'Organization',
              '@id': `${SITE_URL}/#org`,
              name: SITE_NAME[lang],
              url: SITE_URL,
              description: copy.description,
            },
            {
              '@type': 'WebPage',
              '@id': `${absolute(href(''))}#page`,
              url: absolute(href('')),
              name: copy.title,
              description: copy.description,
              isPartOf: { '@id': `${SITE_URL}/#website` },
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
      </header>

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
        <Link href="/billing" className="mt-5 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          {copy.accessCta}
        </Link>
      </section>

      <FaqSection heading={copy.faqHeading} items={copy.faq} />

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
