-- Quick diagnosis of the stuck card issue
-- Run this in Supabase SQL Editor

-- 1. Show current stuck card status
SELECT
  c.spanish,
  c.english,
  ucp.status,
  ucp.last_reviewed,
  ucp.next_review,
  ucp.interval_days,
  ucp.review_count,
  CASE
    WHEN ucp.next_review IS NULL THEN 'No next review set - PROBLEM!'
    WHEN ucp.next_review <= NOW() THEN 'DUE NOW ✓'
    ELSE 'Not due for ' || ROUND(EXTRACT(EPOCH FROM (ucp.next_review - NOW()))/3600, 1) || ' hours'
  END as review_status
FROM cards c
LEFT JOIN user_card_progress ucp
  ON c.id = ucp.card_id
  AND ucp.user_id = '00000000-0000-0000-0000-000000000000'
WHERE c.spanish = 'es una broma';

-- 2. Show what get_due_cards() returns (what app sees)
SELECT
  spanish,
  english,
  status,
  next_review,
  interval_days
FROM get_due_cards('00000000-0000-0000-0000-000000000000')
LIMIT 5;

-- 3. Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'user_card_progress';
