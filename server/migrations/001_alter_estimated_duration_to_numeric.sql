-- Migration: Change estimated_duration from INTEGER to NUMERIC
-- This allows decimal values for workout duration (e.g., 7.5 minutes)

-- Alter the column type from INTEGER to NUMERIC(5,2)
-- NUMERIC(5,2) allows up to 999.99 minutes (5 digits total, 2 decimal places)
-- This is sufficient for workout durations (most workouts are under 1000 minutes)
ALTER TABLE workouts 
ALTER COLUMN estimated_duration TYPE NUMERIC(5,2);

-- Add a comment to document the change
COMMENT ON COLUMN workouts.estimated_duration IS 'Estimated workout duration in minutes (supports decimal values)';

