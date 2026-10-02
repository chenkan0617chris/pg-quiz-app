import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_URL } from '@/lib/seo';
import { GUIDE_LABELS, GUIDE_SLUGS, GUIDE_PRACTICE, getGuide, isGuideSlug } from '@/content/guides';
import { PRICE_LABEL } from '@/lib/payment-product';
import { GUIDE_SUMMARIES } from '@/content/guide-summaries';
import { PUBLISHER_NAME, PRODUCT_INFO, OFFICIAL_HIRING_URL } from '@/content/product-info';
import { UI } from '@/content/site';
import { LOCALES } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import Prose, { headingId } from '@/components/seo/Prose';
import FaqSection from '@/components/seo/FaqSection';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import GuideIllustration from '@/components/seo/GuideIllustration';

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => GUIDE_SLUGS.map((slug) => ({ lang, slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLanguage(lang) || !isGuideSlug(slug)) notFound();
  const guide = getGuide(lang, slug);
  return pageMetadata({
    lang,
    path: `/guides/${slug}`,
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    type: 'article',
    publishedTime: guide.published,
    modifiedTime: guide.updated,
  });
}

export default async function GuidePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLanguage(lang) || !isGuideSlug(slug)) notFound();

  const guide = getGuide(lang, slug);
  const ui = UI[lang];
  const url = absolute(localePath(lang, `/guides/${slug}`));
  const sections = guide.body
    .map((block, i) => (block.type === 'h2' ? { text: block.text, id: headingId(block.text, i) } : null))
    .filter((v): v is { text: string; id: string } => v !== null);
  const related = GUIDE_SLUGS.filter((other) => other !== slug);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.h1,
          description: guide.description,
          inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
          dateModified: guide.updated,
          datePublished: guide.published,
          image: absolute('/opengraph-image'),
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          author: { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: PUBLISHER_NAME, url: absolute(localePath(lang, '/about')) },
          publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: PUBLISHER_NAME },
        }}
      />

      <Breadcrumbs
        items={[
          { name: ui.home, href: localePath(lang) },
          { name: ui.guides, href: localePath(lang, '/guides') },
          { name: GUIDE_LABELS[lang][slug], href: localePath(lang, `/guides/${slug}`) },
        ]}
      />

      <article>
        <header className="border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{guide.h1}</h1>
          <p className="mt-3 text-sm text-slate-500">{lang === 'zh' ? '编写与维护：' : 'Written and maintained by '}<Link href={localePath(lang, '/about')} className="underline">{PUBLISHER_NAME}</Link></p>
          <p className="mt-4 text-[15px] leading-7 text-slate-600">{guide.lede}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href={localePath(lang, guide.toolHref)} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
              {guide.toolLabel}
            </Link>
            <Link href={localePath(lang, GUIDE_PRACTICE[slug])} className="text-indigo-600 hover:underline">{ui.practice}</Link>
            <time dateTime={guide.updated} className="text-slate-400">{ui.updated} {guide.updated}</time>
          </p>
        </header>

        <nav aria-label={ui.onThisPage} className="my-8 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">{ui.onThisPage}</p>
          <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-slate-600 hover:text-indigo-600 hover:underline">{section.text}</a>
              </li>
            ))}
          </ol>
        </nav>

        <section className="mb-8 rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">{guide.sources ? (lang === 'zh' ? '先了解适用范围' : 'Scope at a glance') : (lang === 'zh' ? '先记住这个解题方法' : 'The method at a glance')}</h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-700">{guide.summary ?? GUIDE_SUMMARIES[lang][slug]}</p>
        </section>
        <GuideIllustration slug={slug} lang={lang}/>
        <Prose blocks={guide.body} />
        <section className="mt-10 rounded-xl border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="text-xl font-bold">{lang==='zh'?'用练习检验刚学到的方法':'Put the method into practice'}</h2>
          <p className="mt-3 text-sm leading-7">{lang==='zh'?'登录后，每种题型有 5 道固定样题（记忆训练累计免费 10 轮），每种解题器各有 10 次免费机会，不每日重置。需要更多新题和持续求解时，可购买 30 天会员。':'After signing in, repeat 5 fixed samples per practice type (10 lifetime memory rounds) and use each solver 10 times for free, with no daily reset. Paid access unlocks new generated questions and continued solving for 30 days.'}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link className="rounded-lg bg-indigo-600 px-4 py-2 text-white" href={localePath(lang,GUIDE_PRACTICE[slug])}>{lang==='zh'?'练习这一题型':'Practise this topic'}</Link>
            <Link className="py-2 text-indigo-700 underline" href={localePath(lang,'/pricing')}>{PRICE_LABEL} / {lang==='zh'?'30 天 · 查看包含内容':'30 days · See what is included'}</Link>
          </div>
        </section>
        <section className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-bold">{PRODUCT_INFO[lang].sourcesTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{guide.sources
            ? (lang === 'zh' ? '以下官方资料于 2026-09-29 核查；公司、地区和年份范围见正文。例题与学习建议由本站编写，并非招聘方真题或背书。' : 'Official sources checked on 2026-09-29. Company, region and year limits are explained above. Examples and study suggestions are our own, not employer questions or endorsements.')
            : PRODUCT_INFO[lang].sourceNote}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(guide.sources ?? [{ label: 'P&G Careers — Hiring process', url: OFFICIAL_HIRING_URL }]).map((source) => (
              <li key={source.url}><a className="text-indigo-600 underline" href={source.url}>{source.label}</a></li>
            ))}
          </ul>
          <p className="mt-3 text-sm"><Link className="text-indigo-600 underline" href={localePath(lang, '/about')}>{lang === 'zh' ? '本站题目编写方法' : 'Our question methodology'}</Link></p>
        </section>
      </article>

      <FaqSection heading={ui.faqHeading} items={guide.faq} />

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">{ui.relatedHeading}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {related.map((other) => (
            <li key={other}>
              <Link href={localePath(lang, `/guides/${other}`)} className="block rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                {GUIDE_LABELS[lang][other]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
