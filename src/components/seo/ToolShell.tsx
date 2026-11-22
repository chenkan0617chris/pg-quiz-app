import Link from 'next/link';
import type { Language } from '@/lib/language';
import { localePath } from '@/lib/seo';
import { GUIDE_LABELS, GUIDE_PRACTICE, getGuide } from '@/content/guides';
import type { ToolCopy } from '@/content/tools';
import { UI } from '@/content/site';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import EnglishTestContent from '@/components/seo/EnglishTestContent';
import FreeSwitchPractice from '@/components/pipeline/FreeSwitchPractice';
import InfoTip from '@/components/InfoTip';
import MoreInfo from '@/components/MoreInfo';

/**
 * Server-rendered frame around each interactive solver. The tools themselves
 * are client components with almost no crawlable text, so the surrounding copy,
 * breadcrumbs and guide links are what give these URLs something to rank on.
 */
export default function ToolShell({
  lang,
  path,
  copy,
  children,
}: {
  lang: Language;
  path: string;
  copy: ToolCopy;
  children: React.ReactNode;
}) {
  const ui = UI[lang];
  const guide = getGuide(lang, copy.guide);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: ui.home, href: localePath(lang) },
          { name: copy.label, href: localePath(lang, path) },
        ]}
      />

      <div className="flex items-center gap-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{copy.h1}</h1>
        <InfoTip label={lang === 'zh' ? '使用说明' : 'How to use'}>
          <ul className="list-disc space-y-1.5 pl-4 marker:text-slate-300">
            {copy.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </InfoTip>
      </div>
      <p className="mb-7 mt-2 text-[15px] text-slate-500">
        {copy.tagline}
      </p>

      {children}

      {path === '/pipeline' && lang === 'en' && <FreeSwitchPractice />}

      <MoreInfo summary={lang === 'zh' ? `关于${copy.label}` : `About the ${copy.label.toLowerCase()}`}>
        <div className="max-w-3xl space-y-6 text-sm leading-7 text-slate-600">
          <p>{copy.intro}</p>

          {path === '/pipeline' && lang === 'zh' && <section aria-labelledby="pipeline-example">
            <h2 id="pipeline-example" className="font-semibold text-slate-900">两级管道题例题：已知一个方框，怎样求另一个？</h2>
            <p className="mt-2">用 A、B、C、D 代表四个不同图形。输入 A B C D，先经过 2314，再经过一个未知方框，最后输出 D A C B。方框代码表示依次取上一行的第几位。</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>先算已知方框：从 A B C D 取第 2、3、1、4 位，得到 B C A D。</li>
              <li>把目标 D A C B 与当前 B C A D 对照：D 在第 4 位，A 在第 3 位，C 在第 2 位，B 在第 1 位。</li>
              <li>因此未知方框是 4321。代回检查：B C A D 经过 4321，确实得到 D A C B。</li>
            </ol>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 font-mono">A B C D → [2314] → B C A D → [4321] → D A C B</p>
            <p className="mt-3">常见错误是把最终输出直接当成答案代码，忽略前一个方框已经改变了顺序。若未知方框后面还有已知规则，要先从最终输出撤销这些规则，再做位置对照。</p>
          </section>}

          {path === '/pipeline' && <section>
            <h2 className="font-semibold text-slate-900">{lang === 'zh' ? '解题工具、练习和模拟考有什么区别？' : 'Solver, practice or timed mock exam?'}</h2>
            <p className="mt-2">{lang === 'zh' ? '工具用于录入题目并核对每一步排列；题库用于独立答题后查看解析；模拟考用于连续限时作答并复盘得分与耗时。' : 'Use the solver to check each permutation, the practice bank to answer original questions with feedback, and the mock exam to rehearse under timed conditions.'}</p>
          </section>}

          <p className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={localePath(lang, `/guides/${copy.guide}`)} className="font-medium text-indigo-600 hover:underline">
              {lang === 'zh' ? `${GUIDE_LABELS.zh[copy.guide]}解题攻略` : `${GUIDE_LABELS.en[copy.guide]} guide`} →
            </Link>
            <Link href={localePath(lang, guide.toolHref === path ? GUIDE_PRACTICE[copy.guide] : guide.toolHref)} className="text-indigo-600 hover:underline">
              {path === '/pipeline' ? (lang === 'zh' ? '管道题练习' : 'Switch-style practice') : ui.practice} →
            </Link>
            {path === '/pipeline' && <Link className="text-indigo-600 hover:underline" href={localePath(lang, '/exams')}>{lang === 'zh' ? '限时模拟考' : 'Timed mock exams'} →</Link>}
          </p>
        </div>
      </MoreInfo>

      {lang === 'en' && path === '/pipeline' && <EnglishTestContent page="pipeline" />}
      {lang === 'en' && path === '/numerical' && <EnglishTestContent page="numerical" />}
    </>
  );
}
