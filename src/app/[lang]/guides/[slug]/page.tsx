import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { absolute, localePath, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { GUIDE_LABELS, GUIDE_SLUGS, getGuide, isGuideSlug } from '@/content/guides';
import { UI } from '@/content/site';
import { LOCALES } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import Prose, { headingId } from '@/components/seo/Prose';
import FaqSection from '@/components/seo/FaqSection';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

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
    publishedTime: guide.updated,
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
          datePublished: guide.updated,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          author: { '@type': 'Organization', name: SITE_NAME[lang], url: SITE_URL },
          publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME[lang] },
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
          <p className="mt-4 text-[15px] leading-7 text-slate-600">{guide.lede}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href={localePath(lang, guide.toolHref)} className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
              {guide.toolLabel}
            </Link>
            <Link href={localePath(lang, '/practice')} className="text-indigo-600 hover:underline">{ui.practice}</Link>
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

        <Prose blocks={guide.body} />
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
