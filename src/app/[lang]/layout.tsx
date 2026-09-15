import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { LOCALES } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Only /zh and /en exist; anything else is a 404 rather than a soft duplicate. */
export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return children;
}
