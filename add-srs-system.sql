-- ============================================
-- SRS (Spaced Repetition System) Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Update user_card_progress table with SRS fields
ALTER TABLE user_card_progress
ADD COLUMN IF NOT EXISTS ease_factor DECIMAL DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS interval_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_card_progress_next_review
ON user_card_progress(next_review);

-- Create function to get cards due for review
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
    -- New cards
    ucp.id IS NULL
    -- Or cards due for review
    OR ucp.next_review IS NULL
    OR ucp.next_review <= NOW()
  ORDER BY
    -- Prioritize: due reviews > new cards
    CASE
      WHEN ucp.next_review IS NOT NULL AND ucp.next_review <= NOW() THEN 1
      WHEN ucp.id IS NULL THEN 2
      ELSE 3
    END,
    -- Then by how overdue they are
    ucp.next_review ASC NULLS LAST,
    -- Then by card creation date
    c.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to update card after review
CREATE OR REPLACE FUNCTION update_card_review(
  p_card_id UUID,
  p_user_id UUID,
  p_quality INTEGER, -- 0=again, 1=hard, 2=good, 3=easy
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
  -- Get current values or defaults
  SELECT
    COALESCE(ease_factor, 2.5),
    COALESCE(interval_days, 0),
    COALESCE(repetitions, 0)
  INTO v_current_ease, v_current_interval, v_current_reps
  FROM user_card_progress
  WHERE card_id = p_card_id AND user_id = p_user_id;

  -- If no record exists, use defaults
  v_current_ease := COALESCE(v_current_ease, 2.5);
  v_current_interval := COALESCE(v_current_interval, 0);
  v_current_reps := COALESCE(v_current_reps, 0);

  -- SM2 Algorithm
  IF p_quality < 2 THEN
    -- Failed: reset interval and repetitions
    v_repetitions := 0;
    v_interval_days := 1;
    v_ease_factor := v_current_ease;
  ELSE
    -- Passed: increase interval
    v_repetitions := v_current_reps + 1;

    -- Calculate new ease factor
    v_ease_factor := v_current_ease + (0.1 - (3 - p_quality) * (0.08 + (3 - p_quality) * 0.02));
    IF v_ease_factor < 1.3 THEN
      v_ease_factor := 1.3;
    END IF;

    -- Calculate new interval
    IF v_repetitions = 1 THEN
      v_interval_days := 1;
    ELSIF v_repetitions = 2 THEN
      v_interval_days := 6;
    ELSE
      v_interval_days := ROUND(v_current_interval * v_ease_factor);
    END IF;

    -- Adjust based on quality
    IF p_quality = 1 THEN -- Hard
      v_interval_days := GREATEST(1, ROUND(v_interval_days * 0.8));
    ELSIF p_quality = 3 THEN -- Easy
      v_interval_days := ROUND(v_interval_days * 1.3);
    END IF;
  END IF;

  -- Calculate next review date
  v_next_review := NOW() + (v_interval_days || ' days')::INTERVAL;

  -- Insert or update progress
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

  -- Return the results
  RETURN jsonb_build_object(
    'ease_factor', v_ease_factor,
    'interval_days', v_interval_days,
    'next_review', v_next_review,
    'repetitions', v_repetitions
  );
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies for the new functions
DROP POLICY IF EXISTS "Allow public write access to user_card_progress" ON user_card_progress;
DROP POLICY IF EXISTS "Allow public update access to user_card_progress" ON user_card_progress;

CREATE POLICY "Allow public insert to user_card_progress"
  ON user_card_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to user_card_progress"
  ON user_card_progress FOR UPDATE
  TO public
  USING (true);

-- ============================================
-- SRS System Ready!
-- ============================================
-- Quality ratings:
-- 0 = Again (forgot completely)
-- 1 = Hard (remembered with difficulty)
-- 2 = Good (remembered with some effort)
-- 3 = Easy (remembered easily)
-- ============================================
