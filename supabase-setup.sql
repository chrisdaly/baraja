-- ============================================
-- Baraja Supabase Database Setup
-- Run this entire file in the Supabase SQL Editor
-- ============================================

-- 1. Create the cards table
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  spanish TEXT NOT NULL,
  english TEXT NOT NULL,
  examples JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user progress tracking table (for future use)
CREATE TABLE user_card_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  card_id UUID REFERENCES cards,
  status TEXT CHECK (status IN ('new', 'learning', 'known')),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  review_count INTEGER DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for public read access on cards
CREATE POLICY "Allow public read access to cards"
  ON cards FOR SELECT
  TO public
  USING (true);

-- 5. Insert initial flashcard data
INSERT INTO cards (spanish, english, examples) VALUES
(
  'es una broma',
  'it''s a joke / it''s a prank',
  '[
    {"spanish": "¿Es una broma?", "english": "Is it a joke?"},
    {"spanish": "No es una broma, es serio.", "english": "It''s not a joke, it''s serious."},
    {"spanish": "Me gusta hacer bromas.", "english": "I like to play pranks."}
  ]'::jsonb
),
(
  '¡qué chulo!',
  'how cool! / awesome!',
  '[
    {"spanish": "¡Qué chulo tu coche!", "english": "Your car is so cool!"},
    {"spanish": "Es un diseño muy chulo.", "english": "It''s a very cool design."},
    {"spanish": "¡Qué chulo está este lugar!", "english": "This place is so cool!"}
  ]'::jsonb
),
(
  'me da igual',
  'I don''t care / it''s all the same to me',
  '[
    {"spanish": "Me da igual lo que pienses.", "english": "I don''t care what you think."},
    {"spanish": "¿Pizza o pasta? Me da igual.", "english": "Pizza or pasta? I don''t care."},
    {"spanish": "A mí me da igual.", "english": "I don''t care."}
  ]'::jsonb
),
(
  'estar de bajón',
  'to feel down / to be depressed',
  '[
    {"spanish": "Hoy estoy de bajón.", "english": "I''m feeling down today."},
    {"spanish": "Está de bajón desde ayer.", "english": "He''s been down since yesterday."},
    {"spanish": "No estés de bajón, todo mejorará.", "english": "Don''t be down, everything will get better."}
  ]'::jsonb
),
(
  '¡ni hablar!',
  'no way! / out of the question!',
  '[
    {"spanish": "¿Puedo ir? ¡Ni hablar!", "english": "Can I go? No way!"},
    {"spanish": "¡Ni hablar de eso!", "english": "Out of the question!"},
    {"spanish": "¿Prestarte dinero? ¡Ni hablar!", "english": "Lend you money? No way!"}
  ]'::jsonb
),
(
  'estar hasta las narices',
  'to be fed up / sick and tired',
  '[
    {"spanish": "Estoy hasta las narices de esto.", "english": "I''m fed up with this."},
    {"spanish": "Estamos hasta las narices del ruido.", "english": "We''re sick of the noise."},
    {"spanish": "¡Ya estoy hasta las narices!", "english": "I''m fed up already!"}
  ]'::jsonb
),
(
  'dar la lata',
  'to be annoying / to pester',
  '[
    {"spanish": "No des la lata.", "english": "Don''t be annoying."},
    {"spanish": "Siempre está dando la lata.", "english": "He''s always pestering."},
    {"spanish": "Deja de dar la lata con eso.", "english": "Stop pestering about that."}
  ]'::jsonb
),
(
  '¡qué guay!',
  'how cool! / awesome!',
  '[
    {"spanish": "¡Qué guay es tu móvil!", "english": "Your phone is so cool!"},
    {"spanish": "¡Qué guay la fiesta!", "english": "The party is awesome!"},
    {"spanish": "Es muy guay.", "english": "It''s very cool."}
  ]'::jsonb
);

-- 6. Verify the data was inserted
SELECT COUNT(*) as total_cards FROM cards;
SELECT spanish, english FROM cards ORDER BY created_at;

-- ============================================
-- Setup Complete!
-- ============================================
-- Next steps:
-- 1. Copy your Project URL and anon key from Settings > API
-- 2. Add them to your .env file:
--    VITE_SUPABASE_URL=your_project_url
--    VITE_SUPABASE_ANON_KEY=your_anon_key
-- 3. Restart your dev server: npm run dev
-- ============================================
