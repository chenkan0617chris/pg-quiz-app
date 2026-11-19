-- The product no longer grants unlimited trial access. Existing paid records
-- and free usage counters are preserved while only the trial entitlement ends.
UPDATE user_access SET trial_eligible=false WHERE trial_eligible;
