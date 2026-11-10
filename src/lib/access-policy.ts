export const FREE_MEMORY_ROUNDS = 10;
export const FREE_SOLVES_PER_KIND = 10;
/** Free accounts get this many newly generated questions per practice kind (lifetime, no daily reset). */
export const FREE_PRACTICE_PER_KIND = 10;
export const PRACTICE_KINDS = ['pipeline', 'numerical', 'data', 'figure', 'grid'] as const;
export type PracticeKind = typeof PRACTICE_KINDS[number];
export type PracticeRemaining = Record<PracticeKind, number>;
export const SOLVER_KINDS = ['pipeline', 'numerical', 'figure'] as const;
export type SolverKind = typeof SOLVER_KINDS[number];
export type SolverRemaining = Record<SolverKind, number>;

export function hasFullAccess(status: string) {
  return status === 'paid' || status === 'trial';
}
