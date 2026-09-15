import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { pageMetadata } from '@/lib/seo';
import { TOOLS } from '@/content/tools';
import ToolShell from '@/components/seo/ToolShell';
import Solver from '@/components/practice/PracticePage';

const PATH = '/practice';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = TOOLS.practice[lang];
  return pageMetadata({ lang, path: PATH, title: copy.title, description: copy.description, keywords: copy.keywords });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return (
    <ToolShell lang={lang} path={PATH} copy={TOOLS.practice[lang]}>
      <Solver />
    </ToolShell>
  );
}
