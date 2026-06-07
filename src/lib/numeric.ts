/* =====================================================================
   NUMERIC REASONING ENGINE — pure, no React.

   Puzzle: an arithmetic equation built from blank single-digit slots,
   operators (+ - * /) and parentheses, equal to a target. Find the
   digit for every blank (default 1-9, no repeats) so the equation holds.

   The equation is a list of builder Tokens. solveNumeric() searches all
   valid digit assignments and returns the ones that hit the target.
   ===================================================================== */

export type Op = '+' | '-' | '*' | '/';

export type Token =
  | { kind: 'blank'; id: string }
  | { kind: 'op'; id: string; op: Op }
  | { kind: 'lparen'; id: string }
  | { kind: 'rparen'; id: string };

export const OP_SYMBOL: Record<Op, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };
export const OP_CYCLE: Op[] = ['+', '-', '*', '/'];

type EvalTok =
  | { t: 'num'; v: number }
  | { t: 'op'; v: Op }
  | { t: '(' }
  | { t: ')' };

const PREC: Record<Op, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

function toEval(tokens: Token[], assign: number[]): EvalTok[] {
  let bi = 0;
  return tokens.map((tk): EvalTok => {
    switch (tk.kind) {
      case 'blank':
        return { t: 'num', v: assign[bi++] };
      case 'op':
        return { t: 'op', v: tk.op };
      case 'lparen':
        return { t: '(' };
      case 'rparen':
        return { t: ')' };
    }
  });
}

/** Evaluate a flat token list via shunting-yard. Returns null if malformed. */
function evaluate(toks: EvalTok[]): number | null {
  const output: (number | Op)[] = [];
  const ops: (Op | '(')[] = [];

  for (const tk of toks) {
    if (tk.t === 'num') {
      output.push(tk.v);
    } else if (tk.t === 'op') {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top !== '(' && PREC[top] >= PREC[tk.v]) output.push(ops.pop() as Op);
        else break;
      }
      ops.push(tk.v);
    } else if (tk.t === '(') {
      ops.push('(');
    } else {
      // ')'
      let matched = false;
      while (ops.length) {
        const top = ops.pop()!;
        if (top === '(') {
          matched = true;
          break;
        }
        output.push(top);
      }
      if (!matched) return null;
    }
  }
  while (ops.length) {
    const top = ops.pop()!;
    if (top === '(') return null;
    output.push(top);
  }

  // Evaluate RPN.
  const st: number[] = [];
  for (const o of output) {
    if (typeof o === 'number') {
      st.push(o);
    } else {
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined) return null;
      let r: number;
      switch (o) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case '/':
          if (b === 0) return null;
          r = a / b;
          break;
      }
      st.push(r);
    }
  }
  return st.length === 1 ? st[0] : null;
}

/** Pretty string for the equation, blanks shown as ? unless an assignment is given. */
export function formatEquation(tokens: Token[], assign?: number[]): string {
  let bi = 0;
  const parts = tokens.map((tk) => {
    switch (tk.kind) {
      case 'blank':
        return assign ? String(assign[bi++]) : '?';
      case 'op':
        return OP_SYMBOL[tk.op];
      case 'lparen':
        return '(';
      case 'rparen':
        return ')';
    }
  });
  return parts.join(' ');
}

export function countBlanks(tokens: Token[]): number {
  return tokens.filter((t) => t.kind === 'blank').length;
}

export interface SolveOptions {
  min: number; // digit pool low (inclusive)
  max: number; // digit pool high (inclusive)
  distinct: boolean; // no repeated digits
  maxSolutions?: number; // cap returned solutions (default 500)
  maxCombos?: number; // safety cap on search space (default 2_000_000)
}

export interface NumericResult {
  ok: boolean;
  errorKey?: string;
  errorParams?: (string | number)[];
  blanks: number;
  solutions: number[][]; // each = digit per blank, in order
  truncated: boolean;
}

