import type { Language } from '@/lib/language';

export const EDITORIAL_UPDATED = '2026-09-28';
export const PUBLISHER_NAME = 'CKAutoFlow';
export const OFFICIAL_HIRING_URL = 'https://www.pgcareers.com/us/en/hiring-process';

export const PRODUCT_INFO: Record<Language, {
 pricingTitle: string; pricingDescription: string; aboutTitle: string; aboutDescription: string;
 trial: string; access: string; included: string[]; limits: string; action: string;
 about: string[]; methodTitle: string; method: string[]; sourcesTitle: string; sourceNote: string;
}> = {
 zh: {
  pricingTitle: '会员价格与免费体验 | 宝洁笔试题库',
  pricingDescription: '查看宝洁笔试练习工具的会员价格、每种解题器 10 次免费机会、固定样题和 30 天使用权。一次性购买，不自动续费；包含管道、图形、数字推理及资料分析练习。',
  aboutTitle: '关于本站与题目编写方法 | 宝洁笔试题库',
  aboutDescription: '了解 CKAutoFlow 独立练习工具的题目生成方法、求解器范围和资料来源。本站提供原创练习，不提供宝洁真实试题或通过考试保证。',
  trial: '每个账号每种解题器各有 10 次免费机会，不每日重置；每种练习题型开放 5 道固定样题与完整解析。已有试用保留至原到期日，无需绑卡。解题攻略和本页信息无需登录即可阅读。',
  access: '一次性购买 30 天使用权。付款确认后立即开始计时，不叠加剩余试用天数，不自动续费。',
  included: ['顺序记忆：蓝色板上的圆点回忆，支持 3、5、7 个位置；不是完整 Grid 双任务模拟。','管道推理：位置重排、逐级推导与未知方框求解。','图形推理：3×3 方格中的六类变换与候选规律验证。','数字推理：算式填空、数字不重复约束及可行解检查。','图表数据分析练习：增长率、占比、比值与单位换算。','分难度练习、答题记录和错题复练；界面支持中英文。'],
  limits: '需要登录才能使用求解和保存练习记录。已有有效付费使用权时不能重复购买。实际可用支付方式以 Stripe 结账页显示为准。',
  action: '登录并购买 30 天使用权',
  about: ['本站由 CKAutoFlow 维护，面向准备笔试和在线测评的学习者，提供中英文推理练习与解题工具。','本站与 Procter & Gamble（宝洁）无隶属、合作或授权关系。P&G 和宝洁名称用于说明学习场景；本站题目不是官方真题，也不代表某一岗位或年份的考试内容。'],
  methodTitle: '题目与攻略如何编写',
  method: ['练习题由程序按明确规则生成：管道题使用位置排列，图形题使用支持的网格变换，数字题检查算式和数字约束，资料分析题从题目给出的数据计算答案。','攻略展示解题步骤与可复算示例。求解结果只适用于输入条件及工具支持的规则，不能代表所有可能的题目或图形规律。','我们不声称拥有官方题库、招聘方背书或经验证的通过率。练习建议用于安排学习，不是对成绩或录用结果的承诺。'],
  sourcesTitle: '资料来源与更新方式',
  sourceNote: '招聘流程信息参考 P&G Careers 官方说明；本网站的数学示例与解题方法由本站编写。具体测评类型和要求以岗位通知及官方信息为准。内容有实质修改时更新文章日期。',
 },
 en: {
  pricingTitle: 'Pricing and Free Access | P&G Test Prep',
  pricingDescription: 'See pricing, 10 free uses per solver, fixed practice samples and 30-day access for this independent reasoning practice tool. One-time payment, no automatic renewal.',
  aboutTitle: 'About and Question Methodology | P&G Test Prep',
  aboutDescription: 'How CKAutoFlow creates independent reasoning practice, what the solvers support and where assessment information comes from. No official test questions or pass guarantees.',
  trial: 'Each account gets 10 lifetime free uses per solver and 5 fixed samples per practice type, with full explanations. No daily reset or card required. Existing trials are honoured. Guides are free to read without signing in.',
  access: 'A one-time purchase provides 30 days of access from payment confirmation. Unused trial days are not added. There is no automatic renewal.',
  included: ['Sequence memory: dot recall with 3, 5 or 7 positions; not a complete dual-task Grid simulation.','Pipeline logic: position permutations, intermediate steps and unknown-box solving.','Figure reasoning: six transformation families on a 3×3 grid and candidate-rule checks.','Numerical reasoning: equation blanks, distinct-digit constraints and valid-solution checks.','Data interpretation practice: growth, shares, ratios and unit conversion.','Difficulty-based practice, answer history and wrong-answer retries, in Chinese and English.'],
  limits: 'Sign-in is required to solve questions and save practice history. Accounts with active paid access cannot buy again. Available payment methods are shown at Stripe checkout.',
  action: 'Sign in and buy 30-day access',
  about: ['CKAutoFlow maintains this independent Chinese and English reasoning practice tool for people preparing for aptitude tests and online assessments.','This site is not affiliated with, endorsed by or partnered with Procter & Gamble. P&G is used to describe the preparation context. Our questions are not official test content or a representation of any role’s current assessment.'],
  methodTitle: 'How questions and guides are produced',
  method: ['Practice questions are generated from explicit rules: position permutations for pipelines, supported grid transformations for figures, equation and digit constraints for numerical questions, and calculations from the supplied data for interpretation questions.','Guides explain the procedure with worked examples that readers can recompute. A solver result applies to its inputs and supported rules, not every possible question or visual pattern.','We do not claim an official question bank, employer endorsement or a measured pass rate. Practice suggestions help organise study; they do not guarantee a score or hiring outcome.'],
  sourcesTitle: 'Sources and updates',
  sourceNote: 'Hiring-process information refers to P&G Careers. Mathematical examples and solving explanations are written for this site. The employer’s invitation and official information determine the actual assessment requirements. Article dates change when the content is substantively revised.',
 },
};
