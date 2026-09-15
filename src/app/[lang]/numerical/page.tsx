import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { pageMetadata } from '@/lib/seo';
import { TOOLS } from '@/content/tools';
import ToolShell from '@/components/seo/ToolShell';
import Solver from './solver';

const PATH = '/numerical';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = TOOLS.numerical[lang];
  return pageMetadata({ lang, path: PATH, title: copy.title, description: copy.description, keywords: copy.keywords });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return (
    <ToolShell lang={lang} path={PATH} copy={TOOLS.numerical[lang]}>
      <Solver />
    </ToolShell>
  );
}
