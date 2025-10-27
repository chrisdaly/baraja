-- ============================================
-- SAFE Restore - Won't Delete Your Cards!
-- This script only ADDS missing pieces
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check what you currently have
SELECT 'Your current cards' as info, COUNT(*) as count FROM cards;

-- Step 2: Add missing columns to user_card_progress (if they don't exist)
ALTER TABLE user_card_progress
ADD COLUMN IF NOT EXISTS ease_factor DECIMAL DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS interval_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0;

-- Step 3: Create daily_activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  activity_date DATE NOT NULL,
  cards_reviewed INTEGER DEFAULT 0,
  cards_learned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Step 4: Enable RLS if not already enabled
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Step 5: Create missing policies (IF NOT EXISTS is implicit - will skip if exists)
DO $$
BEGIN
  -- Cards policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Allow public read access to cards') THEN
    CREATE POLICY "Allow public read access to cards" ON cards FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Allow public insert to cards') THEN
    CREATE POLICY "Allow public insert to cards" ON cards FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Allow public update to cards') THEN
    CREATE POLICY "Allow public update to cards" ON cards FOR UPDATE TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cards' AND policyname = 'Allow public delete to cards') THEN
    CREATE POLICY "Allow public delete to cards" ON cards FOR DELETE TO public USING (true);
  END IF;

  -- user_card_progress policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_card_progress' AND policyname = 'Allow public select to user_card_progress') THEN
    CREATE POLICY "Allow public select to user_card_progress" ON user_card_progress FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_card_progress' AND policyname = 'Allow public insert to user_card_progress') THEN
    CREATE POLICY "Allow public insert to user_card_progress" ON user_card_progress FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_card_progress' AND policyname = 'Allow public update to user_card_progress') THEN
    CREATE POLICY "Allow public update to user_card_progress" ON user_card_progress FOR UPDATE TO public USING (true);
  END IF;

  -- daily_activities policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_activities' AND policyname = 'Allow public select to daily_activities') THEN
    CREATE POLICY "Allow public select to daily_activities" ON daily_activities FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_activities' AND policyname = 'Allow public insert to daily_activities') THEN
    CREATE POLICY "Allow public insert to daily_activities" ON daily_activities FOR INSERT TO public WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_activities' AND policyname = 'Allow public update to daily_activities') THEN
    CREATE POLICY "Allow public update to daily_activities" ON daily_activities FOR UPDATE TO public USING (true);
  END IF;
END $$;

-- Step 6: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_card_progress_next_review
  ON user_card_progress(next_review);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date
  ON daily_activities(user_id, activity_date);

-- Step 7: Create or replace SRS functions (safe to run multiple times)
CREATE OR REPLACE FUNCTION get_due_cards(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  card_id UUID,
  spanish TEXT,
  english TEXT,
  examples JSONB,
  status TEXT,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE,
  ease_factor DECIMAL,
  interval_days INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.spanish,
    c.english,
    c.examples,
    COALESCE(ucp.status, 'new') as status,
    ucp.last_reviewed,
    ucp.next_review,
    COALESCE(ucp.ease_factor, 2.5) as ease_factor,
    COALESCE(ucp.interval_days, 0) as interval_days
  FROM cards c
  LEFT JOIN user_card_progress ucp
    ON c.id = ucp.card_id
    AND (user_uuid IS NULL OR ucp.user_id = user_uuid)
  WHERE
    ucp.id IS NULL
    OR ucp.next_review IS NULL
    OR ucp.next_review <= NOW()
  ORDER BY
    CASE
      WHEN ucp.next_review IS NOT NULL AND ucp.next_review <= NOW() THEN 1
      WHEN ucp.id IS NULL THEN 2
      ELSE 3
    END,
    ucp.next_review ASC NULLS LAST,
    c.created_at ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_card_review(
  p_card_id UUID,
  p_user_id UUID,
  p_quality INTEGER,
  p_status TEXT DEFAULT 'learning'
)
RETURNS JSONB AS $$
DECLARE
  v_ease_factor DECIMAL;
  v_interval_days INTEGER;
  v_repetitions INTEGER;
  v_next_review TIMESTAMP WITH TIME ZONE;
  v_current_ease DECIMAL;
  v_current_interval INTEGER;
  v_current_reps INTEGER;
BEGIN
  SELECT
    COALESCE(ease_factor, 2.5),
    COALESCE(interval_days, 0),
    COALESCE(repetitions, 0)
  INTO v_current_ease, v_current_interval, v_current_reps
  FROM user_card_progress
  WHERE card_id = p_card_id AND user_id = p_user_id;

  v_current_ease := COALESCE(v_current_ease, 2.5);
  v_current_interval := COALESCE(v_current_interval, 0);
  v_current_reps := COALESCE(v_current_reps, 0);

  IF p_quality < 2 THEN
    v_repetitions := 0;
    v_interval_days := 1;
    v_ease_factor := v_current_ease;
  ELSE
    v_repetitions := v_current_reps + 1;
    v_ease_factor := v_current_ease + (0.1 - (3 - p_quality) * (0.08 + (3 - p_quality) * 0.02));
    IF v_ease_factor < 1.3 THEN
      v_ease_factor := 1.3;
    END IF;

    IF v_repetitions = 1 THEN
      v_interval_days := 1;
    ELSIF v_repetitions = 2 THEN
      v_interval_days := 6;
    ELSE
      v_interval_days := ROUND(v_current_interval * v_ease_factor);
    END IF;

    IF p_quality = 1 THEN
      v_interval_days := GREATEST(1, ROUND(v_interval_days * 0.8));
    ELSIF p_quality = 3 THEN
      v_interval_days := ROUND(v_interval_days * 1.3);
    END IF;
  END IF;

  v_next_review := NOW() + (v_interval_days || ' days')::INTERVAL;

  INSERT INTO user_card_progress (
    user_id,
    card_id,
    status,
    last_reviewed,
    review_count,
    next_review,
    ease_factor,
    interval_days,
    repetitions
  ) VALUES (
    p_user_id,
    p_card_id,
    p_status,
    NOW(),
    1,
    v_next_review,
    v_ease_factor,
    v_interval_days,
    v_repetitions
  )
  ON CONFLICT (user_id, card_id) DO UPDATE SET
    status = p_status,
    last_reviewed = NOW(),
    review_count = user_card_progress.review_count + 1,
    next_review = v_next_review,
    ease_factor = v_ease_factor,
    interval_days = v_interval_days,
    repetitions = v_repetitions;

  RETURN jsonb_build_object(
    'ease_factor', v_ease_factor,
    'interval_days', v_interval_days,
    'next_review', v_next_review,
    'repetitions', v_repetitions
  );
END;
$$ LANGUAGE plpgsql;

-- Step 8: Verify everything works
SELECT '✅ Your Cards (PRESERVED!)' as check, COUNT(*) as count FROM cards;
SELECT '✅ Cards Due for Review' as check, COUNT(*) as count
FROM get_due_cards('00000000-0000-0000-0000-000000000000');

-- Step 9: Show your card list
SELECT spanish, english, created_at
FROM cards
ORDER BY created_at
LIMIT 10;

-- ============================================
-- ✅ Safe Restoration Complete!
-- ============================================
-- Your existing cards are preserved!
-- All missing functions/tables have been added.
-- If you see "0 cards due", run: reset-my-progress.sql
-- ============================================
