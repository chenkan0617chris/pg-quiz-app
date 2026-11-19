# Paid Mock Exams and Conversion Funnel Design

## Intent

Make timed mock exams a paid-membership feature, remove the 24-hour
full-feature trial, and show the owner a live registration-to-payment funnel
in Admin.

## Goals

- Only a currently paid or lifetime member can create, continue, or answer a
  mock exam. Everyone may see the static exam and report previews.
- New and existing non-paying accounts use the existing lifetime free quotas:
  ten solver uses per solver, ten new questions per practice kind, and ten
  memory rounds. There is no unlimited trial period.
- Admin displays a live, Sydney-date funnel for 1, 7, or 30 days: sign-ups,
  activated users, mock-exam paywall views, checkout starts, and confirmed
  payments, plus a per-day breakdown.
- Track only authenticated internal user IDs and timestamps. Do not put email,
  answers, payment data, or IP/device fingerprints in funnel events.

## Non-goals

- Do not require a payment card or phone number to create a free account.
- Do not try to fingerprint or block devices/IPs.
- Do not alter the existing paid access duration, Stripe fulfilment, or free
  quota counts.

## Why this approach

An email alone cannot prove a person is unique. Removing unlimited trials
means another email can only recover the deliberately small free allowance,
not a complete simulated exam or unlimited product access. Phone verification
is deferred until the funnel shows material repeat-account abuse.

## Approaches considered

1. Keep the 24-hour trial and only make mock exams paid-only. This still
   allows unlimited practice with each new email.
2. **Selected:** remove full trials, retain existing ten-use free quotas, and
   reserve mock exams for paid access.
3. Require a verified phone or payment method for any free trial. This is
   stronger against deliberate abuse but creates substantial signup friction.

## Design

- `hasFullAccess` means paid access only. A migration disables existing trial
  eligibility, preserving account and paid records while removing unlimited
  access.
- The mock-exam API enforces paid access for every action other than reading
  existing reports or finishing an already-started exam. The page mirrors that
  rule and records one paywall view event per session for an authenticated
  non-paying account.
- A server-only conversion-event store records paywall views, successful
  checkout starts, and webhook-confirmed payments.
- Admin aggregates read-only data with Australia/Sydney calendar days.
  Selected-window funnel totals are distinct users; daily rows are activity
  counts and are not presented as acquisition cohorts.

## User-approved decisions

- Simulated mock exams are paid-membership only; trial and free users cannot
  use them.
- The 24-hour full-feature trial is removed.
- Free accounts retain existing ten-use-per-tool/category quotas.
- Admin needs near-real-time 1-, 7-, and 30-day conversion funnel views.
