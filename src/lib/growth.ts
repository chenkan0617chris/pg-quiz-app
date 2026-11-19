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

export type GrowthReviewInput = {
  completed: number;
  correct: number;
  firstCompleted: number;
  firstCorrect: number;
  recentCompleted: number;
  recentCorrect: number;
  mockExams: number;
};

export type GrowthReview = {
  accuracy: number | null;
  firstAccuracy: number | null;
  recentAccuracy: number | null;
  change: number | null;
  hasComparableProgress: boolean;
};

const percent = (correct: number, completed: number) => completed ? Math.round(correct / completed * 100) : null;

/** Only compare meaningful samples, so a lucky first answer never becomes a growth claim. */
export function reviewProgress(input: GrowthReviewInput): GrowthReview {
  const accuracy = percent(input.correct, input.completed);
  const comparable = input.firstCompleted >= 3 && input.recentCompleted >= 3;
  const firstAccuracy = comparable ? percent(input.firstCorrect, input.firstCompleted) : null;
  const recentAccuracy = comparable ? percent(input.recentCorrect, input.recentCompleted) : null;
  return {
    accuracy,
    firstAccuracy,
    recentAccuracy,
    change: firstAccuracy === null || recentAccuracy === null ? null : recentAccuracy - firstAccuracy,
    hasComparableProgress: comparable,
  };
}

/** A brand-new or never-active account: the people onboarding is for. */
export function isUnused(account: UsageAccount) {
  const { practice, solves } = usageTotals(account);
  return practice === 0 && solves === 0;
}

export type TrialPrompt = { kind: 'ending'; hoursLeft: number } | { kind: 'ended' } | null;

export function trialPrompt(account: UsageAccount, now: number): TrialPrompt {
  void account;
  void now;
  return null;
}

/** Dismissals last for the local calendar day. */
export function dayKey(now: number) {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
