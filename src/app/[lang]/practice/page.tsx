import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isLanguage } from '@/lib/language';
import { pageMetadata } from '@/lib/seo';
import { TOOLS } from '@/content/tools';
import ToolShell from '@/components/seo/ToolShell';
import Solver from '@/components/practice/PracticePage';

const PATH = '/practice';

type Props = { params: Promise<{ lang: string }>; searchParams:Promise<{kind?:string|string[]}> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = TOOLS.practice[lang];
  return pageMetadata({ lang, path: PATH, title: copy.title, description: copy.description, keywords: copy.keywords });
}

export default async function Page({ params,searchParams }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const {kind}=await searchParams;
  if(kind==='memory')redirect(`/${lang}/memory`);
  const initialKind=kind==='numerical'||kind==='figure'||kind==='data'?kind:'pipeline';
  return (
    <ToolShell lang={lang} path={PATH} copy={TOOLS.practice[lang]}>
      <Solver initialKind={initialKind} />
    </ToolShell>
  );
}
