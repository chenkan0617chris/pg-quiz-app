import Link from 'next/link';
import { localePath } from '@/lib/seo';
import { TEST_PAGES_EN, TEST_PAGE_PATHS, type TestPageKey } from '@/content/test-pages.en';
import FaqSection from '@/components/seo/FaqSection';

/**
 * Server-rendered explanation of one P&G assessment section, in English only.
 * The interactive tools are client components, so this is the crawlable text
 * that lets the page rank for the section's English name. It also links every
 * section page to its siblings so crawlers find all of them from any one.
 */
export default function EnglishTestContent({ page }: { page: TestPageKey }) {
  const copy = TEST_PAGES_EN[page];
  const others = (Object.keys(TEST_PAGES_EN) as TestPageKey[]).filter((key) => key !== page);

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      {copy.sections.map((section) => (
        <section key={section.heading} className="mt-8 first:mt-0 max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="mt-3 text-[15px] leading-7 text-slate-700">{text}</p>
          ))}
          {section.list && (
            <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-700 marker:text-slate-400">
              {section.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}

      <FaqSection heading={copy.faqHeading} items={copy.faq} />

      <nav aria-label="Other assessment games" className="mt-10 rounded-xl bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-900">Practise the other Aon and P&amp;G assessment games</h2>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {others.map((key) => (
            <li key={key}>
              <Link href={localePath('en', TEST_PAGE_PATHS[key])} className="text-indigo-600 hover:underline">
                {TEST_PAGES_EN[key].name} practice
              </Link>
            </li>
          ))}
          <li>
            <Link href={localePath('en', '/guides/assessment')} className="text-indigo-600 hover:underline">
              P&amp;G assessment preparation guide
            </Link>
          </li>
          <li>
            <Link href={localePath('en', '/guides/company-assessments')} className="text-indigo-600 hover:underline">
              Which companies use these tests
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
