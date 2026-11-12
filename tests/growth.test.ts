import test from 'node:test';
import assert from 'node:assert/strict';
import { isUnused, nextStepPath, parseOnboarding, startPath, trialPrompt } from '../src/lib/growth';

const now = Date.parse('2026-11-12T12:00:00Z');
const base = { status: 'trial' as const, trialEndsAt: new Date(now + 3600_000).toISOString(), paidUntil: null, practiceUsage: {}, solves: 0 };

test('each target test starts on a matching practice page', () => {
  assert.equal(startPath('aon'), '/practice?kind=pipeline');
  assert.equal(startPath('shl'), '/verbal');
  assert.equal(startPath('big4'), '/practice?kind=data');
  assert.equal(startPath('unsure'), '/practice');
  assert.equal(nextStepPath('aon', '3d'), '/exams');
  assert.equal(nextStepPath('aon', 'later'), null);
});

test('stored onboarding is validated', () => {
  assert.deepEqual(parseOnboarding('{"test":"aon","when":"2w"}'), { test: 'aon', when: '2w' });
  assert.deepEqual(parseOnboarding('{"skipped":true}'), { skipped: true });
  assert.equal(parseOnboarding('{"test":"x","when":"2w"}'), null);
  assert.equal(parseOnboarding('not json'), null);
  assert.equal(parseOnboarding(null), null);
});

test('unused means no practice and no solves', () => {
  assert.equal(isUnused(base), true);
  assert.equal(isUnused({ ...base, solves: 1 }), false);
  assert.equal(isUnused({ ...base, practiceUsage: { pipeline: { started: 1, completed: 0 } } }), false);
});

test('trial prompt shows in the last 6 hours of the trial', () => {
  assert.deepEqual(trialPrompt(base, now), { kind: 'ending', hoursLeft: 1 });
  assert.deepEqual(trialPrompt({ ...base, trialEndsAt: new Date(now + 5.5 * 3600_000).toISOString() }, now), { kind: 'ending', hoursLeft: 6 });
  assert.equal(trialPrompt({ ...base, trialEndsAt: new Date(now + 7 * 3600_000).toISOString() }, now), null);
});

test('ended prompt only for recent, active, never-paid users', () => {
  const ended = { ...base, status: 'expired' as const, trialEndsAt: new Date(now - 86400_000).toISOString(), solves: 3 };
  assert.deepEqual(trialPrompt(ended, now), { kind: 'ended' });
  assert.equal(trialPrompt({ ...ended, solves: 0 }, now), null);
  assert.equal(trialPrompt({ ...ended, paidUntil: '2026-11-01T00:00:00Z' }, now), null);
  assert.equal(trialPrompt({ ...ended, trialEndsAt: new Date(now - 15 * 86400_000).toISOString() }, now), null);
  assert.equal(trialPrompt({ ...ended, status: 'paid' }, now), null);
  assert.equal(trialPrompt({ ...ended, lifetime: true }, now), null);
});
