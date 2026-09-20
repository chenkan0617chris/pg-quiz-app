# Unified Pipeline Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three-card pipeline UI with one screenshot-inspired vertical pipeline board shared by the solver, practice question, solve result, and worked explanation.

**Architecture:** Add a small set of presentation primitives in `PipelineBoard.tsx`, then compose them in a dedicated interactive solver board and in the existing practice/result components. The board remains display-only with respect to permutation mathematics; existing state, APIs, and engine types stay authoritative.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, SVG decoration, Playwright, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-20-pipeline-board-design.md`

## Global Constraints

- Preserve the current permutation engine, question generation, API payloads, scoring, authentication, and billing behavior.
- Preserve Pointer Events drag swapping: dropping shape A on shape B swaps only those two positions.
- SVG connectors are decorative, `aria-hidden`, and do not receive pointer events.
- The same visual primitives must be used by solver, practice, result, and lesson views.
- Keep all shape names and user-facing labels localized through the existing i18n context.
- Do not publish to production; finish with a local server opened for user review.
- Preserve the existing uncommitted Playwright and mobile drag changes in the worktree.

---

### Task 1: Lock the unified board contract with a failing browser test

**Files:**
- Modify: `tests/e2e/mobile-pipeline-drag.spec.ts`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: `/en/pipeline` and the current mobile drag fixture.
- Produces: browser-level acceptance checks for an accessible unified board and swap behavior.

- [ ] **Step 1: Extend the current mobile test with the missing visual contract**

Keep the existing pointer sequence and add assertions before it:

```ts
const board = page.getByRole('group', { name: 'Pipeline diagram' });
await expect(board).toBeVisible();
await expect(board.getByText('Input order (top)')).toBeVisible();
await expect(board.getByText('Pipeline boxes')).toBeVisible();
await expect(board.getByText('Output order (bottom)')).toBeVisible();
await expect(board.locator('[data-pipeline-stage]')).toHaveCount(1);
```

Scope the four draggable input shapes through `[data-pipeline-lane="input"]` instead of the old standalone section.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
PLAYWRIGHT_BASE_URL=https://quiz.ckautoflow.com npm run test:e2e -- tests/e2e/mobile-pipeline-drag.spec.ts
```

Expected: FAIL because the current production DOM has no `Pipeline diagram` group or unified stage.

- [ ] **Step 3: Keep the Playwright server target production-like**

Change the local `webServer.command` from `next dev` to:

```ts
command: 'npm run build && npm run start -- --hostname 127.0.0.1 --port 3100'
```

This follows the checked-in Next.js Playwright guidance. Do not modify application auth behavior to accommodate the test.

- [ ] **Step 4: Commit the failing acceptance test**

```bash
git add tests/e2e/mobile-pipeline-drag.spec.ts playwright.config.ts package.json package-lock.json .gitignore
git commit -m "test: define unified pipeline board behavior"
```

---

### Task 2: Build the shared pipeline visual primitives

**Files:**
- Create: `src/components/pipeline/PipelineBoard.tsx`
- Modify: `src/lib/i18n.tsx`
- Test: `tests/e2e/mobile-pipeline-drag.spec.ts`

**Interfaces:**
- Produces:

```ts
export type PipelineStageState = {
  key: React.Key;
  value: string;
  unknown?: boolean;
  solved?: boolean;
  active?: boolean;
};

export function PipelineBoard(props: {
  ariaLabel: string;
  inputLane: React.ReactNode;
  outputLane: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}): React.ReactNode;

export function PipelineShapeLane(props: {
  label: string;
  lane: 'input' | 'output';
  order: number[];
  disabled?: boolean;
  controls?: React.ReactNode;
  onChangeOrder?: (next: number[]) => void;
}): React.ReactNode;

export function PipelineStage(props: {
  label: string;
  state: PipelineStageState;
  children?: React.ReactNode;
}): React.ReactNode;
```

- [ ] **Step 1: Add localized board labels**

Add keys to `DICT`:

```ts
pipelineDiagram: { zh: '管道图', en: 'Pipeline diagram' },
pipelineStage: {
  zh: (n: number) => `第 ${n} 级管道方框`,
  en: (n: number) => `Pipeline stage ${n}`,
},
position: {
  zh: (n: number) => `位置 ${n}`,
  en: (n: number) => `Position ${n}`,
},
```

- [ ] **Step 2: Implement `PipelineBoard` and decorative connector SVGs**

Use a centered `max-w-[34rem]` canvas with `overflow-hidden rounded-[2rem] border border-sky-100 bg-[#F8FBFE]`. Render pale cyan vertical pipes behind content and a deep-blue funnel between each lane and the stage stack. Connector SVGs must use `aria-hidden="true"` and `pointer-events-none`.

The board root must render:

