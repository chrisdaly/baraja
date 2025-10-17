-- ============================================
-- Add UI Phrases + Days + Months + Basic Vocabulary
-- Run this in Supabase SQL Editor
-- ============================================

-- UI PHRASES FROM THE APP
INSERT INTO cards (spanish, english, examples) VALUES
(
  '¡bien hecho!',
  'well done! / good job!',
  '[
    {"spanish": "¡Bien hecho! Lo lograste.", "english": "Well done! You did it."},
    {"spanish": "Has hecho un buen trabajo.", "english": "You did a good job."},
    {"spanish": "¡Bien hecho, campeón!", "english": "Well done, champ!"}
  ]'::jsonb
),
(
  'todavía no',
  'not yet / still not',
  '[
    {"spanish": "¿Ya terminaste? Todavía no.", "english": "Are you done yet? Not yet."},
    {"spanish": "Todavía no lo sé.", "english": "I don''t know yet."},
    {"spanish": "Todavía no estoy listo.", "english": "I''m not ready yet."}
  ]'::jsonb
),
(
  '¡ya está!',
  'that''s it! / done! / all set!',
  '[
    {"spanish": "¡Ya está! Terminamos.", "english": "That''s it! We''re done."},
    {"spanish": "Aprieta aquí y ¡ya está!", "english": "Press here and done!"},
    {"spanish": "¡Ya está todo listo!", "english": "Everything''s all set!"}
  ]'::jsonb
),
(
  '¡felicidades!',
  'congratulations!',
  '[
    {"spanish": "¡Felicidades por tu éxito!", "english": "Congratulations on your success!"},
    {"spanish": "¡Felicidades! Lo conseguiste.", "english": "Congratulations! You did it."},
    {"spanish": "Te mereces las felicidades.", "english": "You deserve congratulations."}
  ]'::jsonb
),
(
  'racha',
  'streak / run',
  '[
    {"spanish": "Tengo una racha de cinco días.", "english": "I have a five-day streak."},
    {"spanish": "¡No pierdas tu racha!", "english": "Don''t lose your streak!"},
    {"spanish": "Está en una buena racha.", "english": "He''s on a good run."}
  ]'::jsonb
),

-- DAYS OF THE WEEK
(
  'lunes',
  'Monday',
  '[
    {"spanish": "El lunes voy al trabajo.", "english": "On Monday I go to work."},
    {"spanish": "Los lunes son difíciles.", "english": "Mondays are hard."},
    {"spanish": "Te veo el lunes.", "english": "See you Monday."}
  ]'::jsonb
),
(
  'martes',
  'Tuesday',
  '[
    {"spanish": "El martes tengo clase.", "english": "On Tuesday I have class."},
    {"spanish": "Los martes practico español.", "english": "On Tuesdays I practice Spanish."},
    {"spanish": "Nos vemos el martes.", "english": "See you Tuesday."}
  ]'::jsonb
),
(
  'miércoles',
  'Wednesday',
  '[
    {"spanish": "El miércoles es mi día favorito.", "english": "Wednesday is my favorite day."},
    {"spanish": "Los miércoles voy al gimnasio.", "english": "On Wednesdays I go to the gym."},
    {"spanish": "¿Qué haces el miércoles?", "english": "What are you doing Wednesday?"}
  ]'::jsonb
),
(
  'jueves',
  'Thursday',
  '[
    {"spanish": "El jueves cenamos juntos.", "english": "On Thursday we have dinner together."},
    {"spanish": "Los jueves trabajo desde casa.", "english": "On Thursdays I work from home."},
    {"spanish": "Te llamo el jueves.", "english": "I''ll call you Thursday."}
  ]'::jsonb
),
(
  'viernes',
  'Friday',
  '[
    {"spanish": "¡Por fin es viernes!", "english": "It''s finally Friday!"},
    {"spanish": "Los viernes salgo con amigos.", "english": "On Fridays I go out with friends."},
    {"spanish": "El viernes es mi día libre.", "english": "Friday is my day off."}
  ]'::jsonb
),
(
  'sábado',
  'Saturday',
  '[
    {"spanish": "El sábado voy de compras.", "english": "On Saturday I go shopping."},
    {"spanish": "Los sábados duermo hasta tarde.", "english": "On Saturdays I sleep in."},
    {"spanish": "¿Qué haces el sábado?", "english": "What are you doing Saturday?"}
  ]'::jsonb
),
(
  'domingo',
  'Sunday',
  '[
    {"spanish": "El domingo descanso.", "english": "On Sunday I rest."},
    {"spanish": "Los domingos veo a mi familia.", "english": "On Sundays I see my family."},
    {"spanish": "El domingo es el último día.", "english": "Sunday is the last day."}
  ]'::jsonb
),

