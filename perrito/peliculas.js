/* Datos de la página Perrito. Edita con calma: la lista inicial solo se usa la primera vez. */

export const PERSONAS = { chinche: 'chinche hedionda', perrito: 'perrito mugroso' };
export const PREGUNTA = '¿Qué vemos hoy?';

/* Ánimos para filtrar el carrete */
export const MOODS = [
  { id: 'risa', t: 'Reír' }, { id: 'drama', t: 'Llorar' }, { id: 'miedo', t: 'Miedo' },
  { id: 'raro', t: 'Raro' }, { id: 'accion', t: 'Acción' }, { id: 'animada', t: 'Animada' }, { id: 'romance', t: 'Romance' }
];

/* Cómo se traducen los géneros de TMDB a ánimos (se aplica al vincular una película) */
export const GENERO_A_MOOD = {
  35: 'risa', 18: 'drama', 27: 'miedo', 53: 'miedo', 878: 'raro', 14: 'raro', 9648: 'raro',
  28: 'accion', 12: 'accion', 16: 'animada', 10749: 'romance', 10765: 'raro', 10759: 'accion'
};

/* Lista inicial. Cada elemento es "Título" o ["Título", año]. El título sirve para buscar en TMDB;
   cuando se vincula, la página muestra el nombre oficial en español. */
export const INICIALES = [
  ["Freedom", 2006], "Horror in the High Desert", "Alien Abduction", ["Hijos de los hombres", 2006],
  ["Jacob's Ladder", 1990], ["Brother", 1997], ["Brother 2", 2000], ["After Hours", 1985],
  ["Blondi", 2023], "Legend of the Galactic Heroes", "Catnapped!", ["El castillo de la pureza", 1973],
  "Phantom of the Paradise", ["Silence", 2016], ["Spoorloos", 1988], "Lost Highway", "In the Mood for Love",
  "Mirrored Minds", ["Alien: Romulus", 2024], ["Time Masters", 1982], "Jin-Roh: The Wolf Brigade", "Aftersun",
  "Fehérlófia", "Mad God", "Tetsuo: The Iron Man", ["Watership Down", 1978], ["Hojas de otoño", 2023],
  ["Shoah", 1985], ["Castle of Sand", 1974], "Tick, Tick... Boom!", ["Familia en renta", 2025],
  ["Copycat", 1995], "Don't Worry Darling", ["Wizards", 1977], "Billy Elliot", ["The Assessment", 2024],
  ["Tardes de soledad", 2024], ["Hedda", 2025], ["The Empire", 2024], "Napoleon Dynamite", "Fight Club",
  ["Memories", 1995], ["A Grand Day Out", 1989], "The Breakfast Club", "The Animatrix", "Alien Resurrection",
  ["Prometheus", 2012], ["A Minecraft Movie", 2025], "SLC Punk!", "Better Luck Tomorrow", ["Amarte duele", 2002],
  "Belladonna of Sadness", "Roujin Z", ["Hot Fuzz", 2007], ["Shaun of the Dead", 2004], ["Redline", 2009],
  "Taxi Driver", "Dinner in America", "El Padrino", ["Orgullo y prejuicio", 2005], ["Us", 2019],
  ["The Lighthouse", 2019], "The Fifth Element", "Over the Garden Wall", "Marriage Story", "The Green Knight",
  ["Dune: Part Two", 2024], "The Iron Claw", "The Fast and the Furious: Tokyo Drift", ["Twilight", 2008],
  ["The Twilight Saga: New Moon", 2009], "Monkey Man", "Anatomy of a Fall", ["Supercool", 2021],
  "Inside Out 2", "Problemista", ["Flow", 2024], "Nope", "The Northman", "The Worst Person in the World",
  ["Nosferatu", 2024], "Late Night with the Devil", "Longlegs", ["Corina", 2024],
  "How to Lose a Guy in 10 Days", "Mickey 17", "Common Side Effects", ["Shrek", 2001], ["Shrek 2", 2004],
  ["Fallen Angels", 1995], "Berserk: The Golden Age Arc I - The Egg of the King",
  "Berserk: The Golden Age Arc II - The Battle for Doldrey", "Berserk: The Golden Age Arc III - The Advent",
  "Life of Pi", "The Twilight Saga: Eclipse", "The Twilight Saga: Breaking Dawn - Part 1",
  "The Twilight Saga: Breaking Dawn - Part 2", ["The Dog Thief", 2019], ["Spirited Away", 2001],
  "Princess Mononoke", "My Neighbor Totoro", "About a Boy", "Notting Hill", "Little Miss Sunshine",
  ["Office Space", 1999], "Sister Midnight"
];
