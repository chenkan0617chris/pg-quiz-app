import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { absolute } from '@/lib/seo';

export type Crumb = { name: string; href: string };

/** Visible trail plus BreadcrumbList markup; the last crumb is the current page. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-slate-700">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-indigo-600 hover:underline">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: absolute(item.href),
          })),
        }}
      />
    </>
  );
}
