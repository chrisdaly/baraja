// All Spanish UI copy from Baraja app as flashcard data
// This can be imported into the database or used for learning

export const uiSpanishCards = [
  // App.jsx
  { spanish: 'cargando', english: 'loading', examples: ['Cargando...', 'Está cargando.', 'Espera, cargando.'] },
  { spanish: 'preparando', english: 'preparing', examples: ['Preparando tus tarjetas', 'Estoy preparando.', 'Preparando la cena'] },
  { spanish: 'tarjetas', english: 'cards', examples: ['no hay tarjetas', 'mis tarjetas', 'ver tarjetas'] },
  { spanish: 'haz clic', english: 'click', examples: ['haz clic aquí', 'haz clic en el botón', '¿Haces clic?'] },
  { spanish: 'agregar', english: 'to add', examples: ['agregar tarjetas', 'voy a agregar', '¿Puedes agregar?'] },
  { spanish: 'crear', english: 'to create', examples: ['crear tus primeras tarjetas', 'voy a crear', 'crear algo nuevo'] },
  { spanish: 'practicar', english: 'to practice', examples: ['empezar a practicar', 'necesito practicar', 'vamos a practicar'] },
  { spanish: '¡todo hecho!', english: 'all done!', examples: ['¡Ya todo hecho!', '¡Todo hecho por hoy!', '¿Todo hecho?'] },
  { spanish: 'repasar', english: 'to review/revise', examples: ['no hay tarjetas para repasar', 'voy a repasar', 'necesito repasar'] },
  { spanish: 'ahora', english: 'now', examples: ['ahora mismo', 'hazlo ahora', '¿Qué haces ahora?'] },
  { spanish: 'recargar', english: 'to reload/recharge', examples: ['recargar tarjetas', 'voy a recargar', 'recargar el teléfono'] },
  { spanish: 'ver', english: 'to see/view', examples: ['ver todas las tarjetas', 'quiero ver', '¿Puedes ver?'] },
  { spanish: 'volver', english: 'to return/go back', examples: ['volver a inicio', 'voy a volver', 'volver mañana'] },
  { spanish: 'inicio', english: 'home/start', examples: ['volver a inicio', 'página de inicio', 'al inicio'] },
  { spanish: 'otra vez', english: 'again', examples: ['otra vez más', 'hazlo otra vez', '¿Otra vez?'] },
  { spanish: 'difícil', english: 'difficult/hard', examples: ['es difícil', 'muy difícil', '¿Es difícil?'] },
  { spanish: 'bien', english: 'good/well', examples: ['muy bien', 'está bien', '¿Estás bien?'] },
  { spanish: 'fácil', english: 'easy', examples: ['es fácil', 'muy fácil', '¿Es fácil?'] },

  // CardsManagePage.jsx
  { spanish: 'editar', english: 'to edit', examples: ['editar tarjeta', 'voy a editar', '¿Puedes editar?'] },
  { spanish: 'cancelar', english: 'to cancel', examples: ['cancelar la orden', 'voy a cancelar', '¿Quieres cancelar?'] },

  // CardsPage.jsx
  { spanish: 'mis', english: 'my (plural)', examples: ['mis tarjetas', 'mis amigos', 'mis libros'] },
  { spanish: 'en total', english: 'in total', examples: ['10 en total', 'cuántos en total', 'en total son 5'] },
  { spanish: 'buscar', english: 'to search/look for', examples: ['buscar tarjetas', 'estoy buscando', '¿Qué buscas?'] },
  { spanish: 'más reciente', english: 'most recent/newest', examples: ['la más reciente', 'noticias más recientes', 'lo más reciente'] },
  { spanish: 'más antigua', english: 'oldest', examples: ['la más antigua', 'la casa más antigua', 'ciudad más antigua'] },
  { spanish: 'no se encontraron', english: "weren't found", examples: ['no se encontraron tarjetas', 'no se encontraron resultados', 'no se encontraron errores'] },
  { spanish: 'todavía', english: 'still/yet', examples: ['no hay tarjetas todavía', 'todavía no', '¿Todavía estás aquí?'] },
  { spanish: 'español', english: 'Spanish', examples: ['hablo español', 'en español', 'clase de español'] },
  { spanish: 'inglés', english: 'English', examples: ['hablo inglés', 'en inglés', 'clase de inglés'] },
  { spanish: 'creado', english: 'created', examples: ['creado ayer', 'fue creado', '¿Cuándo fue creado?'] },
  { spanish: 'acciones', english: 'actions', examples: ['menú de acciones', 'tus acciones', 'acciones disponibles'] },
  { spanish: 'eliminar', english: 'to delete/remove', examples: ['eliminar tarjeta', 'voy a eliminar', '¿Puedes eliminar?'] },
  { spanish: 'mostrando', english: 'showing', examples: ['mostrando resultados', 'estoy mostrando', 'mostrando 10 de 20'] },
  { spanish: 'filtrado', english: 'filtered', examples: ['filtrado de 100 total', 'ya filtrado', 'resultado filtrado'] },

  // AdminPage.jsx
  { spanish: 'manual', english: 'manual', examples: ['modo manual', 'hazlo manual', '¿Es manual?'] },
  { spanish: 'con ia', english: 'with AI', examples: ['crear con ia', 'traducir con ia', 'ayuda con ia'] },
  { spanish: 'ejemplos', english: 'examples', examples: ['tres ejemplos', 'ver ejemplos', '¿Tienes ejemplos?'] },
  { spanish: 'ejemplo', english: 'example', examples: ['por ejemplo', 'un ejemplo', '¿Qué ejemplo?'] },
  { spanish: 'guardando', english: 'saving', examples: ['guardando datos', 'está guardando', 'guardando cambios'] },
  { spanish: 'actualizar', english: 'to update', examples: ['actualizar tarjeta', 'voy a actualizar', 'actualizar app'] },
  { spanish: 'pega', english: 'paste/stick', examples: ['pega texto', 'pega aquí', '¿Pegas algo?'] },
  { spanish: 'texto', english: 'text', examples: ['pega texto', 'lee el texto', 'mensaje de texto'] },
  { spanish: 'artículo', english: 'article', examples: ['un artículo', 'leer artículo', 'escribir artículo'] },
  { spanish: 'conversación', english: 'conversation', examples: ['una conversación', 'tener conversación', 'conversación larga'] },
  { spanish: 'extraer', english: 'to extract', examples: ['extraer tarjetas', 'voy a extraer', 'extraer información'] },
  { spanish: 'empezar de nuevo', english: 'to start over', examples: ['empezar de nuevo', 'vamos a empezar de nuevo', '¿Empezar de nuevo?'] },
  { spanish: 'guardar', english: 'to save', examples: ['guardar cambios', 'voy a guardar', '¿Quieres guardar?'] },

  // HomeScreen.jsx
  { spanish: '¡hola!', english: 'hello!', examples: ['¡Hola amigo!', '¡Hola, cómo estás?', '¡Hola a todos!'] },
  { spanish: 'bienvenido', english: 'welcome', examples: ['bienvenido a casa', '¡Bienvenido!', 'eres bienvenido'] },
  { spanish: 'empezar', english: 'to start/begin', examples: ['empezar a practicar', 'voy a empezar', '¿Cuándo empezamos?'] },
  { spanish: 'hoy', english: 'today', examples: ['hoy es lunes', '¿Qué haces hoy?', 'hoy no'] },
  { spanish: 'racha', english: 'streak/run', examples: ['una racha de 10 días', 'buena racha', '¿Cuál es tu racha?'] },
  { spanish: 'total', english: 'total', examples: ['en total', 'total de 100', '¿Cuál es el total?'] },
  { spanish: 'días', english: 'days', examples: ['tres días', 'todos los días', '¿Cuántos días?'] },
  { spanish: 'completados', english: 'completed', examples: ['días completados', 'tareas completadas', 'ya completados'] },
  { spanish: 'sin hacer', english: 'not done/undone', examples: ['sin hacer todavía', 'está sin hacer', 'sin hacer nada'] },
  { spanish: 'completado', english: 'completed/finished', examples: ['ya completado', '¿Está completado?', 'todo completado'] },

  // NavigationBar.jsx
  { spanish: 'inicio', english: 'home', examples: ['ir a inicio', 'página de inicio', '¿Volver a inicio?'] },

  // DailyGoalModal.jsx
  { spanish: 'meta', english: 'goal', examples: ['meta alcanzada', 'mi meta', '¿Cuál es tu meta?'] },
  { spanish: 'alcanzada', english: 'reached/achieved', examples: ['meta alcanzada', 'ya alcanzada', '¿Alcanzada?'] },
  { spanish: '¡felicitaciones!', english: 'congratulations!', examples: ['¡Felicitaciones por todo!', '¡Felicitaciones amigo!', '¡Felicitaciones!'] },
  { spanish: 'has completado', english: 'you have completed', examples: ['has completado la meta', '¿Has completado?', 'has completado todo'] },
  { spanish: 'tu meta diaria', english: 'your daily goal', examples: ['alcanzar tu meta diaria', '¿Cuál es tu meta diaria?', 'tu meta diaria es 10'] },
  { spanish: 'seguir', english: 'to continue/follow', examples: ['seguir practicando', 'voy a seguir', '¿Seguimos?'] },

  // StatsBar.jsx & ProgressBar.jsx
  { spanish: 'tu progreso', english: 'your progress', examples: ['tu progreso hoy', 'ver tu progreso', '¿Cuál es tu progreso?'] },
  { spanish: 'progreso', english: 'progress', examples: ['buen progreso', 'ver progreso', '¿Hay progreso?'] },

  // Error/Success Messages
  { spanish: 'error al guardar', english: 'error saving', examples: ['error al guardar', 'error al cargar', 'error al enviar'] },
  { spanish: 'por favor ingresa', english: 'please enter', examples: ['por favor ingresa texto', 'por favor ingresa aquí', 'por favor ingresa datos'] },
  { spanish: '¡revisa cada una!', english: 'review each one!', examples: ['revisa cada tarjeta', 'revisa cada día', '¿Revisa cada uno?'] },
  { spanish: 'error al extraer', english: 'error extracting', examples: ['error al extraer tarjetas', 'error al extraer datos', 'error al extraer'] },

  // RecognitionFeedback.jsx
  { spanish: '¡excelente!', english: 'excellent!', examples: ['¡Excelente trabajo!', '¡Excelente idea!', '¡Excelente!'] },
  { spanish: '¡buen intento!', english: 'good try!', examples: ['¡Buen intento amigo!', '¡Buen intento!', 'buen intento pero no'] },
  { spanish: 'escuché', english: 'I heard', examples: ['Escuché algo', '¿Qué escuché?', 'Escuché música'] },

  // Additional useful phrases
  { spanish: 'todas', english: 'all (feminine plural)', examples: ['todas las tarjetas', 'todas juntas', '¿Todas listas?'] },
  { spanish: 'primeras', english: 'first (feminine plural)', examples: ['tus primeras tarjetas', 'las primeras veces', 'primeras impresiones'] },
  { spanish: 'primero', english: 'first', examples: ['primero esto', 'el primero', '¿Quién es primero?'] },
  { spanish: 'más tarde', english: 'later', examples: ['vuelve más tarde', 'hasta más tarde', '¿Más tarde?'] },
  { spanish: 'desde', english: 'from/since', examples: ['desde el menú', 'desde ayer', '¿Desde cuándo?'] },
  { spanish: 'menú', english: 'menu', examples: ['desde el menú', 'ver menú', 'menú principal'] },
];

console.log(`Total UI Spanish phrases: ${uiSpanishCards.length}`);
