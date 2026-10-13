# User activity administration

Approved scope: Chinese /admin, searchable Clerk users (including unused accounts), user detail with activity timeline, date/tool filters, and lifetime free quotas alongside paid/trial status. User requested implementation, tests, push and deployment on 2026-10-13.

Reuse Clerk and Neon. Server-only ADMIN_USER_IDS allowlist denies access by default; every data entry point checks authorization before reading another user's data. Admin content is dynamic and noindex. No user or entitlement mutations from the admin UI.

Reuse practice_attempts and mock_exams timestamps rather than duplicate historical events. Add usage_events for successful solver responses and client-reported grid/PEAK start/completion events, without questions or personal responses. Free solver charging and event insert must be atomic; paid solves record zero free credits. Practice starts record the actual free-credit cost; old practice records retain null (unknown). Historical solver timestamps and paid usage are unavailable; clearly distinguish this from zero usage.

User list is paginated through Clerk, with batch SQL summaries. Detail timeline has bounded pagination, stable ordering, tool/date filters using explicitly labeled UTC dates, and timestamp display in Australia/Sydney. Client-only events are labeled, authenticated, rate limited, and deduplicated; they are not authoritative scoring records.

Validation: deny-by-default access, malformed filters, quota atomicity, paid event recording, historical union and pagination, client event deduplication, typecheck/lint/build, existing unit suite, browser smoke test, production unauthorized checks. Apply additive migration before deploying. Configure administrator from the user's confirmed identity only.
