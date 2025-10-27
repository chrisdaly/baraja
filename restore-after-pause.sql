-- ============================================
-- Restore Baraja After Supabase Pause
-- Run this ENTIRE file in Supabase SQL Editor
-- This will set up everything from scratch
-- ============================================

-- Step 1: Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS user_card_progress CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

-- Step 2: Drop existing functions
DROP FUNCTION IF EXISTS get_due_cards(UUID);
DROP FUNCTION IF EXISTS update_card_review(UUID, UUID, INTEGER, TEXT);

-- Step 3: Create tables
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spanish TEXT NOT NULL,
  english TEXT NOT NULL,
  examples JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_card_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK constraint for mock user
  card_id UUID REFERENCES cards ON DELETE CASCADE,
  status TEXT CHECK (status IN ('new', 'learning', 'known')),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE,
  ease_factor DECIMAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

CREATE TABLE daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- Removed FK constraint for mock user
  activity_date DATE NOT NULL,
  cards_reviewed INTEGER DEFAULT 0,
  cards_learned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Step 4: Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies (public access for demo)
CREATE POLICY "Allow public read access to cards"
  ON cards FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to cards"
  ON cards FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update to cards"
  ON cards FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public delete to cards"
  ON cards FOR DELETE TO public USING (true);

CREATE POLICY "Allow public select to user_card_progress"
  ON user_card_progress FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to user_card_progress"
  ON user_card_progress FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update to user_card_progress"
  ON user_card_progress FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public select to daily_activities"
  ON daily_activities FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to daily_activities"
  ON daily_activities FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update to daily_activities"
  ON daily_activities FOR UPDATE TO public USING (true);

-- Step 6: Create indexes
CREATE INDEX IF NOT EXISTS idx_user_card_progress_next_review
  ON user_card_progress(next_review);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date
  ON daily_activities(user_id, activity_date);

-- Step 7: Create SRS functions
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

-- Step 8: Insert sample cards
INSERT INTO cards (spanish, english, examples) VALUES
('es una broma', 'it''s a joke / it''s a prank',
  '[{"spanish": "¿Es una broma?", "english": "Is it a joke?"}, {"spanish": "No es una broma, es serio.", "english": "It''s not a joke, it''s serious."}]'::jsonb),
('¡qué chulo!', 'how cool! / awesome!',
  '[{"spanish": "¡Qué chulo tu coche!", "english": "Your car is so cool!"}, {"spanish": "Es un diseño muy chulo.", "english": "It''s a very cool design."}]'::jsonb),
('me da igual', 'I don''t care / it''s all the same to me',
  '[{"spanish": "Me da igual lo que pienses.", "english": "I don''t care what you think."}, {"spanish": "¿Pizza o pasta? Me da igual.", "english": "Pizza or pasta? I don''t care."}]'::jsonb),
('estar de bajón', 'to feel down / to be depressed',
  '[{"spanish": "Hoy estoy de bajón.", "english": "I''m feeling down today."}, {"spanish": "Está de bajón desde ayer.", "english": "He''s been down since yesterday."}]'::jsonb),
('¡ni hablar!', 'no way! / out of the question!',
  '[{"spanish": "¿Puedo ir? ¡Ni hablar!", "english": "Can I go? No way!"}, {"spanish": "¡Ni hablar de eso!", "english": "Out of the question!"}]'::jsonb),
('estar hasta las narices', 'to be fed up / sick and tired',
  '[{"spanish": "Estoy hasta las narices de esto.", "english": "I''m fed up with this."}, {"spanish": "Estamos hasta las narices del ruido.", "english": "We''re sick of the noise."}]'::jsonb),
('dar la lata', 'to be annoying / to pester',
  '[{"spanish": "No des la lata.", "english": "Don''t be annoying."}, {"spanish": "Siempre está dando la lata.", "english": "He''s always pestering."}]'::jsonb),
('¡qué guay!', 'how cool! / awesome!',
  '[{"spanish": "¡Qué guay es tu móvil!", "english": "Your phone is so cool!"}, {"spanish": "¡Qué guay la fiesta!", "english": "The party is awesome!"}]'::jsonb);

-- Step 9: Verify everything
SELECT 'Tables Created' as step, COUNT(*) as tables_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('cards', 'user_card_progress', 'daily_activities');

SELECT 'Functions Created' as step, COUNT(*) as functions_count
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_due_cards', 'update_card_review');

SELECT 'Sample Cards Inserted' as step, COUNT(*) as card_count
FROM cards;

SELECT 'Cards Due for Review' as step, COUNT(*) as due_count
FROM get_due_cards('00000000-0000-0000-0000-000000000000');

-- ============================================
-- ✅ Restoration Complete!
-- ============================================
-- All 8 cards should now be available as "new" cards
-- Refresh your app and you should see cards!
-- ============================================
