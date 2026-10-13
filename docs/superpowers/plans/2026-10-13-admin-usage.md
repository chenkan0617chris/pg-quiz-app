# Admin Usage Implementation Plan

**Goal:** Deliver and deploy a protected view of each user's activity and quota use.
**Architecture:** Clerk identity registry, Neon authoritative practice/exam data and additive usage events; server-rendered admin routes.
**Tech Stack:** Installed Next.js 16, React 19, Clerk 7, Neon SQL, Tailwind.
**Spec:** docs/superpowers/specs/2026-10-13-admin-usage-design.md

## Tasks
- [x] Add failing authorization/filter tests and database behavior tests.
- [x] Add additive migration, atomic solver logs, practice credit provenance and client training telemetry.
- [x] Implement server authorization, batch user summaries and paginated/filterable timeline.
- [x] Build Chinese admin list/detail with accessible empty, denied and failure states.
- [x] Run tests, typecheck, lint, build and browser checks; review changed code.
- [ ] Configure confirmed admin identity, migrate, push, deploy and verify production.

## Constraints and review focus
- No new external providers or dependencies; do not touch unrelated draft documents.
- Empty administrator allowlist denies all users; never use browser metadata for authorization.
- Never infer historical usage timestamps or a zero historical credit cost.
- No quota deductions for paid/trial solver events; free deductions and log insert share one SQL statement.
- Query parsing rejects invalid dates/tools; all SQL values are bound parameters.
- Administrator identity can be configured after code validation while waiting for user response.
