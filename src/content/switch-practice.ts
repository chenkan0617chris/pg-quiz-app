import { apply, invert, type Perm } from '@/lib/engine';

/**
 * A fixed, original set of Switch Challenge questions that anyone can try
 * without signing in. Outputs are derived from the boxes with the solver
 * engine, so the stated answer is correct by construction.
 */
export type SwitchQuestion = {
  id: string;
  input: number[];
  /** Boxes in order; null marks the unknown box. */
  boxes: (Perm | null)[];
  answer: Perm;
  options: Perm[];
};

type Spec = { id: string; input: number[]; boxes: (Perm | 'X')[]; answer: Perm; distractors: Perm[] };

const SPECS: Spec[] = [
  { id: 'q1', input: [1, 2, 3, 4], boxes: ['X'], answer: [2, 1, 4, 3], distractors: [[1, 2, 4, 3], [2, 1, 3, 4], [3, 4, 1, 2]] },
  { id: 'q2', input: [3, 1, 4, 2], boxes: ['X'], answer: [3, 1, 4, 2], distractors: [[2, 4, 1, 3], [3, 4, 1, 2], [1, 3, 2, 4]] },
  { id: 'q3', input: [4, 2, 1, 3], boxes: ['X'], answer: [4, 3, 1, 2], distractors: [[3, 4, 2, 1], [4, 1, 3, 2], [2, 3, 1, 4]] },
  { id: 'q4', input: [1, 2, 3, 4], boxes: [[2, 3, 1, 4], 'X'], answer: [4, 3, 2, 1], distractors: [[4, 1, 3, 2], [1, 2, 4, 3], [3, 4, 2, 1]] },
  { id: 'q5', input: [2, 4, 1, 3], boxes: [[4, 3, 2, 1], 'X'], answer: [1, 3, 4, 2], distractors: [[1, 4, 2, 3], [3, 1, 4, 2], [2, 3, 4, 1]] },
  { id: 'q6', input: [3, 2, 4, 1], boxes: [[1, 4, 2, 3], 'X'], answer: [3, 1, 2, 4], distractors: [[2, 3, 1, 4], [3, 2, 1, 4], [4, 1, 2, 3]] },
  { id: 'q7', input: [1, 2, 3, 4], boxes: ['X', [2, 1, 4, 3]], answer: [3, 1, 4, 2], distractors: [[1, 3, 2, 4], [2, 4, 1, 3], [4, 2, 3, 1]] },
  { id: 'q8', input: [4, 1, 3, 2], boxes: ['X', [3, 4, 1, 2]], answer: [2, 4, 3, 1], distractors: [[4, 1, 2, 3], [1, 3, 2, 4], [2, 4, 1, 3]] },
];

/** Deterministic option order so server and client render the same markup. */
function order(answer: Perm, distractors: Perm[], seed: number): Perm[] {
  const all = [answer, ...distractors];
  const shift = seed % all.length;
  return [...all.slice(shift), ...all.slice(0, shift)];
}

export const SWITCH_QUESTIONS: SwitchQuestion[] = SPECS.map((s, i) => ({
  id: s.id,
  input: s.input,
  boxes: s.boxes.map(b => (b === 'X' ? null : b)),
  answer: s.answer,
  options: order(s.answer, s.distractors, i * 3 + 1),
}));

/** Every row from input to output, with the unknown box filled in. */
export function switchRows(q: SwitchQuestion, fill: Perm = q.answer): number[][] {
  const rows = [q.input];
  for (const box of q.boxes) rows.push(apply(box ?? fill, rows[rows.length - 1]));
  return rows;
}

export function switchOutput(q: SwitchQuestion): number[] {
  return switchRows(q).at(-1)!;
}

/** The row the unknown box receives and the row it must produce. */
export function unknownSpan(q: SwitchQuestion) {
  const index = q.boxes.indexOf(null);
  const rows = switchRows(q);
  let target = rows.at(-1)!;
  // Undo known boxes after the unknown one, last first.
  for (let i = q.boxes.length - 1; i > index; i--) target = apply(invert(q.boxes[i]!), target);
  return { index, from: rows[index], to: target };
}

export const codeText = (p: Perm) => p.join('');
