-- Baraja Flashcard App - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Cards table: stores Spanish flashcards
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spanish TEXT NOT NULL,
  english TEXT NOT NULL,
  examples JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking (optional, for future implementation)
CREATE TABLE IF NOT EXISTS user_card_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  card_id UUID REFERENCES cards ON DELETE CASCADE,
  status TEXT CHECK (status IN ('new', 'learning', 'known')),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_card_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_card_id ON user_card_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_card_progress(next_review);

-- Insert sample cards (optional - remove if using mock data)
INSERT INTO cards (spanish, english, examples) VALUES
  ('es una broma', 'it''s a joke / it''s a prank',
   '["¿Es una broma?", "No es una broma, es serio.", "Me gusta hacer bromas."]'::jsonb),

  ('¡qué chulo!', 'how cool! / awesome!',
   '["¡Qué chulo tu coche!", "Es un diseño muy chulo.", "¡Qué chulo está este lugar!"]'::jsonb),

  ('me da igual', 'I don''t care / it''s all the same to me',
   '["Me da igual lo que pienses.", "¿Pizza o pasta? Me da igual.", "A mí me da igual."]'::jsonb),

  ('estar de bajón', 'to feel down / to be depressed',
   '["Hoy estoy de bajón.", "Está de bajón desde ayer.", "No estés de bajón, todo mejorará."]'::jsonb),

  ('¡ni hablar!', 'no way! / out of the question!',
   '["¿Puedo ir? ¡Ni hablar!", "¡Ni hablar de eso!", "¿Prestarte dinero? ¡Ni hablar!"]'::jsonb),

  ('estar hasta las narices', 'to be fed up / sick and tired',
   '["Estoy hasta las narices de esto.", "Estamos hasta las narices del ruido.", "¡Ya estoy hasta las narices!"]'::jsonb),

  ('dar la lata', 'to be annoying / to pester',
   '["No des la lata.", "Siempre está dando la lata.", "Deja de dar la lata con eso."]'::jsonb),

  ('¡qué guay!', 'how cool! / awesome!',
   '["¡Qué guay es tu móvil!", "¡Qué guay la fiesta!", "Es muy guay."]'::jsonb)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access to cards (anyone can view flashcards)
CREATE POLICY "Allow public read access to cards"
  ON cards FOR SELECT
  USING (true);

-- Policies: Only authenticated users can add cards
CREATE POLICY "Authenticated users can insert cards"
  ON cards FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policies: Users can only see their own progress
CREATE POLICY "Users can view their own progress"
  ON user_card_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_card_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_card_progress FOR UPDATE
  USING (auth.uid() = user_id);
