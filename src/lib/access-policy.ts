export const FREE_MEMORY_ROUNDS = 10;
export const FREE_SOLVES_PER_KIND = 10;
export const FREE_SAMPLES_PER_KIND = 5;
export const SOLVER_KINDS = ['pipeline', 'numerical', 'figure'] as const;
export type SolverKind = typeof SOLVER_KINDS[number];
export type SolverRemaining = Record<SolverKind, number>;

export function hasFullAccess(status: string) {
  return status === 'paid' || status === 'trial';
}
