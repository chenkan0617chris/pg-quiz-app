import Link from 'next/link';
import type { Language } from '@/lib/language';
import { localePath } from '@/lib/seo';
import { GUIDE_LABELS, GUIDE_PRACTICE, getGuide } from '@/content/guides';
import type { ToolCopy } from '@/content/tools';
import { UI } from '@/content/site';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

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

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">{copy.h1}</h1>
      <p className="mt-4 mb-8 max-w-3xl text-[15px] leading-7 text-slate-600">{copy.intro}</p>

      {children}

      {path === '/pipeline' && lang === 'zh' && <section className="mt-10 rounded-xl border border-slate-200 p-5 sm:p-7" aria-labelledby="pipeline-example">
        <h2 id="pipeline-example" className="text-lg font-semibold">两级管道题例题：已知一个方框，怎样求另一个？</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">用 A、B、C、D 代表四个不同图形。输入 A B C D，先经过 2314，再经过一个未知方框，最后输出 D A C B。方框代码表示依次取上一行的第几位。</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-700">
          <li>先算已知方框：从 A B C D 取第 2、3、1、4 位，得到 B C A D。</li>
          <li>把目标 D A C B 与当前 B C A D 对照：D 在第 4 位，A 在第 3 位，C 在第 2 位，B 在第 1 位。</li>
          <li>因此未知方框是 4321。代回检查：B C A D 经过 4321，确实得到 D A C B。</li>
        </ol>
        <p className="mt-4 rounded-lg bg-slate-50 p-4 font-mono text-sm leading-7">A B C D → [2314] → B C A D → [4321] → D A C B</p>
        <p className="mt-4 text-sm leading-7 text-slate-600">常见错误是把最终输出直接当成答案代码，忽略前一个方框已经改变了顺序。若未知方框后面还有已知规则，要先从最终输出撤销这些规则，再做位置对照。</p>
        <p className="mt-3 text-xs leading-6 text-slate-500">这是原创教学例题，解析无需登录。可在上方录入同样的图形顺序进行验算；单个未知方框无需填写候选项。</p>
      </section>}

      {path === '/pipeline' && <section className="mt-8 rounded-xl border border-slate-200 p-5">
        <h2 className="text-lg font-semibold">{lang === 'zh' ? '宝洁管道题工具与模拟练习有什么区别？' : 'Solver, practice or timed mock exam?'}</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{lang === 'zh' ? '工具用于录入练习题并核对每一步排列；题库用于独立答题后查看解析；模拟考用于连续限时作答并复盘得分与耗时。三者均为独立备考训练，不是官方真题或通过保证。' : 'Use the solver to check each permutation, the practice bank to answer original questions with feedback, and the mock exam to rehearse under timed conditions. These are independent preparation resources, not official questions or a pass guarantee.'}</p>
        <p className="mt-4 flex flex-wrap gap-5 text-sm text-indigo-600">
          <Link className="underline" href={localePath(lang, '/practice?kind=pipeline')}>{lang === 'zh' ? '开始管道题模拟练习' : 'Practise pipeline questions'}</Link>
          <Link className="underline" href={localePath(lang, '/exams')}>{lang === 'zh' ? '进入宝洁管道题模拟考试' : 'Explore timed mock exams'}</Link>
        </p>
      </section>}

      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900">{lang === 'zh' ? '使用说明与限制' : 'How to use it, and what it does not do'}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-600 marker:text-slate-400">
          {copy.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href={localePath(lang, `/guides/${copy.guide}`)} className="font-medium text-indigo-600 hover:underline">
            {lang === 'zh' ? `${GUIDE_LABELS.zh[copy.guide]}解题攻略` : `${GUIDE_LABELS.en[copy.guide]} guide`}
          </Link>
          <Link href={localePath(lang, guide.toolHref === path ? GUIDE_PRACTICE[copy.guide] : guide.toolHref)} className="text-slate-600 hover:text-indigo-600 hover:underline">
            {path === '/pipeline' ? (lang === 'zh' ? '宝洁管道题模拟练习' : 'Switch-style practice') : ui.practice}
          </Link>
        </p>
      </section>

      <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">{ui.disclaimer}</p>
    </>
  );
}
