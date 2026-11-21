-- Client-side funnel steps before checkout: the free-plan upgrade prompt and the
-- billing (price) page. Both are recorded once per person per Sydney day.
ALTER TABLE conversion_events DROP CONSTRAINT IF EXISTS conversion_events_event_check;
-- statement-breakpoint
ALTER TABLE conversion_events ADD CONSTRAINT conversion_events_event_check
 CHECK (event IN ('mock_paywall_viewed','upgrade_prompt_viewed','pricing_viewed','checkout_started','payment_completed'));
