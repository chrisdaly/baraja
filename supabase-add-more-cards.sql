-- ============================================
-- Add 7 More Spanish Flashcards
-- Run this in Supabase SQL Editor to add cards 9-15
-- ============================================

INSERT INTO cards (spanish, english, examples) VALUES
(
  'tener morro',
  'to have nerve / to be cheeky',
  '[
    {"spanish": "¡Qué morro tienes!", "english": "What nerve you have!"},
    {"spanish": "Tiene mucho morro.", "english": "He''s very cheeky."},
    {"spanish": "No tengo morro para pedirlo.", "english": "I don''t have the nerve to ask for it."}
  ]'::jsonb
),
(
  'hacer puente',
  'to take a long weekend',
  '[
    {"spanish": "Voy a hacer puente.", "english": "I''m taking a long weekend."},
    {"spanish": "Hacemos puente este viernes.", "english": "We''re taking Friday off for a long weekend."},
    {"spanish": "¿Haces puente?", "english": "Are you taking a long weekend?"}
  ]'::jsonb
),
(
  'quedarse en blanco',
  'to draw a blank / mind goes blank',
  '[
    {"spanish": "Me quedé en blanco en el examen.", "english": "My mind went blank in the exam."},
    {"spanish": "Se quedó en blanco.", "english": "He drew a blank."},
    {"spanish": "No te quedes en blanco.", "english": "Don''t let your mind go blank."}
  ]'::jsonb
),
(
  'tomar el pelo',
  'to pull someone''s leg / to tease',
  '[
    {"spanish": "¿Me estás tomando el pelo?", "english": "Are you pulling my leg?"},
    {"spanish": "Le gusta tomar el pelo.", "english": "He likes to tease."},
    {"spanish": "No me tomes el pelo.", "english": "Don''t mess with me."}
  ]'::jsonb
),
(
  'hacer la vista gorda',
  'to turn a blind eye / to overlook',
  '[
    {"spanish": "Hizo la vista gorda.", "english": "He turned a blind eye."},
    {"spanish": "No puedo hacer la vista gorda.", "english": "I can''t overlook this."},
    {"spanish": "Siempre hace la vista gorda.", "english": "He always looks the other way."}
  ]'::jsonb
),
(
  'montarse una película',
  'to imagine things / to make up stories',
  '[
    {"spanish": "No te montes una película.", "english": "Don''t imagine things."},
    {"spanish": "Se monta unas películas...", "english": "He makes up such stories..."},
    {"spanish": "Te has montado una película.", "english": "You''re imagining things."}
  ]'::jsonb
),
(
  'ir al grano',
  'to get to the point',
  '[
    {"spanish": "Vamos al grano.", "english": "Let''s get to the point."},
    {"spanish": "Ve al grano.", "english": "Get to the point."},
    {"spanish": "Hay que ir al grano.", "english": "We need to get to the point."}
  ]'::jsonb
);

-- Verify the new cards were added
SELECT COUNT(*) as total_cards FROM cards;
SELECT spanish, english FROM cards ORDER BY created_at DESC LIMIT 7;

-- ============================================
-- You should now have 15 cards total!
-- ============================================
