import Link from 'next/link';
import { localePath } from '@/lib/seo';
import type { Language } from '@/lib/language';

type Kind = 'pipeline' | 'numerical' | 'figure';

const COPY: Record<Kind, Record<Language, { title: string; text: string; cta: string }>> = {
  pipeline: {
    zh: { title: '下次考试前，自己也能做出来', text: '求解器只能在考后对答案。用同类管道题限时练几道，正式考试时就不用依赖工具。', cta: '练 5 道同类管道题' },
    en: { title: 'Get fast enough to solve it yourself', text: 'A solver can only check answers afterwards. Practise a few timed Switch Challenge questions so you can crack them on test day.', cta: 'Practise 5 Switch questions' },
  },
  numerical: {
    zh: { title: '下次考试前，自己也能做出来', text: '求解器只能在考后对答案。用同类数字题练几道，正式考试时更快找到组合。', cta: '练 5 道同类数字题' },
    en: { title: 'Get fast enough to solve it yourself', text: 'A solver can only check answers afterwards. Practise a few Digit Challenge questions so you spot the combinations faster on test day.', cta: 'Practise 5 Digit questions' },
  },
  figure: {
    zh: { title: '下次考试前，自己也能做出来', text: '用同类图形推理题练几道，熟悉旋转、镜像和移动规律。', cta: '练 5 道同类图形题' },
    en: { title: 'Get fast enough to solve it yourself', text: 'Practise a few figure-series questions to get quick at spotting rotation, reflection and movement rules.', cta: 'Practise 5 figure questions' },
  },
};

/**
 * Shown under a solver result. Most new sign-ups use a solver once and leave, so
 * this hands them straight to the matching practice type.
 */
export default function PracticeNext({ kind, lang }: { kind: Kind; lang: Language }) {
  const copy = COPY[kind][lang];
  return (
    <div className="mt-5 rounded-lg border border-indigo-200 bg-indigo-50 p-4" data-testid="practice-next">
      <p className="text-sm font-semibold text-slate-900">{copy.title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{copy.text}</p>
      <Link
        href={`${localePath(lang, '/practice')}?kind=${kind}`}
        className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {copy.cta} →
      </Link>
    </div>
  );
}
