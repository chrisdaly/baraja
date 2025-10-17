// Mock flashcard data for development without Supabase
export const mockFlashcards = [
  {
    id: '1',
    spanish: 'es una broma',
    english: "it's a joke / it's a prank",
    examples: [
      { spanish: '¿Es una broma?', english: 'Is it a joke?' },
      { spanish: 'No es una broma, es serio.', english: "It's not a joke, it's serious." },
      { spanish: 'Me gusta hacer bromas.', english: 'I like to play pranks.' },
    ],
  },
  {
    id: '2',
    spanish: '¡qué chulo!',
    english: 'how cool! / awesome!',
    examples: [
      { spanish: '¡Qué chulo tu coche!', english: 'Your car is so cool!' },
      { spanish: 'Es un diseño muy chulo.', english: "It's a very cool design." },
      { spanish: '¡Qué chulo está este lugar!', english: 'This place is so cool!' },
    ],
  },
  {
    id: '3',
    spanish: 'me da igual',
    english: "I don't care / it's all the same to me",
    examples: [
      { spanish: 'Me da igual lo que pienses.', english: "I don't care what you think." },
      { spanish: '¿Pizza o pasta? Me da igual.', english: "Pizza or pasta? I don't care." },
      { spanish: 'A mí me da igual.', english: "I don't care." },
    ],
  },
  {
    id: '4',
    spanish: 'estar de bajón',
    english: 'to feel down / to be depressed',
    examples: [
      { spanish: 'Hoy estoy de bajón.', english: "I'm feeling down today." },
      { spanish: 'Está de bajón desde ayer.', english: "He's been down since yesterday." },
      { spanish: 'No estés de bajón, todo mejorará.', english: "Don't be down, everything will get better." },
    ],
  },
  {
    id: '5',
    spanish: '¡ni hablar!',
    english: 'no way! / out of the question!',
    examples: [
      { spanish: '¿Puedo ir? ¡Ni hablar!', english: 'Can I go? No way!' },
      { spanish: '¡Ni hablar de eso!', english: 'Out of the question!' },
      { spanish: '¿Prestarte dinero? ¡Ni hablar!', english: 'Lend you money? No way!' },
    ],
  },
  {
    id: '6',
    spanish: 'estar hasta las narices',
    english: 'to be fed up / sick and tired',
    examples: [
      { spanish: 'Estoy hasta las narices de esto.', english: "I'm fed up with this." },
      { spanish: 'Estamos hasta las narices del ruido.', english: "We're sick of the noise." },
      { spanish: '¡Ya estoy hasta las narices!', english: "I'm fed up already!" },
    ],
  },
  {
    id: '7',
    spanish: 'dar la lata',
    english: 'to be annoying / to pester',
    examples: [
      { spanish: 'No des la lata.', english: "Don't be annoying." },
      { spanish: 'Siempre está dando la lata.', english: "He's always pestering." },
      { spanish: 'Deja de dar la lata con eso.', english: 'Stop pestering about that.' },
    ],
  },
  {
    id: '8',
    spanish: '¡qué guay!',
    english: 'how cool! / awesome!',
    examples: [
      { spanish: '¡Qué guay es tu móvil!', english: 'Your phone is so cool!' },
      { spanish: '¡Qué guay la fiesta!', english: 'The party is awesome!' },
      { spanish: 'Es muy guay.', english: "It's very cool." },
    ],
  },
  {
    id: '9',
    spanish: 'tener morro',
    english: 'to have nerve / to be cheeky',
    examples: [
      { spanish: '¡Qué morro tienes!', english: 'What nerve you have!' },
      { spanish: 'Tiene mucho morro.', english: "He's very cheeky." },
      { spanish: 'No tengo morro para pedirlo.', english: "I don't have the nerve to ask for it." },
    ],
  },
  {
    id: '10',
    spanish: 'hacer puente',
    english: 'to take a long weekend',
    examples: [
      { spanish: 'Voy a hacer puente.', english: "I'm taking a long weekend." },
      { spanish: 'Hacemos puente este viernes.', english: "We're taking Friday off for a long weekend." },
      { spanish: '¿Haces puente?', english: 'Are you taking a long weekend?' },
    ],
  },
  {
    id: '11',
    spanish: 'quedarse en blanco',
    english: 'to draw a blank / mind goes blank',
    examples: [
      { spanish: 'Me quedé en blanco en el examen.', english: 'My mind went blank in the exam.' },
      { spanish: 'Se quedó en blanco.', english: 'He drew a blank.' },
      { spanish: 'No te quedes en blanco.', english: "Don't let your mind go blank." },
    ],
  },
  {
    id: '12',
    spanish: 'tomar el pelo',
    english: 'to pull someone\'s leg / to tease',
    examples: [
      { spanish: '¿Me estás tomando el pelo?', english: 'Are you pulling my leg?' },
      { spanish: 'Le gusta tomar el pelo.', english: 'He likes to tease.' },
      { spanish: 'No me tomes el pelo.', english: "Don't mess with me." },
    ],
  },
  {
    id: '13',
    spanish: 'hacer la vista gorda',
    english: 'to turn a blind eye / to overlook',
    examples: [
      { spanish: 'Hizo la vista gorda.', english: 'He turned a blind eye.' },
      { spanish: 'No puedo hacer la vista gorda.', english: "I can't overlook this." },
      { spanish: 'Siempre hace la vista gorda.', english: 'He always looks the other way.' },
    ],
  },
  {
    id: '14',
    spanish: 'montarse una película',
    english: 'to imagine things / to make up stories',
    examples: [
      { spanish: 'No te montes una película.', english: "Don't imagine things." },
      { spanish: 'Se monta unas películas...', english: 'He makes up such stories...' },
      { spanish: 'Te has montado una película.', english: "You're imagining things." },
    ],
  },
  {
    id: '15',
    spanish: 'ir al grano',
    english: 'to get to the point',
    examples: [
      { spanish: 'Vamos al grano.', english: "Let's get to the point." },
      { spanish: 'Ve al grano.', english: 'Get to the point.' },
      { spanish: 'Hay que ir al grano.', english: 'We need to get to the point.' },
    ],
  },
  // UI PHRASES
  {
    id: '16',
    spanish: '¡bien hecho!',
    english: 'well done! / good job!',
    examples: [
      { spanish: '¡Bien hecho! Lo lograste.', english: 'Well done! You did it.' },
      { spanish: 'Has hecho un buen trabajo.', english: 'You did a good job.' },
      { spanish: '¡Bien hecho, campeón!', english: 'Well done, champ!' },
    ],
  },
  {
    id: '17',
    spanish: 'todavía no',
    english: 'not yet / still not',
    examples: [
      { spanish: '¿Ya terminaste? Todavía no.', english: 'Are you done yet? Not yet.' },
      { spanish: 'Todavía no lo sé.', english: "I don't know yet." },
      { spanish: 'Todavía no estoy listo.', english: "I'm not ready yet." },
    ],
  },
  {
    id: '18',
    spanish: '¡ya está!',
    english: "that's it! / done! / all set!",
    examples: [
      { spanish: '¡Ya está! Terminamos.', english: "That's it! We're done." },
      { spanish: 'Aprieta aquí y ¡ya está!', english: 'Press here and done!' },
      { spanish: '¡Ya está todo listo!', english: "Everything's all set!" },
    ],
  },
  {
    id: '19',
    spanish: 'racha',
    english: 'streak / run',
    examples: [
      { spanish: 'Tengo una racha de cinco días.', english: 'I have a five-day streak.' },
      { spanish: '¡No pierdas tu racha!', english: "Don't lose your streak!" },
      { spanish: 'Está en una buena racha.', english: "He's on a good run." },
    ],
  },
  // DAYS OF THE WEEK
  {
    id: '20',
    spanish: 'lunes',
    english: 'Monday',
    examples: [
      { spanish: 'El lunes voy al trabajo.', english: 'On Monday I go to work.' },
      { spanish: 'Los lunes son difíciles.', english: 'Mondays are hard.' },
      { spanish: 'Te veo el lunes.', english: 'See you Monday.' },
    ],
  },
  {
    id: '21',
    spanish: 'viernes',
    english: 'Friday',
    examples: [
      { spanish: '¡Por fin es viernes!', english: "It's finally Friday!" },
      { spanish: 'Los viernes salgo con amigos.', english: 'On Fridays I go out with friends.' },
      { spanish: 'El viernes es mi día libre.', english: 'Friday is my day off.' },
    ],
  },
  // MONTHS
  {
    id: '22',
    spanish: 'enero',
    english: 'January',
    examples: [
      { spanish: 'Enero es el primer mes.', english: 'January is the first month.' },
      { spanish: 'Nací en enero.', english: 'I was born in January.' },
      { spanish: 'En enero hace frío.', english: "In January it's cold." },
    ],
  },
  {
    id: '23',
    spanish: 'julio',
    english: 'July',
    examples: [
      { spanish: 'Julio es muy caliente.', english: 'July is very hot.' },
      { spanish: 'En julio voy a la playa.', english: 'In July I go to the beach.' },
      { spanish: 'Julio tiene 31 días.', english: 'July has 31 days.' },
    ],
  },
  {
    id: '24',
    spanish: 'octubre',
    english: 'October',
    examples: [
      { spanish: 'Octubre es mi mes favorito.', english: 'October is my favorite month.' },
      { spanish: 'En octubre celebramos Halloween.', english: 'In October we celebrate Halloween.' },
      { spanish: 'Octubre tiene días frescos.', english: 'October has cool days.' },
    ],
  },
  // TIKTOK PHRASES
  {
    id: '25',
    spanish: 'paz y tranquilidad',
    english: 'peace and quiet / peace and tranquility',
    examples: [
      { spanish: 'Solo quiero paz y tranquilidad.', english: 'I just want peace and quiet.' },
      { spanish: 'Necesito un poco de paz y tranquilidad.', english: 'I need some peace and tranquility.' },
      { spanish: 'Me gusta la paz y tranquilidad de mi casa.', english: 'I like the peace and quiet of my house.' },
    ],
  },
];
