-- Migration: Add 'interest' column to leads table
-- This allows the database schema to match the frontend/API contract
-- Run this on production database if you want to rename 'company' to 'interest'

-- Option 1: Rename 'company' to 'interest' (recommended)
ALTER TABLE leads RENAME COLUMN company TO interest;

-- Option 2: Add 'interest' column and keep 'company' (if you need both)
-- ALTER TABLE leads ADD COLUMN IF NOT EXISTS interest VARCHAR(100);

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' 
ORDER BY ordinal_position;