```tsx
<section role="group" aria-label={ariaLabel} data-pipeline-board>
  {inputLane}
  <PipelineFunnel direction="in" />
  <div className="relative z-10 flex flex-col items-center gap-5">{children}</div>
  <PipelineFunnel direction="out" />
  {outputLane}
</section>
```

- [ ] **Step 3: Implement `PipelineShapeLane` with current swap semantics**

Move the Pointer Events state machine from `OrderCard.tsx` into the lane. Render four 56px gray tiles with position numbers above input and below output. Only call `onChangeOrder` when it is provided and the lane is not disabled. On pointer release use:

```ts
const next = order.slice();
[next[from], next[to]] = [next[to], next[from]];
onChangeOrder(next);
```

- [ ] **Step 4: Implement `PipelineStage` states**

Render a sky-blue known stage, deep-blue unknown stage, green-ring solved stage, and indigo-ring active stage. Put the value in a mono face with accessible text. Render optional editor children in a quiet control row below the blue tile.

- [ ] **Step 5: Run static verification**

```bash
npx tsc --noEmit
npm run lint
```

Expected: both commands exit 0.

- [ ] **Step 6: Commit the visual primitives**

```bash
git add src/components/pipeline/PipelineBoard.tsx src/lib/i18n.tsx
git commit -m "feat: add shared pipeline board visuals"
```

---

### Task 3: Replace the solver's three cards with an interactive board

**Files:**
- Create: `src/components/pipeline/InteractivePipelineBoard.tsx`
- Modify: `src/app/[lang]/pipeline/solver.tsx`
- Delete: `src/components/pipeline/OrderCard.tsx`
- Delete: `src/components/pipeline/BoxesCard.tsx`
- Test: `tests/e2e/mobile-pipeline-drag.spec.ts`

**Interfaces:**
- Consumes: `BoxInput[]`, input/output state, and the board primitives from Task 2.
- Produces:

```ts
export default function InteractivePipelineBoard(props: {
  inputOrder: number[];
  outputOrder: number[];
  inputUnknown: boolean;
  outputUnknown: boolean;
  boxes: BoxInput[];
  onInputOrderChange: (value: number[]) => void;
  onOutputOrderChange: (value: number[]) => void;
  onInputUnknownChange: (value: boolean) => void;
  onOutputUnknownChange: (value: boolean) => void;
  onBoxesChange: (value: BoxInput[]) => void;
}): React.ReactNode;
```

- [ ] **Step 1: Implement the interactive composition**

Compose one `PipelineBoard` with two interactive `PipelineShapeLane` nodes. Place the existing unknown checkboxes in each lane's `controls` slot.

For each `BoxInput`, render a `PipelineStage` with:

```tsx
<input
  inputMode="numeric"
  pattern="[1-4]*"
  maxLength={4}
  value={box.value}
  disabled={box.unknown}
  aria-label={t('pipelineStage', index + 1)}
/>
```

Keep the unknown checkbox and remove button in the editor row. Disable removal when only one stage remains. Keep “Add box” immediately below the canvas.

- [ ] **Step 2: Replace solver composition**

Remove the separate `OrderCard`, `BoxesCard`, `OrderCard` JSX and render one `InteractivePipelineBoard` with the same state setters. Keep candidates, API request, result, and Solve button unchanged.

- [ ] **Step 3: Run the focused E2E test and verify GREEN**

Because the local Clerk keys currently loop on localhost, first run this test against an authenticated external deployment only when one exists. During implementation, validate the DOM and pointer handler with TypeScript/build and use the local page for visual review. The final browser test remains required before any future production publication.

Run static checks now:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all exit 0.

- [ ] **Step 4: Commit the solver migration**

```bash
git add src/components/pipeline/InteractivePipelineBoard.tsx src/app/[lang]/pipeline/solver.tsx src/components/pipeline/OrderCard.tsx src/components/pipeline/BoxesCard.tsx tests/e2e/mobile-pipeline-drag.spec.ts
git commit -m "feat: unify pipeline solver controls"
```

---

### Task 4: Put practice answers inside the unknown stage

**Files:**
- Modify: `src/components/practice/PracticePage.tsx`
- Modify: `src/components/pipeline/PipelineBoard.tsx`
- Create: `src/lib/practice-answer.ts`
- Create: `tests/practice-answer.test.ts`

**Interfaces:**
- Consumes: `PublicQuestion` pipeline fields and `digits` state already owned by `PracticeContent`.
- Produces:

```ts
export function PipelineAnswerInputs(props: {
  values: string[];
  disabled?: boolean;
  onChange: (index: number, value: string) => void;
  labels: string[];
}): React.ReactNode;
```

- [ ] **Step 1: Add a failing pure behavior test for answer normalization**

Extract and test a small helper in `src/lib/practice-answer.ts`:

```ts
export function updatePipelineDigit(values: string[], index: number, raw: string): string[];
```

Test:

