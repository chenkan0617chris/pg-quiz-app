import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

/**
 * Plain-text site summary for AI search and answer engines (llmstxt.org).
 * Keep it factual and in step with the public pages it points to.
 */
const BODY = `# CK Quiz — P&G assessment practice

> Independent practice site for the Procter & Gamble (P&G) online assessment, in English and Chinese. Original, generated questions with worked solutions. Not affiliated with or endorsed by Procter & Gamble; no official test questions.

## What the P&G online assessment includes
- PEAK Performance Assessment: untimed questionnaire about background, experience and work attitudes; P&G says most applicants take about 20 minutes.
- Interactive Assessment (some roles): about 30 minutes of short cognitive games, commonly described as the Switch Challenge, Digit Challenge and Grid Challenge.

## Practice pages (English)
- [P&G Switch Challenge practice and solver](${SITE_URL}/en/pipeline): find the four-digit code that reorders a row of symbols; step-by-step solver and worked example.
- [P&G Digit Challenge practice and equation solver](${SITE_URL}/en/numerical): fill equation blanks with distinct digits; lists every valid answer.
- [P&G Grid Challenge practice](${SITE_URL}/en/grid): remember dot positions in order while answering symmetry questions.
- [P&G PEAK Performance Assessment practice](${SITE_URL}/en/peak): rating, forced-choice and workplace scenario formats with consistency checks.
- [P&G online assessment mock tests](${SITE_URL}/en/exams): timed Switch, Digit and Grid style rounds with per-question reports.
- [Practice questions with answers](${SITE_URL}/en/practice): pipeline logic, figure series, numerical reasoning and data interpretation at three levels.
- [Preparation guides](${SITE_URL}/en/guides): methods, worked examples and common mistakes for each question type.

## Chinese pages
- [宝洁管道题工具](${SITE_URL}/zh/pipeline)
- [宝洁笔试题库](${SITE_URL}/zh/practice)
- [宝洁笔试攻略](${SITE_URL}/zh/guides)

## Access
- Sign in for 24 hours of full access, then a free allowance per question type. Paid access is a one-time payment with no automatic renewal: ${SITE_URL}/en/pricing
- Guides can be read without signing in.
`;

export function GET() {
  return new Response(BODY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
