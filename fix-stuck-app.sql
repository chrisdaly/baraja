-- ============================================
-- Complete Fix for Stuck App
-- Run this to reset everything and fix RLS
-- ============================================

-- Step 1: Reset ALL RLS policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_card_progress')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON user_card_progress';
    END LOOP;
END $$;

-- Step 2: Create proper RLS policies
CREATE POLICY "Allow public insert to user_card_progress"
  ON user_card_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to user_card_progress"
  ON user_card_progress FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public select from user_card_progress"
  ON user_card_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public delete from user_card_progress"
  ON user_card_progress FOR DELETE
  TO public
  USING (true);

-- Step 3: Enable RLS
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;

-- Step 4: Reset your progress (optional - uncomment if you want fresh start)
-- DELETE FROM user_card_progress
-- WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Step 5: OR just reset the stuck card (uncomment to use)
DELETE FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000'
AND card_id = (SELECT id FROM cards WHERE spanish = 'es una broma');

-- Step 6: Verify the fix
SELECT
  'Policies created:' as check_type,
  COUNT(*) as count
FROM pg_policies
WHERE tablename = 'user_card_progress'

UNION ALL

SELECT
  'Cards in DB:' as check_type,
  COUNT(*) as count
FROM cards

UNION ALL

SELECT
  'Due cards now:' as check_type,
  COUNT(*) as count
FROM get_due_cards('00000000-0000-0000-0000-000000000000')

UNION ALL

SELECT
  'Your progress records:' as check_type,
  COUNT(*) as count
FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';
