import type { Language } from '@/lib/language';
import { GUIDES_ZH, type GuideCopy } from './guides.zh';
import { GUIDES_EN } from './guides.en';
import { PREPARATION_GUIDES } from './preparation-guides';

export type { GuideCopy };

export const GUIDE_SLUGS = ['assessment', 'pipeline', 'figure', 'numerical', 'data', 'memory'] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export const GUIDE_PRACTICE: Record<GuideSlug,string> = {
  assessment:'/practice', pipeline:'/practice?kind=pipeline', figure:'/practice?kind=figure',
  numerical:'/practice?kind=numerical', data:'/practice?kind=data', memory:'/memory',
};

const BY_LANG: Record<Language, Record<string, GuideCopy>> = { zh: {...GUIDES_ZH,...PREPARATION_GUIDES.zh}, en: {...GUIDES_EN,...PREPARATION_GUIDES.en} };

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export function getGuide(lang: Language, slug: GuideSlug): GuideCopy {
  return BY_LANG[lang][slug];
}

/** Short labels for navigation and cross-links, kept separate from the long page titles. */
export const GUIDE_LABELS: Record<Language, Record<GuideSlug, string>> = {
  zh: {
    assessment: '测评准备路线',
    memory: '圆点顺序记忆',
    pipeline: '管道推理',
    figure: '图形推理',
    numerical: '数字推理',
    data: '图表数据分析',
  },
  en: {
    assessment: 'Assessment preparation',
    memory: 'Sequence memory',
    pipeline: 'Pipeline logic',
    figure: 'Figure series',
    numerical: 'Numerical reasoning',
    data: 'Data interpretation',
  },
};