function* permute(pool: number[], n: number): Generator<number[]> {
  const used = new Array(pool.length).fill(false);
  const cur: number[] = [];
  function* rec(): Generator<number[]> {
    if (cur.length === n) {
      yield cur.slice();
      return;
    }
    for (let i = 0; i < pool.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      cur.push(pool[i]);
      yield* rec();
      cur.pop();
      used[i] = false;
    }
  }
  yield* rec();
}

function* product(pool: number[], n: number): Generator<number[]> {
  const cur: number[] = [];
  function* rec(): Generator<number[]> {
    if (cur.length === n) {
      yield cur.slice();
      return;
    }
    for (const v of pool) {
      cur.push(v);
      yield* rec();
      cur.pop();
    }
  }
  yield* rec();
}

const EPS = 1e-9;

export function solveNumeric(tokens: Token[], target: number, opts: SolveOptions): NumericResult {
  const maxSolutions = opts.maxSolutions ?? 500;
  const maxCombos = opts.maxCombos ?? 2_000_000;
  const n = countBlanks(tokens);

  const base: NumericResult = { ok: false, blanks: n, solutions: [], truncated: false };

  if (n === 0) return { ...base, errorKey: 'numErrNoBlank' };
  if (!Number.isFinite(target)) return { ...base, errorKey: 'numErrTarget' };

  // Structural validity: a dummy assignment must evaluate to a number.
  if (evaluate(toEval(tokens, new Array(n).fill(1))) === null) {
    return { ...base, errorKey: 'numErrInvalid' };
  }

  const pool: number[] = [];
  for (let d = opts.min; d <= opts.max; d++) pool.push(d);

  if (opts.distinct && n > pool.length) {
    return { ok: true, blanks: n, solutions: [], truncated: false };
  }

  // Guard against an explosive search space.
  const combos = opts.distinct
    ? perms(pool.length, n)
    : Math.pow(pool.length, n);
  if (combos > maxCombos) return { ...base, errorKey: 'numErrTooBig' };

  const gen = opts.distinct ? permute(pool, n) : product(pool, n);
  const solutions: number[][] = [];
  let truncated = false;
  for (const assign of gen) {
    const val = evaluate(toEval(tokens, assign));
    if (val !== null && Math.abs(val - target) < EPS) {
      solutions.push(assign);
      if (solutions.length >= maxSolutions) {
        truncated = true;
        break;
      }
    }
  }
  return { ok: true, blanks: n, solutions, truncated };
}

function perms(poolSize: number, n: number): number {
  let r = 1;
  for (let i = 0; i < n; i++) r *= poolSize - i;
  return r;
}

let _uid = 0;
export function uid(): string {
  _uid += 1;
  return `t${_uid}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Build a token list from a compact spec, e.g. "(?*?*?)+?". Spaces ignored. */
export function tokensFromSpec(spec: string): Token[] {
  const out: Token[] = [];
  for (const ch of spec) {
    if (ch === '?') out.push({ kind: 'blank', id: uid() });
    else if (ch === '(') out.push({ kind: 'lparen', id: uid() });
    else if (ch === ')') out.push({ kind: 'rparen', id: uid() });
    else if (ch === '+' || ch === '-' || ch === '*' || ch === '/')
      out.push({ kind: 'op', id: uid(), op: ch });
    // ignore spaces / anything else
  }
  return out;
}

/** The canonical sample puzzle: ( ? × ? × ? ) + ? = 177 */
export function defaultTokens(): Token[] {
  return tokensFromSpec('(?*?*?)+?');
}

/** Pre-designed equation templates the user can apply with one click. */
export const PRESET_SPECS: string[] = [
  '(?*?*?)+?',
  '?*?+?',
  '?*?-?',
  '?*?*?',
  '(?+?)*?',
  '(?+?)*?-?',
  '?*?+?*?',
  '(?-?)*?+?',
];
