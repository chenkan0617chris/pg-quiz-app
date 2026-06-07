/* =====================================================================
   CORE ENGINE — pure permutation math (ported verbatim from the
   original verified solver) plus a single solvePuzzle() entry point
   that centralises ALL case routing so the UI only renders results.

   A "box" is a permutation of [1,2,3,4] stored as a 1-indexed array.
   Convention:  output[i] = input[ box[i] ]
   (digit i of the box names which input slot feeds output slot i)
   ===================================================================== */

export type Perm = number[]; // 1-indexed permutation of 1..4

// Apply one box to a sequence (1-indexed box, 0-indexed array access).
export function apply(box: Perm, seq: number[]): number[] {
  return box.map((src) => seq[src - 1]);
}

// Compose two boxes: result applies `first` then `second`.
// apply(composeApply(a, b), seq) === apply(b, apply(a, seq))
export function composeApply(first: Perm, second: Perm): Perm {
  return second.map((i) => first[i - 1]);
}

// Fold a list of boxes (applied in order) into a single permutation.
export function foldBoxes(boxes: Perm[]): Perm {
  return boxes.reduce<Perm>((acc, b) => composeApply(acc, b), [1, 2, 3, 4]);
}

// Inverse permutation: inv[ p[i] ] = i.
export function invert(p: Perm): Perm {
  const inv: number[] = [];
  p.forEach((v, i) => {
    inv[v - 1] = i + 1;
  });
  return inv;
}

// Overall pipeline permutation P from input & output orders.
// apply(P, inputOrder) === outputOrder, i.e. P[i] = pos of outputOrder[i] in inputOrder.
export function derivePermutation(inputOrder: number[], outputOrder: number[]): Perm {
  return outputOrder.map((shape) => inputOrder.indexOf(shape) + 1);
}

// Solve the single unknown box X given boxes before/after it and total P.
//   X = composeApply( invert(fold(before)), composeApply(P, invert(fold(after))) )
export function solveMissing(before: Perm[], after: Perm[], P: Perm): Perm {
  const L = foldBoxes(before);
  const R = foldBoxes(after);
  return composeApply(invert(L), composeApply(P, invert(R)));
}

export function isPermutation(arr: number[], n = 4): boolean {
  if (arr.length !== n) return false;
  if (new Set(arr).size !== n) return false;
  return arr.every((v) => Number.isInteger(v) && v >= 1 && v <= n);
}

export function parseBox(str: string): Perm | null {
  const digits = str.split('').map(Number);
  return isPermutation(digits, 4) ? digits : null;
}

// Cartesian product: all length-n tuples drawn (with repetition) from pool.
export function cartesian<T>(pool: T[], n: number): T[][] {
  let res: T[][] = [[]];
  for (let k = 0; k < n; k++) {
    const next: T[][] = [];
    res.forEach((combo) => pool.forEach((item) => next.push(combo.concat([item]))));
    res = next;
  }
  return res;
}

const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/* =====================================================================
   HIGH-LEVEL SOLVE — structured input/output, i18n-key error messages.
   ===================================================================== */

export interface BoxInput {
  value: string;
  unknown: boolean;
}

export interface PuzzleInput {
  inputUnknown: boolean;
  outputUnknown: boolean;
  inputOrder: number[]; // ignored if inputUnknown
  outputOrder: number[]; // ignored if outputUnknown
  boxes: BoxInput[];
  candidates: string; // raw comma-separated text
}

export interface ErrorItem {
  key: string;
  params?: (string | number)[];
}

export interface FlowStage {
  box: Perm;
  solved: boolean; // was this box solved by us?
  seqAfter: number[];
}

export interface Flow {
  input: number[];
  stages: FlowStage[];
}

export type SolveResult =
  | { kind: 'errors'; errors: ErrorItem[] }
  | { kind: 'order'; labelKey: 'inputOrder' | 'outputOrder'; solvedSeq: number[]; flow: Flow }
  | {
      kind: 'singleBox';
      boxIndex: number;
      box: Perm;
      candidates: { str: string; match: boolean }[];
      noMatch: boolean;
      consistent: boolean;
      flow: Flow;
    }
  | {
      kind: 'multiBox';
      solutions: { boxIndex: number; box: Perm }[][];
      flow: Flow;
    };

function buildFlow(input: number[], boxes: Perm[], solvedSet: Set<number>): Flow {
  let seq = input.slice();
  const stages = boxes.map((box, i) => {
    seq = apply(box, seq);
    return { box, solved: solvedSet.has(i), seqAfter: seq.slice() };
  });
  return { input, stages };
}

function parseCandidates(raw: string): { raw: string[]; perms: Perm[] } {
  const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const perms = items.map(parseBox).filter((b): b is Perm => b !== null);
  return { raw: items, perms };
}

