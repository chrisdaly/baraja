-- ============================================
-- Verify Supabase Setup After Restore
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check if tables exist
SELECT
  table_name,
  '✅ Table exists' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('cards', 'user_card_progress', 'daily_activities')
ORDER BY table_name;

-- 2. Check if functions exist
SELECT
  routine_name,
  '✅ Function exists' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_due_cards', 'update_card_review')
ORDER BY routine_name;

-- 3. Check card count
SELECT
  COUNT(*) as total_cards,
  CASE
    WHEN COUNT(*) = 0 THEN '⚠️ No cards! You need to add some.'
    ELSE '✅ Cards exist'
  END as status
FROM cards;

-- 4. Check if cards table has data (show first few)
SELECT
  id,
  spanish,
  english,
  created_at
FROM cards
ORDER BY created_at
LIMIT 5;

-- 5. Check user_card_progress count
SELECT
  COUNT(*) as progress_records,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ No progress yet (all cards will be new)'
    ELSE '✅ Has progress records'
  END as status
FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- 6. Test get_due_cards function
SELECT
  COUNT(*) as cards_due,
  CASE
    WHEN COUNT(*) = 0 THEN '⚠️ No cards due (this is why you see "todo hecho")'
    ELSE '✅ Cards are due for review'
  END as status
FROM get_due_cards('00000000-0000-0000-0000-000000000000');

-- 7. Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  '✅ Policy exists' as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('cards', 'user_card_progress')
ORDER BY tablename, policyname;

-- ============================================
-- Summary: What you need to do next
-- ============================================
-- If "cards" table is missing or has 0 rows:
--   → Run: supabase-setup.sql or add-ui-and-basics.sql
--
-- If "get_due_cards" function is missing:
--   → Run: add-srs-system.sql
--
-- If cards exist but none are due:
--   → Run: reset-my-progress.sql (to start fresh)
--   → OR just wait for your scheduled reviews
-- ============================================
