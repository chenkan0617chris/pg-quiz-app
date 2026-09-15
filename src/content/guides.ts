import type { Language } from '@/lib/language';
import { GUIDES_ZH, type GuideCopy } from './guides.zh';
import { GUIDES_EN } from './guides.en';

export type { GuideCopy };

export const GUIDE_SLUGS = ['pipeline', 'figure', 'numerical', 'data'] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

const BY_LANG: Record<Language, Record<string, GuideCopy>> = { zh: GUIDES_ZH, en: GUIDES_EN };

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export function getGuide(lang: Language, slug: GuideSlug): GuideCopy {
  return BY_LANG[lang][slug];
}

/** Short labels for navigation and cross-links, kept separate from the long page titles. */
export const GUIDE_LABELS: Record<Language, Record<GuideSlug, string>> = {
  zh: {
    pipeline: '管道推理',
    figure: '图形推理',
    numerical: '数字推理',
    data: '图表数据分析',
  },
  en: {
    pipeline: 'Pipeline logic',
    figure: 'Figure series',
    numerical: 'Numerical reasoning',
    data: 'Data interpretation',
  },
};
