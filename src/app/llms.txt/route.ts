import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * Plain-text site summary for AI search and answer engines (llmstxt.org).
 * Keep it factual and in step with the public pages it points to.
 */
const BODY = `# CK Quiz — Switch, Digit and Grid Challenge practice (Aon, P&G)

> Independent practice site for gamified online assessments, in English and Chinese: the Aon (cut-e) Switch, Digit and Grid challenges used by Procter & Gamble (P&G) and reported at other large employers, plus P&G PEAK, figure series and data interpretation. Original, generated questions with worked solutions. Not affiliated with or endorsed by Aon, P&G or any employer; no official test questions.

## What the P&G online assessment includes
- PEAK Performance Assessment: untimed questionnaire about background, experience and work attitudes; P&G says most applicants take about 20 minutes.
- Interactive Assessment (some roles): about 30 minutes of short cognitive games, commonly described as the Switch Challenge, Digit Challenge and Grid Challenge.

## Who uses these tests
- The Switch, Digit and Grid challenges are part of Aon's smartPredict assessment (Aon acquired cut-e in 2017). P&G uses them in its Interactive Assessment. Prep providers also list Deloitte, KPMG, EY, Morgan Stanley, UBS, Johnson & Johnson, Capgemini, Vodafone and Siemens among Aon/cut-e users for some roles; employers do not confirm these lists. Overview: ${SITE_URL}/en/guides/company-assessments

## Practice pages (English)
- [Switch Challenge practice and solver (Aon, P&G)](${SITE_URL}/en/pipeline): find the four-digit code that reorders a row of symbols; step-by-step solver and worked example.
- [Digit Challenge practice and equation solver (Aon, P&G)](${SITE_URL}/en/numerical): fill equation blanks with distinct digits; lists every valid answer.
- [Grid Challenge practice (Aon, P&G)](${SITE_URL}/en/grid): remember dot positions in order while answering symmetry questions.
- [P&G PEAK Performance Assessment practice](${SITE_URL}/en/peak): rating, forced-choice and workplace scenario formats with consistency checks.
- [Switch, Digit and Grid mock tests](${SITE_URL}/en/exams): timed Switch, Digit and Grid style rounds with per-question reports.
- [Practice questions with answers](${SITE_URL}/en/practice): Switch Challenge (pipeline logic), Digit Challenge, figure series and data interpretation at three levels.
- [Preparation guides](${SITE_URL}/en/guides): methods, worked examples and common mistakes for each question type.

## Chinese pages
- [宝洁管道题工具](${SITE_URL}/zh/pipeline)
- [宝洁笔试题库](${SITE_URL}/zh/practice)
- [哪些公司考管道题](${SITE_URL}/zh/guides/company-assessments)
- [宝洁笔试攻略](${SITE_URL}/zh/guides)

## Access
- Sign in for 24 hours of full access, then a free allowance per question type. Paid access is a one-time payment for 7 days (US$14.99 on English pages, ¥9.9 on Chinese pages) with no automatic renewal: ${SITE_URL}/en/pricing
- Guides can be read without signing in.
`;

export function GET() {
  return new Response(BODY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
