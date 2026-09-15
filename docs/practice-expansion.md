# Browser language and practice expansion — 2026-09-13

Implemented in the existing practice flow, preserving authentication, trial checks, rate limits and atomic submission storage.

## Research and choice

Chosen addition: data interpretation (business tables/charts), with growth rate, percentage share and ratio exercises. This is distinct from the existing missing-digit arithmetic task.

Official evidence reviewed:
- SHL lists numerical reasoning using statistical tables, in both interactive and multiple-choice formats: https://www.shlglobal.cn/en/shldirect/en/practice-tests/
- Standard Chartered describes numerical assessment for international graduate applicants, based on business tables and charts: https://www.sc.com/careers/shl-practice-questions/en/
- PwC UK early careers includes numerical, inductive and deductive reasoning: https://www.pwc.co.uk/careers/early-careers/applying/assessment-selection-process.html

These support relevance across employers and overseas recruitment. They do not establish comparative market size, search volume, willingness to pay, or a global most-used ranking. Graphic inductive reasoning and verbal reasoning are other plausible subsequent additions; this release prioritizes numerical data interpretation because the employer evidence is explicit and grading can be deterministic. All questions are independently generated, not copied assessment questions or claimed official simulations.

## Behavior

- First render uses Accept-Language and explicit language cookie; client uses primary navigator language. Chinese variants map to Chinese; other languages default to English. Existing manual localStorage preference remains authoritative. Manual changes update both stores and html language.
- Pipeline easy / medium / hard contains 1 / 2 / 3 sequential boxes with one unknown in a random position. Every puzzle has exactly one permutation solution. Two independent unrestricted unknown permutations would be ambiguous, so this release keeps one unknown per chain.
- Explanations isolate unknown input/output with forward and inverse transformations, then show every forward step. Play/pause/reset/step controls animate persistent shape elements; reduced-motion disables transition. Playback is opt-in.
- Arithmetic explains multiply-before-add and uses the user's valid alternative answer when correct.
- Data questions show an accessible table plus chart, four unique choices and rounded calculation explanations.
- Answers and explanations appear only after an authenticated submission. History supports reopening explanations and retrying. Version-1 stored exercises remain supported; no database migration required.

## Validation

Unit tests cover browser language precedence, 240 generated pipeline puzzles exhaustively checked against all 24 permutations, 300 data questions with independent arithmetic checks, old records and alternative numeric answers. Build and lint passed. Database integration checks and production UI smoke checks are recorded in the task result.

Production deployed successfully: dpl_GcjfZbFo3toof53yY1LmeL6p2qv6 at https://quiz.ckautoflow.com. All 14 tests passed including live database integration. Production checks confirmed English/Chinese request headers and explicit language cookie precedence, anonymous API 401, authenticated three-stage correct grading, animation controls, data question correct grading and bilingual lesson rendering. Two smoke-test submissions were added to the existing signed-in account's history.
