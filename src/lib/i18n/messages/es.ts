import type { Messages } from "./en";

/**
 * Español. Cada clave que falte recurre al inglés por su cuenta, así que un
 * catálogo parcial es una aportación perfectamente válida: añade las líneas
 * que sepas y deja el resto.
 */
const es: Partial<Messages> = {
  "app.title": "Draft multijugador",
  "app.subtitle": "Heroes of Might & Magic III: el juego de mesa",
  "lang.label": "Idioma",
  "footer.more": "¿Te gusta lo que hago? Echa un vistazo a:",
  "footer.cardCreator": "Creador de cartas",
  "footer.editor": "Editor de escenarios",
  "footer.generator": "Generador de escenarios aleatorios",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Preparar el draft",
  "lobby.players": "Jugadores",
  "lobby.format": "Formato",
  "lobby.format.dealt": "Repartido",
  "lobby.format.snake": "Serpiente",
  "lobby.format.dealt.help":
    "Una sola barajada da a cada jugador un lote que nadie más ha recibido: todos eligen a la vez y dos jugadores no pueden acabar en la misma facción.",
  "lobby.format.snake.help":
    "Por turnos, un jugador cada vez, con una muestra nueva de lo que siga libre. Útil cuando no hay facciones suficientes para darle a todos una elección de verdad.",
  "lobby.factionPool": "Facciones a elegir",
  "lobby.heroPool": "Héroes a elegir",
  "lobby.pool.forced": "sin elección — la facción se reparte",
  "lobby.pool.forcedHero": "sin elección — el héroe se reparte",
  "lobby.pool.all": "Todos",
  "lobby.pool.all.help":
    "Todos los héroes que le queden a tu facción. Donde dos jugadores podrían recibir a la misma persona —Tarnum tiene carta en seis facciones— la fase de héroes da la vuelta a la mesa de uno en uno en lugar de todos a la vez.",
  "lobby.bans": "Vetos de facción por jugador",
  "lobby.bans.none": "Ninguno",
  "lobby.turns": "Turnos",
  "lobby.turns.help": "Cómo es un turno, y si el sitio en la mesa lo eliges tú.",
  "lobby.combined": "Facción y héroe en el mismo turno",
  "lobby.draftSeats": "Draftear también el orden de los sitios",
  "lobby.combined.help":
    "Un jugador toma su facción y luego el héroe de esa facción antes de que mueva el siguiente, de uno en uno alrededor de la mesa. Apagado: primero todos draftean facciones y los héroes después.",
  "lobby.draftSeats.help":
    "Cuando todo lo demás está drafteado, cada uno elige sitio entre los que queden libres. Apagado: lo decide la semilla.",
  "lobby.heroBans": "Vetos de héroe por jugador",
  "lobby.heroBans.help":
    "Se gastan en una ronda aparte, después del draft de facciones: hasta que no sabes quién juega con qué, vetar a un héroe es adivinar. Un veto que dejara a alguien sin nada que draftear se rechaza.",
  "lobby.heroBans.blindHelp":
    "Con facción y héroe en el mismo turno no hay ningún momento en que se conozcan las ciudades y los héroes todavía no, así que estos vetos caen antes que nada. Es adivinar, no leer.",
  "lobby.banVisibility": "Los vetos son",
  "lobby.banVisibility.open": "Abiertos",
  "lobby.banVisibility.blind": "A ciegas",
  "lobby.banVisibility.open.help": "Uno a uno, a la vista de todos.",
  "lobby.banVisibility.blind.help":
    "Todos vetan a la vez y los vetos se descubren juntos. Dos jugadores pueden gastar un veto en el mismo héroe o la misma facción, y aun así solo se retira una vez. Vale para las dos rondas de vetos.",
  "lobby.during": "Durante el draft",
  "lobby.conceal": "Mantener las elecciones ocultas hasta el final",
  "lobby.conceal.help":
    "Nadie ve lo que los demás han drafteado o vetado hasta la hoja final; alrededor de una sola pantalla eso significa que entre turno y turno nadie ve nada. Lo que ya se ha ido sigue a la vista en el tablero, porque no puedes cogerlo.",
  "lobby.heroRule": "Los héroes salen de",
  "lobby.heroRule.own": "Tu propia facción",
  "lobby.heroRule.unique-faction": "Cualquiera, una por cabeza",
  "lobby.heroRule.any": "Donde sea",
  "lobby.heroRule.own.help": "El héroe que drafteas pertenece a la facción que has drafteado.",
  "lobby.heroRule.unique-faction.help":
    "Tu héroe puede venir de una facción que no drafteaste, pero los héroes de dos jugadores no pueden compartir facción de origen.",
  "lobby.heroRule.any.help": "Cualquier héroe de cualquier facción.",
  "lobby.uniqueIdentity": "Un solo ejemplar de cada héroe",
  "lobby.uniqueIdentity.help":
    "Tarnum tiene carta en seis facciones y Lord Haart en dos. Con esto activado solo un jugador puede ser Tarnum.",
  "lobby.otherTowns": "Un héroe puede venir de la ciudad de otro jugador",
  "lobby.otherTowns.combined":
    "Siempre activo con facción y héroe en el mismo turno: el primer jugador coge un héroe antes de que el segundo tenga ciudad, así que todavía no hay otra ciudad de la que apartarse.",
  "lobby.sharedCards": "Una carta, dos héroes",
  "lobby.sharedCards.help":
    "Las cartas de héroe son de doble cara: draftear una cara se lleva la carta entera y el héroe del reverso se va con ella. Vetar no —el veto se lleva al héroe, no la carta—. Casi todas las parejas comparten ciudad, así que esto rara vez molesta salvo que se puedan draftear héroes de otra facción; la excepción es Tarnum, cuyas seis cartas en realidad son tres.",
  "lobby.sharedCards.nodata":
    "Hace falta la lista de qué héroes comparten carta, y todavía no está en la base de datos de la comunidad. Añade las parejas a CARD_PAIRS en scripts/build-catalogue.mjs y esto se activará.",
  "lobby.collection": "Tu colección",
  "lobby.collection.summary": "{factions} facciones, {heroes} héroes",
  "lobby.collection.all": "Todas las cajas",
  "lobby.collection.none": "Ninguna caja",
  "lobby.mode": "Se juega en",
  "lobby.mode.local": "Una sola pantalla",
  "lobby.mode.manual": "Enlaces compartidos",
  "lobby.mode.p2p": "En directo",
  "lobby.mode.local.help":
    "Un solo navegador lleva toda la mesa. Dice a quién le toca y espera a que esa persona coja la pantalla.",
  "lobby.mode.manual.help":
    "Cada uno recibe su propio enlace. Haz tu jugada y pasa el enlace nuevo al siguiente jugador. Sin servidor, sin cuentas, y funciona aunque no estéis en la misma red.",
  "lobby.mode.p2p.help":
    "Todos abren el mismo enlace y los navegadores se hablan directamente. Si la red lo bloquea, se vuelve a pasar enlaces.",
  "lobby.youAre": "Eres",
  "lobby.tooManyPlayers": "Solo hay {factions} facciones en juego.",
  "lobby.poolTooBig": "Harían falta {need} facciones; hay {left} sobre la mesa.",
  "lobby.tooManyBans": "Tantos vetos no dejarían una facción para cada uno de los {players} jugadores.",
  "lobby.factionNeeded": "Hace falta para repartir un draft a {players} jugadores.",
  "lobby.start": "Empezar el draft",
  "lobby.seed": "Semilla",
  "lobby.reroll": "Nueva semilla",
  "lobby.reset": "Restablecer valores por defecto",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} jugadores, {left} facciones sobre la mesa — se reparten {need}.",
  "feas.not-enough-factions":
    "{players} jugadores y {bans} vetos dejan {left} facciones. Tiene que haber al menos una por jugador.",
  "feas.faction-pool-too-large":
    "{players} jugadores con {pool} facciones cada uno necesitan {need} facciones; hay {left} sobre la mesa. Como mucho se pueden repartir {max} por jugador.",
  "feas.hero-pool-too-large":
    "{faction} tiene {have} héroes, así que no se pueden repartir {pool} a cada uno. El máximo es {max}.",
  "feas.not-enough-heroes": "No hay héroes para todos: hacen falta {need} y hay {have}.",
  "feas.fix": "Arreglarlo",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Sin empezar",
  "phase.ban": "Vetos",
  "phase.pick": "Facción y héroe",
  "phase.position": "Sitios",
  "phase.banHero": "Vetos de héroe",
  "phase.faction": "Facción",
  "phase.hero": "Héroe",
  "phase.done": "Drafteado",
  "draft.seat": "Jugador {n}",
  "draft.turn": "Le toca a {name}",
  "draft.yourTurn": "Te toca",
  "draft.simultaneous": "Todos eligen a la vez",
  "draft.waiting": "Esperando a los demás",
  "draft.pickFaction": "Elige una facción",
  "draft.pickHero": "Elige un héroe",
  "draft.banPrompt": "Veta una facción",
  "draft.banHeroPrompt": "Veta un héroe",
  "draft.pickSeat": "Elige dónde te sientas",
  "draft.pickSeat.help": "El orden de turno de la partida en sí",
  "draft.seatFirst": "Empieza",
  "draft.seatNth": "{n}.º en jugar",
  "draft.kept": "No se puede vetar",
  "draft.bansLeft": "quedan {n}",
  "draft.bansProgress": "{done} de {total} gastados",
  "draft.dealtOne": "Te ha tocado {faction}.",
  "draft.dealtOneHero": "Te ha tocado {hero}.",
  "draft.confirm": "Me lo quedo",
  "draft.banned": "Vetada",
  "draft.taken": "Ocupada",
  "draft.undo": "Deshacer la última jugada",
  "draft.undo.shared": "Solo tu última jugada, mientras no hayas pasado el enlace.",
  "draft.sending": "Se envía en {n}…",
  "draft.abandon": "Abandonar el draft",
  "draft.abandon.confirm": "¿Abandonar? Se pierde todo lo drafteado hasta ahora.",
  "draft.abandon.yes": "Sí, abandonar",
  "draft.abandon.no": "Seguir jugando",
  "draft.abandon.shared":
    "Esto solo termina el draft aquí. Los demás conservan su copia, y el enlace de esta página sigue abriéndolo.",
  "draft.hotseat": "Pásale la pantalla a {name}.",
  "draft.handover.copied": "Su enlace está en el portapapeles: pégaselo a {name}.",
  "draft.handover.manual": "Copia el enlace de abajo y mándaselo a {name}.",
  "draft.ready": "Tengo yo la pantalla",
  "draft.reveal": "Descubrir los vetos",
  "draft.notOffered": "No repartido a nadie",
  "draft.stats": "Ataque, defensa, poder mágico y conocimiento de {name}",
  "draft.unreplayable":
    "El draft guardado no se puede reproducir aquí: puede haberlo escrito otra versión de esta página. Empezar de nuevo conserva tu configuración, y un enlace o código que te hayan dado sigue abriendo el draft en sí.",
  "draft.unreplayable.reset": "Empezar de nuevo",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Leer sobre {name} en la wiki",
  "wiki.faction": "Leer sobre {name} en la wiki",

  // ----------------------------------------------------------------- result
  "result.heading": "El draft",
  "result.seat": "Sitio",
  "result.player": "Jugador",
  "result.faction": "Facción",
  "result.hero": "Héroe",
  "result.class": "Clase",
  "result.might": "Fuerza",
  "result.magic": "Magia",
  "result.copy": "Copiar como texto",
  "result.copied": "Copiado",
  "result.print": "Guardar en PDF",
  "result.again": "Draftear otra vez",
  "result.newSetup": "Cambiar la configuración",
  "result.code": "Código del draft",
  "result.seed": "Semilla",
  "result.bans": "Vetadas: {factions}",
  "result.heroBans": "Héroes vetados: {heroes}",
  "result.nobans": "Sin vetos",
  "result.showPassed": "Mostrar las opciones no elegidas",
  "result.alsoOffered": "también ofrecidas: {options}",
  "result.specialty": "Especialidad",
  "result.ability": "Habilidad",

  // ------------------------------------------------------------------ share
  "share.code": "Código del draft",
  "share.link": "Enlace",
  "share.room": "Enlace de la sala",
  "share.copy": "Copiar",
  "share.copied": "Copiado",
  "share.qr": "QR",
  "share.qrLoading": "Dibujándolo…",
  "share.qrHelp": "Apunta con un móvil para abrir ahí el draft.",
  "share.seatLinks": "Enlaces por jugador",
  "share.handOver": "Tu jugada está hecha. Mándale este enlace a {name}.",
  "share.resume": "Retomar un draft",
  "share.paste": "Pega un código o enlace de draft",
  "share.open": "Abrir",
  "share.bad": "Esta versión no sabe leer ese código.",
  "share.badCatalogue": "Ese código se hizo con otra lista de facciones.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "¿Qué sitio eres tú?",
  "claim.free": "Todavía no ha drafteado nada",
  "claim.hidden": "Oculto hasta el final",
  "claim.taken": "Aquí ya hay alguien",
  "claim.orHotseat": "¿Mejor todos alrededor de una pantalla?",
  "claim.hotseat": "Usar este navegador para toda la mesa",

  // ------------------------------------------------------------------- live
  "live.off": "Sin conexión",
  "live.connecting": "Buscando a los demás…",
  "live.online": "En directo",
  "live.failed": "No se pudo conectar",
  "live.with": "con {names}",
  "live.alone": "aquí todavía no hay nadie más",
  "live.dismiss": "Cerrar",
  "live.divergence.setup":
    "Alguien de esta sala ha abierto un draft distinto. Comprobad que todos tenéis el mismo enlace.",
  "live.divergence.state":
    "Este navegador y otro no coinciden sobre el draft. Vuelve a abrir el enlace para quedarte con su versión.",
  "live.divergence.seat": "Hay dos personas en tu sitio. Una de las dos debería moverse.",
  "live.fallback": "¿No conecta? Pasaos el enlace: lleva el draft entero.",
};

export default es;