```ts
assert.deepEqual(updatePipelineDigit(['', '', '', ''], 1, '3x'), ['', '3', '', '']);
assert.deepEqual(updatePipelineDigit(['1', '2', '3', '4'], 0, '9'), ['1', '2', '3', '4']);
```

Run `npm test` and confirm RED because the helper does not exist.

- [ ] **Step 2: Implement the minimal digit helper and inputs**

Accept only one digit from `1` through `4`; invalid input leaves the prior value unchanged. `PipelineAnswerInputs` renders four 36–40px single-character inputs inside the unknown deep-blue stage, with white text and visible focus rings.

- [ ] **Step 3: Replace the practice pipeline markup**

Render a read-only input lane and output lane. Convert each question box to a `PipelineStageState`; for the unknown box, render `PipelineAnswerInputs` bound to `digits`. Remove only the generic four-input block for `question.kind === 'pipeline'`; keep numerical, figure, and data answer controls unchanged.

- [ ] **Step 4: Verify practice logic**

```bash
npm test
npx tsc --noEmit
npm run lint
```

Expected: all existing tests and the new helper tests pass.

- [ ] **Step 5: Commit the practice migration**

```bash
git add src/components/practice/PracticePage.tsx src/components/pipeline/PipelineBoard.tsx src/lib/practice-answer.ts tests/practice-answer.test.ts
git commit -m "feat: embed pipeline practice answers"
```

---

### Task 5: Reuse the board for solve results and lessons

**Files:**
- Modify: `src/components/pipeline/FlowDiagram.tsx`
- Modify: `src/components/pipeline/ResultView.tsx`
- Modify: `src/components/practice/Lesson.tsx`
- Delete: `src/components/pipeline/ShapeRow.tsx` only if no remaining imports exist

**Interfaces:**
- Consumes: `Flow`, `Explanation`, and shared board primitives.
- Produces: consistent explanation boards with solved and active stage states.

- [ ] **Step 1: Replace `FlowDiagram` internals**

Map `flow.stages` to `PipelineStageState`:

```ts
const stages = flow.stages.map((stage, index) => ({
  key: index,
  value: stage.box.join(''),
  solved: stage.solved,
}));
```

Render input and the final stage output through read-only shape lanes. Preserve `highlightOutput` as an accessible solved-output treatment.

- [ ] **Step 2: Update `ResultView` composition**

Keep banners, candidate matches, and error rows unchanged. Let every successful result branch render the new `FlowDiagram` below its summary.

- [ ] **Step 3: Update pipeline `Lesson`**

Replace the standalone moving-shapes box and step cards with one explanation board whose `active` stage matches `frame - 1`. Continue using the existing timer, Reset, Play/Pause, and Next buttons. The textual derivation remains below the board.

- [ ] **Step 4: Remove obsolete `ShapeRow` only when safe**

Run:

```bash
rg -n "ShapeRow" src
```

Delete `ShapeRow.tsx` only when the command reports no imports outside files already migrated. Otherwise keep it for unrelated compact summaries.

- [ ] **Step 5: Verify all result types compile and tests pass**

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: 0 failures and a successful production build.

- [ ] **Step 6: Commit result and lesson migration**

```bash
git add src/components/pipeline/FlowDiagram.tsx src/components/pipeline/ResultView.tsx src/components/practice/Lesson.tsx src/components/pipeline/ShapeRow.tsx
git commit -m "feat: unify pipeline explanations"
```

---

### Task 6: Visual critique and local handoff

**Files:**
- Modify as required by critique: pipeline files from Tasks 2–5 only

**Interfaces:**
- Consumes: complete local UI.
- Produces: a running localhost preview opened for user review.

- [ ] **Step 1: Run the full verification suite**

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0. Report any intentionally skipped database integration tests separately.

- [ ] **Step 2: Start the local production server**

```bash
npm run start -- --hostname 127.0.0.1 --port 3100
```

If Clerk repeats the known localhost session-token redirect caused by the current local key configuration, do not change authentication code. Pull a matched development environment into a temporary, ignored env file with Vercel CLI, rebuild, and restart. Never print or commit secret values.

- [ ] **Step 3: Inspect desktop and mobile layouts**

Open `/zh/pipeline` and `/zh/practice`. Check at approximately 1280px and 390px widths:

- all four tiles remain visible;
- pipes align behind stage tiles;
- controls are not obscured;
- unknown inputs remain usable;
- no horizontal page overflow;
- drag swaps exactly two shapes.

- [ ] **Step 4: Apply one restrained visual critique pass**

Compare the local board to both reference screenshots. Adjust only spacing, pipe thickness, tile radius, or blue contrast. Do not add unrelated decoration or change site-wide typography.

- [ ] **Step 5: Re-run verification after critique**

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 6: Open the local page for the user**

Use the app preview/browser opener to show `http://127.0.0.1:3100/zh/pipeline`. Keep the server running so the user can inspect both solver and practice pages. Do not deploy production until the user explicitly approves the local result.
