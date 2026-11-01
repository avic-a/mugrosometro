/* Todo lo que dice la chinche. Edita, borra o agrega frases libremente:
   cada frase es un texto entre comillas, separado por comas. */

export const AJUSTES = {
  insistenteToques: 3,     // toques seguidos...
  insistenteSeg: 60,       // ...dentro de estos segundos = la chinche se marea
  rafagaToques: 7,         // toques muy rápidos seguidos...
  rafagaMs: 700,           // ...con menos de esto entre uno y otro (milisegundos)
  mantenerMs: 700,         // tiempo que hay que mantener presionada
  probDorado: 1 / 15       // probabilidad del mensaje brillante en cada toque
};

/* Pregunta que aparece arriba del mensaje en el cuadro de código. */
export const PREGUNTA = "¿Qué quieres saber hoy?";

/* Mensajes normales: salen en orden aleatorio y no se repiten hasta que se acaban todos. */
export const MENSAJES = {
  carino: [
    "Eres el N de mi E",
    "Te quiero mucho mi panquesito con chispas de chocolate",
    "Qué suerte la mía de que existas.",
    "Wof, wof, auuuuuu",
    "Todo se siente más bonito contigo cerca.",
    "Tú con tan buena herramienta y yo haciendo chambas a mano",
    "Me debes un abracito",
    "Amor, tu puedes con todo lo olvides.",
    "Eres mi persona favorita para cualquier plan.",
    "Gracias por existir.",
    "Te mando un beso telepático.",
    "Estoy en tus paredes"
  ],
  animo: [
    "Va a salir mejor de lo que imaginas.",
    "Primera regla del club de la pelea...",
    "Eres más capaz de lo que crees.",
    "Hoy no tienes que hacerlo todo perfecto.",
    "Tu esfuerzo se nota, ánimo amorcito.",
    "Mañana fio hoy no.",
    "¿Ya tomaste agua corazoncito?",
    "Confía en ti, yo siempre confio en ti",
    "¡Tu eres peña nieto!",
    "Quién fuera noche para caerte encima"
  ],
  ocurrencias: [
    "La chinche consultó con sus antenas: todo bien.",
    "Mi radar interno dice que mereces un awashile.",
    "Amanecí vuelto un bicho, siuuuu",
    "Mis patitas dicen que sí.",
    "Apoco si mi todo precioso",
    "La chinche no opina, pero aplaude.",
    "¿Todo eso mi amorcito hermoso?",
    "Alerta: estas tan chulo que voy a explotar.",
    "Te quiero hoy y siempre.",
    "Hoy es un buen dia corazón porque estas aqui <3."
  ],
  bola: [
    "Todo apunta a que sí.",
    "Simona la mona pelona",
    "Las señales son buenísimas.",
    "Pinta muy bien.",
    "Confía, que sí.",
    "Esta muy asinfonyu",
    "Wachiriscreifor dos tres trucos",
    "No olvides que eres escorpio manifiesta fuerte",
    "Mejor de lo que esperas.",
    "El universo dice que todo lo que pidas se te dará."
  ]
};

/* Los 9 secretos. 'pista' es lo que se ve mientras siguen sin descubrir. */
export const SECRETOS = {
  insistente: {
    titulo: "La chinche se marea",
    pista: "A la chinche no le gusta que la toquen muchas veces seguidas… o sí.",
    mensajes: [
      "¡Ay, me mareé! Ya sabes la respuesta preciosote.",
      "Todo me da vueltas. Ahora te toca dar vueltas a ti.",
      "Me gusta todo lo que marea y tus besos."
    ]
  },
  once: {
    titulo: "11:11",
    pista: "¡Rápido pide un deseo!",
    mensajes: [
      "11:11. Pide un deseo, que ya sé cuál es y se va a cumplir.",
      "Son las 11:11 y justo estaba pensando en ti. Casualidad, claro que no."
    ]
  },
  medianoche: {
    titulo: "Medianoche",
    pista: "Voy desveladooo...",
    mensajes: [
      "Por estas calles esperando encontraaar...",
      "¡Decansa amorcito! Para que amanezcas pilas mañana"
    ]
  },
  cuatro: {
    titulo: "4:44",
    pista: "Tu y yo 4x4",
    mensajes: [
      "4:44. Somos el uno para el otro.",
      "4:44, Me encanta compartir contigo"
    ]
  },
  dorado: {
    titulo: "Mensaje brillante",
    pista: "A veces la chinche brilla.",
    mensajes: [
      "Pase lo que pase, quiero que recuerdes que eres querido, eres valioso y nunca vas solo.",
      "Si brillo es porque tu estas a mi lado, te admiro tanto, me inspira lo fuerte, valiente, paciente y cuiadoso que eres. Te amo",
      "Que cumplas todo lo que te propongas, que la vida te sorprenda para bien y que los momentos malos se conviertan en anecdotas chistosas.",
      "Que siempre puedas navegar el mundo sabiéndote querido, acompañado y apoyado.",
      "Me encanta quien eres, cómo eres y me emociona tanto crecer juntos."
    ]
  },
  rafaga: {
    titulo: "Ráfaga de cariño",
    pista: "Oh yeah, oh shit, oh fuck...",
    mensajes: [
      "¡Siete toques seguidos! Mi caparazón no está hecho para tanta emoción. Me encanta tu energía.",
      "¡Ráfaga! Así de rápido late mi corazón de chinche cuando apareces."
    ]
  },
  mantener: {
    titulo: "Un abrazo largo",
    pista: "Que dure para siempre...",
    mensajes: [
      "Te quedaste conmigo un buen rato y se sintió como un abrazo largo. Gracias.",
      "Apapachos para ti tambien amorcito. Lo estas haciendo increíble"
    ]
  },
  cien: {
    titulo: "Frase número 100",
    pista: "Hay que ser muy curioso o muy insistente para llegar aquí.",
    mensajes: [
      "¡Llegamos a 100! Cien veces te quise un poquito más."
    ]
  },
  quincena: {
    titulo: "Un día 15",
    pista: "Algunos días del mes son más especiales que otros.",
    mensajes: [
      "Tu y yo forever & ever. Gracias por tanto amorcito", 
      "Yo a uste lo quiero mucho x más momentos juntos",
      "Juntos somos invencibles, sigamos construyendo juntos. Te amo mi vida."
    ]   // el texto de este secreto está en QUINCENA y ANIVERSARIO
  }
};

/* Comentarios en preguntas especiales (no cuentan como secreto). */
export const HITOS = {
  10: "Frase 10. Preguntas o cursilerias aqui todo para su dia a dia.",
  50: "Pregunta 50. Chinche y perrito forever and ever"
};

/* Horas secretas (hora local del celular, 24 h). Solo funcionan durante ese minuto. */
export const HORAS = [
  { id: "once",       horas: ["11:11", "23:11"] },
  { id: "medianoche", horas: ["00:00"] },
  { id: "cuatro",     horas: ["16:44", "04:44"] }          // 4:44 pm
];

/* Primer toque de cada día 15. El 15 de mayo sale el mensaje de aniversario. */
export const QUINCENA   = { dia: 15, mensaje: "Otro mes queriéndonos." };
export const ANIVERSARIO = { mes: 5, dia: 15, mensaje: "Feliz aniversario amorcito, te quiero." };

