import type { Faq } from '@/content/blocks';
import JsonLd from '@/components/JsonLd';

/**
 * Renders the questions as real text and emits matching FAQPage markup, so the
 * structured data always describes content a visitor can actually see.
 */
export default function FaqSection({ heading, items }: { heading: string; items: Faq[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <h3 className="font-medium text-slate-900">{item.q}</h3>
              <span aria-hidden="true" className="mt-0.5 text-lg leading-none text-slate-400 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.a}</p>
          </details>
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
