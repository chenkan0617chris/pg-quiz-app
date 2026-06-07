/* =====================================================================
   PIPELINE QUESTION BANK — 30 deterministic, difficulty-graded puzzles.

   Each puzzle is derived by:
   1. Choosing a set of concrete boxes and an input order.
   2. Computing the correct output via the engine.
   3. Hiding one box as the unknown.
   4. Generating 3 wrong options deterministically.
   ===================================================================== */

import { apply, foldBoxes, type Perm } from './engine';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BankPuzzle {
  id: number;
  difficulty: Difficulty;
  inputOrder: number[];      // 4 shape ids (1–4)
  boxes: (string | null)[];  // string = known permutation, null = unknown
  outputOrder: number[];     // 4 shape ids after pipeline
  options: string[];         // exactly 4 options (1 correct + 3 wrong), shuffled
  answer: string;            // the correct option string
}

// All 24 permutations of 1–4, as strings — wrong-option pool
const ALL_PERMS: string[] = [];
for (const a of [1,2,3,4]) for (const b of [1,2,3,4]) for (const c of [1,2,3,4]) for (const d of [1,2,3,4]) {
  if (new Set([a,b,c,d]).size === 4) ALL_PERMS.push(`${a}${b}${c}${d}`);
}

function parseP(s: string): Perm { return s.split('').map(Number); }

/** Pick 3 wrong options deterministically using the puzzle id as a seed. */
function wrongOpts(correct: string, seed: number): string[] {
  const pool = ALL_PERMS.filter(p => p !== correct);
  const result: string[] = [];
  let i = seed % pool.length;
  while (result.length < 3) {
    const c = pool[i % pool.length];
    if (!result.includes(c)) result.push(c);
    i = (i * 7 + seed + 3) % pool.length;
  }
  return result;
}

/** Place the correct answer at a deterministic position among the 4 options. */
function arrangeOptions(correct: string, wrong: string[], seed: number): string[] {
  const pos = seed % 4;
  const opts = wrong.slice();
  opts.splice(pos, 0, correct);
  return opts;
}

/**
 * Build a BankPuzzle from a spec:
 * @param allBoxes  All boxes in pipeline order (none unknown yet), as strings.
 * @param hideIdx   Which box position to hide as the unknown.
 */
function make(
  id: number,
  difficulty: Difficulty,
  inputOrder: number[],
  allBoxes: string[],
  hideIdx: number,
): BankPuzzle {
  const perms = allBoxes.map(parseP);
  const fold = foldBoxes(perms);
  const outputOrder = apply(fold, inputOrder);
  const answer = allBoxes[hideIdx];
  const boxes: (string | null)[] = allBoxes.map((b, i) => (i === hideIdx ? null : b));
  const wrong = wrongOpts(answer, id);
  const options = arrangeOptions(answer, wrong, id);
  return { id, difficulty, inputOrder, boxes, outputOrder, options, answer };
}

// ── EASY (10 puzzles) — 2 boxes, 1 unknown ───────────────────────────
// 2 boxes means 1 visible + 1 unknown; simpler composition.

// ── MEDIUM (10 puzzles) — 3 boxes, 1 unknown ─────────────────────────
// Mirrors the canonical sample from the screenshot.

// ── HARD (10 puzzles) — 4 boxes, 1 unknown ───────────────────────────

export const PUZZLE_BANK: BankPuzzle[] = [
  // ── EASY ──────────────────────────────────────────────────────────────
  make(1,  'easy',   [1,2,3,4], ['1324','2413'],         1),
  make(2,  'easy',   [1,2,3,4], ['2143','1324'],         0),
  make(3,  'easy',   [1,2,3,4], ['4321','2143'],         0),
  make(4,  'easy',   [1,2,3,4], ['3412','1324'],         1),
  make(5,  'easy',   [2,1,3,4], ['2413','3412'],         0),
  make(6,  'easy',   [1,2,3,4], ['3142','4123'],         1),
  make(7,  'easy',   [4,3,2,1], ['2341','3412'],         0),
  make(8,  'easy',   [1,2,3,4], ['4231','2341'],         1),
  make(9,  'easy',   [1,3,2,4], ['1432','3214'],         0),
  make(10, 'easy',   [1,2,3,4], ['3214','1432'],         1),

  // ── MEDIUM ────────────────────────────────────────────────────────────
  make(11, 'medium', [1,2,3,4], ['1324','2413','2143'],  1),  // sample puzzle
  make(12, 'medium', [1,2,3,4], ['2143','1324','3412'],  0),
  make(13, 'medium', [1,2,3,4], ['3412','2143','1324'],  2),
  make(14, 'medium', [2,1,3,4], ['4321','1324','2413'],  1),
  make(15, 'medium', [1,2,3,4], ['2413','4321','1324'],  0),
  make(16, 'medium', [1,3,2,4], ['1324','3412','2143'],  2),
  make(17, 'medium', [1,2,3,4], ['3142','2143','4321'],  1),
  make(18, 'medium', [4,3,2,1], ['2341','1432','3214'],  0),
  make(19, 'medium', [1,2,3,4], ['4231','3142','2143'],  2),
  make(20, 'medium', [2,4,1,3], ['2143','2413','1324'],  1),

  // ── HARD ──────────────────────────────────────────────────────────────
  make(21, 'hard',   [1,2,3,4], ['1324','2413','2143','4321'],  2),
  make(22, 'hard',   [1,2,3,4], ['2143','3412','1324','2413'],  1),
  make(23, 'hard',   [2,1,3,4], ['4321','1324','2413','3412'],  3),
  make(24, 'hard',   [1,2,3,4], ['3412','2143','4321','1324'],  0),
  make(25, 'hard',   [1,3,2,4], ['2413','1324','3142','2143'],  2),
  make(26, 'hard',   [1,2,3,4], ['4123','2341','1432','3214'],  1),
  make(27, 'hard',   [3,2,1,4], ['3214','2413','1324','4231'],  3),
  make(28, 'hard',   [1,2,3,4], ['2341','4321','3142','2413'],  0),
  make(29, 'hard',   [4,1,2,3], ['1432','3412','2143','1324'],  2),
  make(30, 'hard',   [1,2,3,4], ['3142','4231','2413','1432'],  1),
];