-- MONTHS
(
  'enero',
  'January',
  '[
    {"spanish": "Enero es el primer mes.", "english": "January is the first month."},
    {"spanish": "Nací en enero.", "english": "I was born in January."},
    {"spanish": "En enero hace frío.", "english": "In January it''s cold."}
  ]'::jsonb
),
(
  'febrero',
  'February',
  '[
    {"spanish": "Febrero tiene 28 días.", "english": "February has 28 days."},
    {"spanish": "En febrero celebramos San Valentín.", "english": "In February we celebrate Valentine''s Day."},
    {"spanish": "Febrero es corto.", "english": "February is short."}
  ]'::jsonb
),
(
  'marzo',
  'March',
  '[
    {"spanish": "En marzo llega la primavera.", "english": "In March spring arrives."},
    {"spanish": "Marzo es un mes de transición.", "english": "March is a transition month."},
    {"spanish": "Mi cumpleaños es en marzo.", "english": "My birthday is in March."}
  ]'::jsonb
),
(
  'abril',
  'April',
  '[
    {"spanish": "En abril llueve mucho.", "english": "In April it rains a lot."},
    {"spanish": "Abril es un mes hermoso.", "english": "April is a beautiful month."},
    {"spanish": "Las flores crecen en abril.", "english": "Flowers grow in April."}
  ]'::jsonb
),
(
  'mayo',
  'May',
  '[
    {"spanish": "Mayo es el quinto mes.", "english": "May is the fifth month."},
    {"spanish": "En mayo hace buen tiempo.", "english": "In May the weather is nice."},
    {"spanish": "Me voy de vacaciones en mayo.", "english": "I''m going on vacation in May."}
  ]'::jsonb
),
(
  'junio',
  'June',
  '[
    {"spanish": "Junio es el comienzo del verano.", "english": "June is the beginning of summer."},
    {"spanish": "En junio termina la escuela.", "english": "In June school ends."},
    {"spanish": "Junio es caluroso.", "english": "June is hot."}
  ]'::jsonb
),
(
  'julio',
  'July',
  '[
    {"spanish": "Julio es muy caliente.", "english": "July is very hot."},
    {"spanish": "En julio voy a la playa.", "english": "In July I go to the beach."},
    {"spanish": "Julio tiene 31 días.", "english": "July has 31 days."}
  ]'::jsonb
),
(
  'agosto',
  'August',
  '[
    {"spanish": "Agosto es el mes de vacaciones.", "english": "August is vacation month."},
    {"spanish": "En agosto hace mucho calor.", "english": "In August it''s very hot."},
    {"spanish": "Agosto es el último mes del verano.", "english": "August is the last month of summer."}
  ]'::jsonb
),
(
  'septiembre',
  'September',
  '[
    {"spanish": "En septiembre vuelvo al trabajo.", "english": "In September I go back to work."},
    {"spanish": "Septiembre es el comienzo del otoño.", "english": "September is the beginning of fall."},
    {"spanish": "Las clases empiezan en septiembre.", "english": "Classes start in September."}
  ]'::jsonb
),
(
  'octubre',
  'October',
  '[
    {"spanish": "Octubre es mi mes favorito.", "english": "October is my favorite month."},
    {"spanish": "En octubre celebramos Halloween.", "english": "In October we celebrate Halloween."},
    {"spanish": "Octubre tiene días frescos.", "english": "October has cool days."}
  ]'::jsonb
),
(
  'noviembre',
  'November',
  '[
    {"spanish": "Noviembre es un mes gris.", "english": "November is a gray month."},
    {"spanish": "En noviembre hace frío.", "english": "In November it''s cold."},
    {"spanish": "Noviembre tiene 30 días.", "english": "November has 30 days."}
  ]'::jsonb
),
(
  'diciembre',
  'December',
  '[
    {"spanish": "Diciembre es el último mes del año.", "english": "December is the last month of the year."},
    {"spanish": "En diciembre celebramos Navidad.", "english": "In December we celebrate Christmas."},
    {"spanish": "Diciembre es festivo.", "english": "December is festive."}
  ]'::jsonb
),

-- BASIC NUMBERS
(
  'números básicos',
  'basic numbers (1-10)',
  '[
    {"spanish": "Uno, dos, tres.", "english": "One, two, three."},
    {"spanish": "Tengo cinco manzanas.", "english": "I have five apples."},
    {"spanish": "Cuenta del uno al diez.", "english": "Count from one to ten."}
  ]'::jsonb
),

-- COLORS
(
  'colores básicos',
  'basic colors',
  '[
    {"spanish": "El cielo es azul.", "english": "The sky is blue."},
    {"spanish": "Me gusta el color rojo.", "english": "I like the color red."},
    {"spanish": "¿De qué color es?", "english": "What color is it?"}
  ]'::jsonb
);

-- Verify the new cards were added
SELECT COUNT(*) as total_cards FROM cards;
SELECT spanish FROM cards ORDER BY created_at DESC LIMIT 27;

-- ============================================
-- You should now have 42 cards total!
-- (15 original + 27 new = 42 total)
-- ============================================
