# Mock exam center

User delegates implementation of a realistic P&G-style member exam, missing training modules, and visible non-member previews.

## Evidence and boundaries
- P&G official https://www.pgcareers.com/global/en/assesment-overviews : PEAK work-related attitudes, normally ~20 minutes without a time limit; role-dependent Interactive Assessment ~30 minutes including instructions. Actual combinations vary.
- Public preparation reference https://www.jobtestprep.co.uk/procter-and-gamble-assessment : Switch 6 minutes, Digit 5 minutes, Grid 9 minutes. These are our practice presets, not an official promise.
- Existing pipeline/digit practice is reusable. Existing memory only plays a sequence; add interleaved spatial judgements. PEAK is a separate original familiarization exercise, no right personality or hiring score.

## Flow
Public center -> sample exam/report preview -> membership CTA or authenticated member preflight -> fullscreen gesture -> per-section instructions -> Switch / Digit / Grid -> submit or server deadline -> next section instructions -> saved report. Use existing paid/trial full-access policy. Esc hides exam content and asks to return; clock continues. Unsupported fullscreen blocks starting and explains desktop requirement. Refresh resumes account-owned active exam from server; no clock reset. No correctness or solutions until whole exam ends. Early submission requires confirmation.

## Storage and invariants
New additive mock_exams table: owner, id, revision, JSON state, dates; one active exam per owner. Server uses compare-and-swap for concurrent commands, question ids for submission idempotency, server timestamps, validates all inputs and ownership. History persists in existing Neon database. Never accept client-reported grades or elapsed times. Report lists attempted/unanswered, correct/wrong, point breakdown, elapsed seconds and correct/minute, with per-question explanations. Equal section weighting on earned/available points; label training score and report coverage; no invented official cut-off or percentile.

## UI
Existing indigo/slate palette; calm white cards, navy exam header, cyan/pink memory board. Signature: section time rails beside an actual miniature exam and report preview. Bilingual, keyboard accessible and responsive. Fullscreen is solely our simulation policy, not claimed employer requirement.

## Tests
Pure state transitions, deadlines, grade components, no answer leaks, late/stale submissions, finalization and scoring. Database integration covers ownership and concurrent updates. Browser tests cover guest preview, upsell, training modules and exam navigation using mocked authenticated API responses where necessary.
