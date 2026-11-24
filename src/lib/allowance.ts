import { hasFullAccess } from './access-policy';

/** From this many free uses left, the count turns into a warning with a link to the pass. */
export const LOW_ALLOWANCE = 3;

export type AllowanceState = 'hidden' | 'ok' | 'low' | 'empty' | 'locked';

/**
 * What a free account should see next to a tool.
 * `limited` means the server has just refused a request (403). With allowance left
 * that is a member-only item ('locked'), not a used-up allowance.
 */
export function allowanceState({ account, remaining, limited }: {
  account: { status: string } | null; remaining: number | undefined; limited: boolean;
}): AllowanceState {
  if (account && hasFullAccess(account.status)) return 'hidden';
  if (account && remaining !== undefined && remaining <= 0) return 'empty';
  if (limited) return 'locked';
  if (!account || remaining === undefined) return 'hidden';
  return remaining <= LOW_ALLOWANCE ? 'low' : 'ok';
}
