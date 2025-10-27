-- ============================================
-- Diagnose SRS State
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Check total cards
SELECT
  COUNT(*) as total_cards,
  'Total cards in database' as description
FROM cards;

-- 2. Check user progress
SELECT
  COUNT(*) as total_progress_records,
  'Cards you have reviewed' as description
FROM user_card_progress
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- 3. See which cards are due NOW
SELECT
  c.spanish,
  c.english,
  ucp.status,
  ucp.last_reviewed,
  ucp.next_review,
  ucp.interval_days,
  CASE
    WHEN ucp.next_review IS NULL THEN 'Due (no review date)'
    WHEN ucp.next_review <= NOW() THEN 'DUE NOW ✓'
    ELSE 'Not due yet (in ' || EXTRACT(EPOCH FROM (ucp.next_review - NOW()))/3600 || ' hours)'
  END as status_check
FROM cards c
LEFT JOIN user_card_progress ucp
  ON c.id = ucp.card_id
  AND ucp.user_id = '00000000-0000-0000-0000-000000000000'
ORDER BY ucp.next_review ASC NULLS FIRST;

-- 4. Test the get_due_cards function (what the app uses)
SELECT
  COUNT(*) as cards_due_for_review,
  'This is what your app sees' as description
FROM get_due_cards('00000000-0000-0000-0000-000000000000');

-- 5. Show the actual due cards
SELECT * FROM get_due_cards('00000000-0000-0000-0000-000000000000');
