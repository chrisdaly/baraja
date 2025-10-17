-- Remove the foreign key constraint on user_card_progress
-- This allows the app to work without authentication

-- Drop the foreign key constraint
ALTER TABLE user_card_progress
DROP CONSTRAINT IF EXISTS user_card_progress_user_id_fkey;

-- Make user_id nullable (optional, but useful)
ALTER TABLE user_card_progress
ALTER COLUMN user_id DROP NOT NULL;

-- Verify the constraint is gone
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'user_card_progress'
  AND tc.constraint_type = 'FOREIGN KEY';