/**
 * The single source of truth for the solving logic. Mirrors the original
 * solve() routing exactly:
 *   - validation errors
 *   - CASE B/C: an order is unknown, all boxes known -> compute that order
 *   - CASE A (1 unknown box): unique algebraic solution
 *   - CASE A (>=2 unknown boxes): brute-force candidate combinations
 */
export function solvePuzzle(inp: PuzzleInput): SolveResult {
  const errors: ErrorItem[] = [];
  const { inputUnknown, outputUnknown } = inp;
  const inputOrder = inputUnknown ? null : inp.inputOrder;
  const outputOrder = outputUnknown ? null : inp.outputOrder;

  if (inputUnknown && outputUnknown) errors.push({ key: 'errBothUnknown' });
  if (!inputUnknown && !isPermutation(inputOrder!)) errors.push({ key: 'errInputPerm' });
  if (!outputUnknown && !isPermutation(outputOrder!)) errors.push({ key: 'errOutputPerm' });

  const parsed: (Perm | '?')[] = inp.boxes.map((b) =>
    b.unknown ? '?' : (parseBox(b.value) as Perm),
  );
  inp.boxes.forEach((b, i) => {
    if (!b.unknown && parseBox(b.value) === null) {
      errors.push({ key: 'errBoxPerm', params: [i + 1, b.value] });
    }
  });

  const unknownBoxIdxs = inp.boxes.map((b, i) => (b.unknown ? i : -1)).filter((i) => i >= 0);
  const orderUnknown = inputUnknown || outputUnknown;

  if (orderUnknown && unknownBoxIdxs.length > 0) errors.push({ key: 'errOrderBoxes' });
  if (!orderUnknown && unknownBoxIdxs.length === 0) errors.push({ key: 'errNothing' });

  if (errors.length) return { kind: 'errors', errors };

  // ---------- CASE B/C: an order is unknown, all boxes known ----------
  if (orderUnknown) {
    const boxes = parsed as Perm[];
    const fold = foldBoxes(boxes);
    let knownInput: number[];
    let solvedSeq: number[];
    let labelKey: 'inputOrder' | 'outputOrder';
    if (outputUnknown) {
      knownInput = inputOrder!;
      solvedSeq = apply(fold, inputOrder!); // output = pipeline(input)
      labelKey = 'outputOrder';
    } else {
      solvedSeq = apply(invert(fold), outputOrder!); // input = pipeline^-1(output)
      knownInput = solvedSeq;
      labelKey = 'inputOrder';
    }
    return { kind: 'order', labelKey, solvedSeq, flow: buildFlow(knownInput, boxes, new Set()) };
  }

  // ---------- CASE A: one or more boxes unknown, orders known ----------
  const P = derivePermutation(inputOrder!, outputOrder!);
  const cand = parseCandidates(inp.candidates);

  if (unknownBoxIdxs.length === 1) {
    const idx = unknownBoxIdxs[0];
    const before = parsed.slice(0, idx) as Perm[];
    const after = parsed.slice(idx + 1) as Perm[];
    const X = solveMissing(before, after, P);
    const xStr = X.join('');
    const full = parsed.map((p) => (p === '?' ? X : p)) as Perm[];
    const flow = buildFlow(inputOrder!, full, new Set([idx]));
    const consistent = eq(flow.stages[flow.stages.length - 1].seqAfter, outputOrder);
    return {
      kind: 'singleBox',
      boxIndex: idx,
      box: X,
      candidates: cand.raw.map((c) => ({ str: c, match: c === xStr })),
      noMatch: cand.raw.length > 0 && !cand.raw.includes(xStr),
      consistent,
      flow,
    };
  }

  // Multiple unknown boxes: candidates REQUIRED, brute-force combinations.
  if (cand.perms.length === 0) {
    return { kind: 'errors', errors: [{ key: 'needCands', params: [unknownBoxIdxs.length] }] };
  }
  const solutions: { boxIndex: number; box: Perm }[][] = [];
  cartesian(cand.perms, unknownBoxIdxs.length).forEach((combo) => {
    const boxes = parsed.slice() as Perm[];
    unknownBoxIdxs.forEach((bi, k) => (boxes[bi] = combo[k]));
    if (eq(foldBoxes(boxes), P)) {
      solutions.push(unknownBoxIdxs.map((bi, k) => ({ boxIndex: bi, box: combo[k] })));
    }
  });
  if (solutions.length === 0) return { kind: 'errors', errors: [{ key: 'noCombo' }] };

  const firstBoxes = parsed.slice() as Perm[];
  unknownBoxIdxs.forEach((bi, k) => (firstBoxes[bi] = solutions[0][k].box));
  return { kind: 'multiBox', solutions, flow: buildFlow(inputOrder!, firstBoxes, new Set(unknownBoxIdxs)) };
}
