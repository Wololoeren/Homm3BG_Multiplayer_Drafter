import type { Messages } from "./en";

/**
 * Italiano. Ogni chiave mancante ricade da sola sull'inglese, quindi anche un
 * catalogo parziale è un contributo validissimo — aggiungi le righe che sai e
 * lascia stare le altre.
 */
const it: Partial<Messages> = {
  "app.title": "Draft multigiocatore",
  "app.subtitle": "Heroes of Might & Magic III: il gioco da tavolo",
  "lang.label": "Lingua",
  "footer.more": "Ti piace quello che faccio? Guarda anche:",
  "footer.cardCreator": "Creatore di carte",
  "footer.editor": "Editor di scenari",
  "footer.generator": "Generatore di scenari casuali",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Imposta il draft",
  "lobby.players": "Giocatori",
  "lobby.format": "Formato",
  "lobby.format.dealt": "Distribuito",
  "lobby.format.snake": "Serpente",
  "lobby.format.dealt.help":
    "Un solo mescolamento dà a ogni giocatore una rosa che nessun altro ha ricevuto: tutti scelgono insieme e due giocatori non possono finire sulla stessa fazione.",
  "lobby.format.snake.help":
    "A turno, un giocatore alla volta, ciascuno con un nuovo campione di ciò che resta libero. Serve quando le fazioni non bastano a dare a tutti una vera scelta.",
  "lobby.factionPool": "Fazioni proposte",
  "lobby.heroPool": "Eroi proposti",
  "lobby.pool.forced": "nessuna scelta — la fazione viene distribuita",
  "lobby.pool.forcedHero": "nessuna scelta — l'eroe viene distribuito",
  "lobby.pool.all": "Tutti",
  "lobby.pool.all.help":
    "Tutti gli eroi rimasti alla tua fazione. Dove due giocatori potrebbero ricevere la stessa persona — Tarnum ha una carta in sei fazioni — la fase degli eroi gira intorno al tavolo uno alla volta invece che tutti insieme.",
  "lobby.bans": "Ban di fazione a testa",
  "lobby.bans.none": "Nessuno",
  "lobby.turns": "Turni",
  "lobby.turns.help": "Com'è fatto un turno, e se il posto a tavola lo scegli tu.",
  "lobby.combined": "Fazione ed eroe nello stesso turno",
  "lobby.draftSeats": "Draftare anche l'ordine dei posti",
  "lobby.combined.help":
    "Un giocatore prende la sua fazione e poi l'eroe di quella fazione prima che tocchi al successivo, uno alla volta intorno al tavolo. Spento: prima tutti draftano le fazioni, poi gli eroi.",
  "lobby.draftSeats.help":
    "Quando tutto il resto è draftato, ciascuno sceglie il proprio posto fra quelli ancora liberi. Spento: decide il seme.",
  "lobby.heroBans": "Ban di eroe a testa",
  "lobby.heroBans.help":
    "Si spendono in un giro a parte, dopo il draft delle fazioni: finché non sai chi gioca cosa, bandire un eroe è tirare a indovinare. Un ban che lascerebbe qualcuno senza nulla da draftare viene rifiutato.",
  "lobby.heroBans.blindHelp":
    "Con fazione ed eroe nello stesso turno non esiste un momento in cui le città sono note e gli eroi ancora no: questi ban cadono prima di tutto il resto. Si indovina, non si legge.",
  "lobby.banVisibility": "I ban sono",
  "lobby.banVisibility.open": "Aperti",
  "lobby.banVisibility.blind": "Al buio",
  "lobby.banVisibility.open.help": "Uno alla volta, sotto gli occhi di tutti.",
  "lobby.banVisibility.blind.help":
    "Tutti bandiscono insieme e i ban si scoprono insieme. Due giocatori possono spendere un ban sullo stesso eroe o sulla stessa fazione: viene tolta comunque una volta sola. Vale per entrambi i giri di ban.",
  "lobby.during": "Durante il draft",
  "lobby.conceal": "Tieni nascoste le scelte fino alla fine",
  "lobby.conceal.help":
    "Nessuno vede cosa hanno draftato o bandito gli altri fino al foglio finale — intorno a un solo schermo vuol dire che fra un turno e l'altro non si vede niente. Ciò che è già sparito resta visibile sul tavolo, perché prenderlo non si può.",
  "lobby.heroRule": "Gli eroi vengono da",
  "lobby.heroRule.own": "La tua fazione",
  "lobby.heroRule.unique-faction": "Qualsiasi, una a testa",
  "lobby.heroRule.any": "Ovunque",
  "lobby.heroRule.own.help": "L'eroe che drafti appartiene alla fazione che hai draftato.",
  "lobby.heroRule.unique-faction.help":
    "Il tuo eroe può venire da una fazione che non hai draftato, ma gli eroi di due giocatori non possono avere la stessa fazione d'origine.",
  "lobby.heroRule.any.help": "Qualsiasi eroe di qualsiasi fazione.",
  "lobby.uniqueIdentity": "Un solo esemplare per eroe",
  "lobby.uniqueIdentity.help":
    "Tarnum ha una carta in sei fazioni e Lord Haart in due. Con questo attivo solo un giocatore può essere Tarnum.",
  "lobby.otherTowns": "Un eroe può venire dalla città di un altro giocatore",
  "lobby.otherTowns.combined":
    "Sempre attivo con fazione ed eroe nello stesso turno: il primo giocatore prende un eroe prima che il secondo abbia una città, quindi non c'è ancora nessun'altra città da cui stare alla larga.",
  "lobby.sharedCards": "Una carta, due eroi",
  "lobby.sharedCards.help":
    "Le carte eroe sono fronte-retro: draftarne una faccia prende l'intera carta e l'eroe sul retro se ne va con lei. Il ban no — toglie l'eroe, non la carta. Quasi ogni coppia condivide una città, quindi la cosa morde di rado se non si possono draftare eroi fuori fazione; l'eccezione è Tarnum, le cui sei carte in realtà sono tre.",
  "lobby.sharedCards.nodata":
    "Serve l'elenco di quali eroi condividono una carta, e nel database della community non c'è ancora. Aggiungi le coppie a CARD_PAIRS in scripts/build-catalogue.mjs e l'opzione si accende.",
  "lobby.collection": "La tua collezione",
  "lobby.collection.summary": "{factions} fazioni, {heroes} eroi",
  "lobby.collection.all": "Tutte le scatole",
  "lobby.collection.none": "Nessuna scatola",
  "lobby.mode": "Si gioca su",
  "lobby.mode.local": "Un solo schermo",
  "lobby.mode.manual": "Link passati di mano",
  "lobby.mode.p2p": "Dal vivo",
  "lobby.mode.local.help":
    "Un solo browser conduce tutto il tavolo. Annuncia chi tocca e aspetta che quella persona prenda lo schermo.",
  "lobby.mode.manual.help":
    "Ognuno ha il proprio link. Fai la tua mossa, passa il nuovo link al giocatore successivo. Niente server, niente account, e funziona anche se non siete sulla stessa rete.",
  "lobby.mode.p2p.help":
    "Tutti aprono lo stesso link e i browser si parlano direttamente. Se la rete lo impedisce, si torna a passarsi i link.",
  "lobby.youAre": "Tu sei",
  "lobby.tooManyPlayers": "In gioco ci sono solo {factions} fazioni.",
  "lobby.poolTooBig": "Servirebbero {need} fazioni; sul tavolo ce ne sono {left}.",
  "lobby.tooManyBans": "Tanti ban non lascerebbero una fazione a ciascuno dei {players} giocatori.",
  "lobby.factionNeeded": "Serve per distribuire un draft a {players} giocatori.",
  "lobby.start": "Avvia il draft",
  "lobby.seed": "Seme",
  "lobby.reroll": "Nuovo seme",
  "lobby.reset": "Ripristina i valori predefiniti",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} giocatori, {left} fazioni sul tavolo — {need} distribuite.",
  "feas.not-enough-factions":
    "{players} giocatori e {bans} ban lasciano {left} fazioni. Ce ne vuole almeno una per giocatore.",
  "feas.faction-pool-too-large":
    "{players} giocatori con {pool} fazioni ciascuno richiedono {need} fazioni; sul tavolo ce ne sono {left}. Al massimo se ne possono distribuire {max} a testa.",
  "feas.hero-pool-too-large":
    "{faction} ha {have} eroi, quindi {pool} a testa non si possono distribuire. Il massimo è {max}.",
  "feas.not-enough-heroes": "Non ci sono abbastanza eroi per tutti: ne servono {need}, ce ne sono {have}.",
  "feas.fix": "Sistema",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Non iniziato",
  "phase.ban": "Ban",
  "phase.pick": "Fazione ed eroe",
  "phase.position": "Posti",
  "phase.banHero": "Ban di eroe",
  "phase.faction": "Fazione",
  "phase.hero": "Eroe",
  "phase.done": "Draftato",
  "draft.seat": "Giocatore {n}",
  "draft.turn": "Tocca a {name}",
  "draft.yourTurn": "Tocca a te",
  "draft.simultaneous": "Si sceglie tutti insieme",
  "draft.waiting": "In attesa degli altri",
  "draft.pickFaction": "Scegli una fazione",
  "draft.pickHero": "Scegli un eroe",
  "draft.banPrompt": "Bandisci una fazione",
  "draft.banHeroPrompt": "Bandisci un eroe",
  "draft.pickSeat": "Scegli dove sederti",
  "draft.pickSeat.help": "L'ordine di turno della partita vera e propria",
  "draft.seatFirst": "Inizia",
  "draft.seatNth": "{n}° a giocare",
  "draft.kept": "Non si può bandire",
  "draft.bansLeft": "ne restano {n}",
  "draft.bansProgress": "{done} di {total} spesi",
  "draft.dealtOne": "Ti è toccata {faction}.",
  "draft.dealtOneHero": "Ti è toccato {hero}.",
  "draft.confirm": "Lo prendo",
  "draft.banned": "Bandita",
  "draft.taken": "Presa",
  "draft.undo": "Annulla l'ultima mossa",
  "draft.abandon": "Abbandona il draft",
  "draft.abandon.confirm": "Abbandonare? Tutto quello che è stato draftato va perso.",
  "draft.abandon.yes": "Sì, abbandona",
  "draft.abandon.no": "Continua",
  "draft.abandon.shared":
    "Questo chiude il draft solo qui. Gli altri hanno ancora la loro copia, e il link di questa pagina continua ad aprirlo.",
  "draft.hotseat": "Passa lo schermo a {name}.",
  "draft.handover.copied": "Il suo link è negli appunti — incollalo per {name}.",
  "draft.handover.manual": "Copia il link qui sotto e mandalo a {name}.",
  "draft.ready": "Ho lo schermo io",
  "draft.reveal": "Scopri i ban",
  "draft.notOffered": "Non distribuito a nessuno",
  "draft.stats": "Attacco, difesa, potere magico e sapienza di {name}",
  "draft.unreplayable":
    "Il draft salvato non si rigioca qui — potrebbe essere stato scritto da un'altra versione di questa pagina. Ricominciare conserva la tua configurazione, e un link o un codice che ti hanno dato apre ancora il draft vero e proprio.",
  "draft.unreplayable.reset": "Ricomincia",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Leggi di {name} sulla wiki",
  "wiki.faction": "Leggi di {name} sulla wiki",

  // ----------------------------------------------------------------- result
  "result.heading": "Il draft",
  "result.seat": "Posto",
  "result.player": "Giocatore",
  "result.faction": "Fazione",
  "result.hero": "Eroe",
  "result.class": "Classe",
  "result.might": "Forza",
  "result.magic": "Magia",
  "result.copy": "Copia come testo",
  "result.copied": "Copiato",
  "result.print": "Salva in PDF",
  "result.again": "Rifai il draft",
  "result.newSetup": "Cambia la configurazione",
  "result.code": "Codice del draft",
  "result.bans": "Bandite: {factions}",
  "result.heroBans": "Eroi banditi: {heroes}",
  "result.nobans": "Nessun ban",
  "result.showPassed": "Mostra le opzioni scartate",
  "result.alsoOffered": "offerti anche: {options}",
  "result.specialty": "Specialità",
  "result.ability": "Abilità",

  // ------------------------------------------------------------------ share
  "share.code": "Codice del draft",
  "share.link": "Link",
  "share.room": "Link della stanza",
  "share.copy": "Copia",
  "share.copied": "Copiato",
  "share.qr": "QR",
  "share.qrLoading": "Lo sto disegnando…",
  "share.qrHelp": "Inquadralo con un telefono per aprire lì il draft.",
  "share.seatLinks": "Link per giocatore",
  "share.handOver": "La tua mossa è registrata. Manda questo link a {name}.",
  "share.resume": "Riprendi un draft",
  "share.paste": "Incolla un codice o un link di draft",
  "share.open": "Apri",
  "share.bad": "Questa versione non sa leggere quel codice.",
  "share.badCatalogue": "Quel codice è stato creato con un altro elenco di fazioni.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Qual è il tuo posto?",
  "claim.free": "Ancora niente di draftato",
  "claim.hidden": "Nascosto fino alla fine",
  "claim.taken": "Qui c'è già qualcuno",
  "claim.orHotseat": "Meglio tutti intorno a un solo schermo?",
  "claim.hotseat": "Usa questo browser per tutto il tavolo",

  // ------------------------------------------------------------------- live
  "live.off": "Non connesso",
  "live.connecting": "Cerco gli altri…",
  "live.online": "Dal vivo",
  "live.failed": "Impossibile connettersi",
  "live.with": "con {names}",
  "live.alone": "qui non c'è ancora nessun altro",
  "live.dismiss": "Chiudi",
  "live.divergence.setup":
    "Qualcuno in questa stanza ha aperto un draft diverso. Controllate di avere tutti lo stesso link.",
  "live.divergence.state":
    "Questo browser e un altro non sono d'accordo sul draft. Riapri il link per prendere la loro versione.",
  "live.divergence.seat": "Due persone occupano il tuo posto. Una delle due dovrebbe spostarsi.",
  "live.fallback": "Non si connette? Passatevi il link — porta con sé tutto il draft.",
};

export default it;
