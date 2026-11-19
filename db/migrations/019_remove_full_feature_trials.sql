-- The product no longer grants unlimited trial access. Existing paid records
-- and free usage counters are preserved; only the trial entitlement is ended.
UPDATE user_access SET trial_eligible=false WHERE trial_eligible;
