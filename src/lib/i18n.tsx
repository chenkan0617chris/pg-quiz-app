'use client';

/* =====================================================================
   I18N — bilingual (中文 default / English), React context + localStorage.
   Usage:
     const { lang, setLang, toggle, t } = useI18n();
     t('solve')                      -> string
     t('errBoxPerm', 2, '1325')      -> interpolated string
   ===================================================================== */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'zh' | 'en';

type Entry = { zh: string; en: string } | { zh: (...a: never[]) => string; en: (...a: never[]) => string };

export const DICT = {
  // ---- app / nav ----
  appName: { zh: '宝洁笔试题库', en: 'P&G Test Prep' },
  navPipeline: { zh: '管道推理', en: 'Pipeline Logic' },
  navSeries: { zh: '图形推理', en: 'Figure Series' },
  navNumerical: { zh: '数字推理', en: 'Numerical' },
  comingSoon: { zh: '敬请期待', en: 'Coming soon' },
  comingSoonBody: {
    zh: '该题型正在开发中，敬请期待。',
    en: 'This question type is under construction. Stay tuned.',
  },
  language: { zh: '中文', en: 'English' },

  // ---- pipeline page ----
  title: { zh: '管道题', en: 'Pipeline' },
  subtitle: {
    zh: '输入管道方框、输入/输出图形顺序以及候选项，系统将算出缺失的方框。',
    en: 'Enter the boxes, the input/output shape order, and the candidate options. The solver computes the missing box.',
  },
  shapes: { zh: '图形', en: 'Shapes' },
  inputOrder: { zh: '输入顺序（顶部）', en: 'Input order (top)' },
  outputOrder: { zh: '输出顺序（底部）', en: 'Output order (bottom)' },
  unknown: { zh: '未知 ?', en: 'unknown ?' },
  orderHint: { zh: '拖动图形调整顺序。', en: 'Drag shapes to reorder.' },
  pipelineBoxes: { zh: '管道方框', en: 'Pipeline boxes' },
  addBox: { zh: '＋ 添加方框', en: '+ Add box' },
  boxUnknownHint: {
    zh: '在需要求解的方框上勾选“未知”。',
    en: 'Tick “unknown” on the boxes you want to solve.',
  },
  candidates: { zh: '候选项', en: 'Candidate options' },
  candHint: {
    zh: '用逗号分隔。单个未知方框时可选（用于高亮匹配项）；有两个或以上未知方框时必填。',
    en: 'Comma-separated. Optional for a single unknown box (highlights the match); required with two or more unknown boxes.',
  },
  solve: { zh: '求解', en: 'Solve' },
  result: { zh: '结果', en: 'Result' },
  resultPlaceholder: {
    zh: '点击“求解”查看答案以及图形在管道中的流动。',
    en: 'Press “Solve” to see the answer and the shape flow through the pipes.',
  },
  remove: { zh: '删除方框', en: 'Remove box' },
  selftestPass: { zh: (ok: number, n: number) => `自检 ✓ ${ok}/${n}`, en: (ok: number, n: number) => `self-tests ✓ ${ok}/${n}` },
  selftestFail: { zh: (ok: number, n: number) => `自检失败 ${ok}/${n}`, en: (ok: number, n: number) => `self-tests FAILED ${ok}/${n}` },

  // ---- result / flow ----
  stageInput: { zh: '输入', en: 'Input' },
  flowTitle: { zh: '图形流动', en: 'Shape flow' },

  // ---- errors (keys returned by engine) ----
  errBothUnknown: { zh: '输入和输出不能同时为未知。', en: 'Input and output cannot both be unknown.' },
  errInputPerm: { zh: '输入行必须使用 4 种图形各一次。', en: 'Input row must use each of the 4 shapes exactly once.' },
  errOutputPerm: { zh: '输出行必须使用 4 种图形各一次。', en: 'Output row must use each of the 4 shapes exactly once.' },
  errBoxPerm: {
    zh: (i: number, v: string) => `方框 ${i}（“${v}”）不是 1-4 的排列。`,
    en: (i: number, v: string) => `Box ${i} ("${v}") is not a permutation of 1-4.`,
  },
  errOrderBoxes: {
    zh: '当输入或输出顺序未知时，所有管道方框都必须已知。',
    en: 'When the input or output order is unknown, every pipeline box must be known.',
  },
  errNothing: {
    zh: '请标记未知项：一个或多个方框，或输入/输出顺序。',
    en: 'Mark something as unknown: one or more boxes, or the input/output order.',
  },
  ansBox: { zh: (i: number) => `方框 ${i} = `, en: (i: number) => `Box ${i} = ` },
  noCandMatch: { zh: '没有候选项匹配——请检查方框或顺序。', en: 'None of the candidates match — re-check the boxes or orders.' },
  inconsistent: {
    zh: '求得的管道无法复现输出——输入可能不一致。',
    en: 'Solved pipeline does not reproduce the output — inputs may be inconsistent.',
  },
  needCands: {
    zh: (n: number) => `有 ${n} 个未知方框——请提供候选项以供选择。`,
    en: (n: number) => `You have ${n} unknown boxes — provide candidate options to choose from.`,
  },
  noCombo: {
    zh: '没有任何候选项组合能复现输出。请检查候选项、方框和顺序。',
    en: 'No combination of the candidate options reproduces the output. Check the candidates, boxes, and orders.',
  },
  multiCombos: {
    zh: (n: number) => `找到 ${n} 个有效组合（流程图显示第一个）。`,
    en: (n: number) => `${n} valid combinations found (flow shows the first).`,
  },

  // ---- numerical page ----
  numTitle: { zh: '数字推理', en: 'Numerical' },
  numSubtitle: {
    zh: '搭出算式并填入目标结果，系统会算出每个空格应填的个位数字（默认不重复）。',
    en: 'Build the equation and enter the target. The solver finds the single digit for every blank (no repeats by default).',
  },
  numEquation: { zh: '算式', en: 'Equation' },
  numTarget: { zh: '目标结果', en: 'Target' },
  numAddSlot: { zh: '添加数字', en: 'Add number' },
  numAddOp: { zh: '添加运算符', en: 'Add operator' },
  numAddParens: { zh: '＋ ( )', en: '+ ( )' },
  numClear: { zh: '清空', en: 'Clear' },
  numReset: { zh: '示例', en: 'Sample' },
  numTemplates: { zh: '常用算式', en: 'Templates' },
  numTemplatesHint: { zh: '点击任意算式即可套用。', en: 'Click any equation to apply it.' },
  numOptions: { zh: '选项', en: 'Options' },
  numDigitRange: { zh: '数字范围', en: 'Digit range' },
  numDistinct: { zh: '不能重复', en: 'No repeats' },
  numBuilderHint: {
    zh: '用下方按钮添加空格、运算符或括号；运算符可下拉切换 + − × ÷；悬停元素点右上角 × 删除。',
    en: 'Use the buttons to add blanks, operators or parentheses; switch an operator with its dropdown; hover an element and click × to remove it.',
  },
  numResultPlaceholder: {
    zh: '点击“求解”查看所有可能的数字组合。',
    en: 'Press “Solve” to see every digit combination that works.',
  },
  numSolutionsFound: {
    zh: (n: number) => `找到 ${n} 个解`,
    en: (n: number) => `${n} solution${n === 1 ? '' : 's'} found`,
  },
  numNoSolution: { zh: '没有符合条件的数字组合。', en: 'No digit combination satisfies the equation.' },
  numTruncated: { zh: (n: number) => `仅显示前 ${n} 个`, en: (n: number) => `showing first ${n}` },
  numErrNoBlank: { zh: '请至少添加一个空格（?）。', en: 'Add at least one blank (?).' },
  numErrInvalid: { zh: '算式无效，请检查运算符和括号。', en: 'Invalid equation — check the operators and parentheses.' },
  numErrTooBig: { zh: '组合太多，请缩小数字范围或减少空格。', en: 'Too many combinations — narrow the digit range or use fewer blanks.' },
  numErrTarget: { zh: '请输入有效的目标结果。', en: 'Enter a valid target number.' },

  // ---- shape names ----
  shape1: { zh: '绿色圆形', en: 'Green circle' },
  shape2: { zh: '黄色三角', en: 'Yellow triangle' },
  shape3: { zh: '红色方块', en: 'Red square' },
  shape4: { zh: '蓝色十字', en: 'Blue plus' },
} satisfies Record<string, Entry>;

export type DictKey = keyof typeof DICT;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: DictKey, ...args: (string | number)[]) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh');

  // hydrate from localStorage after mount (default stays 'zh' for SSR)
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('lang') as Lang | null) : null;
    if (saved === 'zh' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  }, []);

  const toggle = useCallback(() => setLang(lang === 'zh' ? 'en' : 'zh'), [lang, setLang]);

  const t = useCallback(
    (key: DictKey, ...args: (string | number)[]) => {
      const entry = DICT[key][lang] as string | ((...a: (string | number)[]) => string);
      return typeof entry === 'function' ? entry(...args) : entry;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

/** Localised shape name by id (1..4). */
export function shapeNameKey(id: number): DictKey {
  return `shape${id}` as DictKey;
}
