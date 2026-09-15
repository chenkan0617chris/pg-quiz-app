import type { Faq } from '@/content/blocks';
import JsonLd from '@/components/JsonLd';

/**
 * Renders the questions as real text and emits matching FAQPage markup, so the
 * structured data always describes content a visitor can actually see.
 */
export default function FaqSection({ heading, items }: { heading: string; items: Faq[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-slate-900">{heading}</h2>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item) => (
          <div key={item.q} className="py-5">
            <h3 className="font-semibold text-slate-900">{item.q}</h3>
            <p className="mt-2 text-[15px] leading-7 text-slate-700">{item.a}</p>
          </div>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />
    </section>
  );
}
