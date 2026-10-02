import type { Language } from '@/lib/language';
import { GUIDES_ZH, type GuideCopy } from './guides.zh';
import { GUIDES_EN } from './guides.en';
import { PREPARATION_GUIDES } from './preparation-guides';
import { COMPANY_GUIDES } from './company-guides';

export type { GuideCopy };

export const GUIDE_SLUGS = ['assessment', 'pipeline', 'figure', 'numerical', 'data', 'memory', 'company-assessments', 'pwc-assessment', 'deloitte-assessment', 'unilever-assessment'] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export const GUIDE_PRACTICE: Record<GuideSlug,string> = {
  'company-assessments': '/practice?kind=data', 'pwc-assessment': '/practice?kind=data',
  'deloitte-assessment': '/practice?kind=data', 'unilever-assessment': '/practice?kind=data',
  assessment:'/practice', pipeline:'/practice?kind=pipeline', figure:'/practice?kind=figure',
  numerical:'/practice?kind=numerical', data:'/practice?kind=data', memory:'/memory',
};

const BY_LANG: Record<Language, Record<string, GuideCopy>> = { zh: {...GUIDES_ZH,...PREPARATION_GUIDES.zh,...COMPANY_GUIDES.zh}, en: {...GUIDES_EN,...PREPARATION_GUIDES.en,...COMPANY_GUIDES.en} };

export function isGuideSlug(value: string): value is GuideSlug {
  return (GUIDE_SLUGS as readonly string[]).includes(value);
}

export function getGuide(lang: Language, slug: GuideSlug): GuideCopy {
  return BY_LANG[lang][slug];
}

/** Short labels for navigation and cross-links, kept separate from the long page titles. */
export const GUIDE_LABELS: Record<Language, Record<GuideSlug, string>> = {
  zh: {
    'company-assessments': '公司测评题型对比',
    'pwc-assessment': '普华永道英国测评',
    'deloitte-assessment': '德勤英国测评',
    'unilever-assessment': '联合利华英国测评',
    assessment: '测评准备路线',
    memory: '圆点顺序记忆',
    pipeline: '管道推理',
    figure: '图形推理',
    numerical: '数字推理',
    data: '图表数据分析',
  },
  en: {
    'company-assessments': 'Compare company assessments',
    'pwc-assessment': 'PwC UK assessment',
    'deloitte-assessment': 'Deloitte UK assessment',
    'unilever-assessment': 'Unilever UK assessment',
    assessment: 'Assessment preparation',
    memory: 'Sequence memory',
    pipeline: 'Pipeline logic',
    figure: 'Figure series',
    numerical: 'Numerical reasoning',
    data: 'Data interpretation',
  },
};
