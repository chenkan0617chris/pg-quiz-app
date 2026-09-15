import type { Language } from '@/lib/language';
import type { GuideSlug } from './guides';

/** Chrome strings shared by the editorial pages (not the interactive solvers). */
export const UI: Record<Language, {
  home: string;
  guides: string;
  updated: string;
  readGuide: string;
  openTool: string;
  practice: string;
  faqHeading: string;
  relatedHeading: string;
  onThisPage: string;
  disclaimer: string;
}> = {
  zh: {
    home: '首页',
    guides: '解题攻略',
    updated: '更新于',
    readGuide: '阅读攻略',
    openTool: '打开工具',
    practice: '开始练习',
    faqHeading: '常见问题',
    relatedHeading: '其他题型攻略',
    onThisPage: '本页目录',
    disclaimer:
      '本站为独立的笔试练习工具，与宝洁公司（Procter & Gamble）无任何隶属、合作或授权关系。站内题目均为依据公开题型格式自行生成的练习题，不是任何公司的真实考题。P&G 及宝洁为其各自权利人的商标。',
  },
  en: {
    home: 'Home',
    guides: 'Guides',
    updated: 'Updated',
    readGuide: 'Read the guide',
    openTool: 'Open the tool',
    practice: 'Start practising',
    faqHeading: 'Frequently asked questions',
    relatedHeading: 'Other question types',
    onThisPage: 'On this page',
    disclaimer:
      'This is an independent practice tool. It is not affiliated with, endorsed by, or connected to Procter & Gamble. Every question here is generated from publicly described question formats and is not real test content from any company. P&G and Procter & Gamble are trademarks of their respective owners.',
  },
};

/** The interactive tool that pairs with each guide, used for cross-linking. */
export const GUIDE_TOOL: Record<GuideSlug, string> = {
  pipeline: '/pipeline',
  figure: '/series',
  numerical: '/numerical',
  data: '/practice',
};
