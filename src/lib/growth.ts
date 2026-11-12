/** Onboarding and trial-conversion decisions. Pure so they can be unit tested. */

export const TARGET_TESTS = ['aon', 'shl', 'big4', 'unsure'] as const;
export type TargetTest = typeof TARGET_TESTS[number];
export const EXAM_WHEN = ['3d', '2w', 'later'] as const;
export type ExamWhen = typeof EXAM_WHEN[number];
export type Onboarding = { test: TargetTest; when: ExamWhen } | { skipped: true };

export const ONBOARDING_KEY = 'ck-onboarding-v1';
export const TRIAL_DISMISS_KEY = 'ck-trial-prompt-dismissed';
/** Show the "trial ending" prompt in the last hours of the 24-hour trial. */
export const ENDING_WINDOW_MS = 6 * 3600_000;
/** After the trial ends, keep reminding active users for this long. */
export const ENDED_WINDOW_MS = 14 * 86400_000;

/** Where a user should start for the test they told us about. */
export function startPath(test: TargetTest): string {
  switch (test) {
    case 'aon': return '/practice?kind=pipeline';
    case 'shl': return '/verbal';
    case 'big4': return '/practice?kind=data';
    default: return '/practice';
  }
}

/** Follow-up step for a test that is close: timed mock exams. */
export function nextStepPath(test: TargetTest, when: ExamWhen): string | null {
  if (when === 'later') return null;
  return test === 'shl' ? '/practice?kind=data' : '/exams';
}

export function parseOnboarding(raw: string | null): Onboarding | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (value.skipped === true) return { skipped: true };
    if (TARGET_TESTS.includes(value.test as TargetTest) && EXAM_WHEN.includes(value.when as ExamWhen)) {
      return { test: value.test as TargetTest, when: value.when as ExamWhen };
    }
  } catch { /* fall through */ }
  return null;
}

type UsageAccount = {
  status: 'trial' | 'paid' | 'expired';
  lifetime?: boolean;
  trialEndsAt: string;
  paidUntil: string | null;
  practiceUsage: Record<string, { started: number; completed: number }>;
  solves?: number;
};

export function usageTotals(account: UsageAccount) {
  const practice = Object.values(account.practiceUsage).reduce((sum, row) => sum + row.started, 0);
  return { practice, solves: account.solves ?? 0 };
}

/** A brand-new or never-active account: the people onboarding is for. */
export function isUnused(account: UsageAccount) {
  const { practice, solves } = usageTotals(account);
  return practice === 0 && solves === 0;
}

export type TrialPrompt = { kind: 'ending'; hoursLeft: number } | { kind: 'ended' } | null;

export function trialPrompt(account: UsageAccount, now: number): TrialPrompt {
  if (account.lifetime || account.status === 'paid') return null;
  const trialEnd = Date.parse(account.trialEndsAt);
  if (Number.isNaN(trialEnd)) return null;
  if (account.status === 'trial') {
    const left = trialEnd - now;
    return left > 0 && left <= ENDING_WINDOW_MS ? { kind: 'ending', hoursLeft: Math.max(1, Math.ceil(left / 3600_000)) } : null;
  }
  // Expired: only people who used something, only for a while, and never former members.
  if (account.paidUntil) return null;
  if (now - trialEnd > ENDED_WINDOW_MS) return null;
  return isUnused(account) ? null : { kind: 'ended' };
}

/** Dismissals last for the local calendar day. */
export function dayKey(now: number) {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
