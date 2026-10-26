import type { Messages } from "./en";

/**
 * Deutsch. Jeder fehlende Schlüssel fällt für sich auf Englisch zurück, ein
 * halber Katalog ist also ein völlig brauchbarer Beitrag — trag ein, was du
 * weißt, und lass den Rest weg.
 */
const de: Partial<Messages> = {
  "app.title": "Mehrspieler-Draft",
  "app.subtitle": "Heroes of Might & Magic III: Das Brettspiel",
  "lang.label": "Sprache",
  "footer.more": "Gefällt dir das? Dann schau dir an:",
  "footer.cardCreator": "Kartenbaukasten",
  "footer.editor": "Szenario-Editor",
  "footer.generator": "Zufalls-Szenariogenerator",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Draft einrichten",
  "lobby.players": "Spieler",
  "lobby.format": "Format",
  "lobby.format.dealt": "Ausgeteilt",
  "lobby.format.snake": "Schlange",
  "lobby.format.dealt.help":
    "Ein einziges Mischen gibt jedem Spieler eine Auswahl, die sonst niemand bekommen hat: alle wählen gleichzeitig, und zwei Spieler können nicht auf derselben Fraktion landen.",
  "lobby.format.snake.help":
    "Reihum, ein Spieler nach dem anderen, jeder mit einer frischen Stichprobe aus allem, was noch frei ist. Für den Fall, dass es nicht genug Fraktionen für eine echte Auswahl gibt.",
  "lobby.factionPool": "Fraktionen zur Auswahl",
  "lobby.heroPool": "Helden zur Auswahl",
  "lobby.pool.forced": "keine Wahl — die Fraktion wird ausgeteilt",
  "lobby.pool.forcedHero": "keine Wahl — der Held wird ausgeteilt",
  "lobby.pool.all": "Alle",
  "lobby.pool.all.help":
    "Alle Helden, die deiner Fraktion noch geblieben sind. Wo zwei Spielern dieselbe Person angeboten werden könnte — Tarnum hat in sechs Fraktionen eine Karte — geht der Heldenschritt einzeln um den Tisch statt für alle gleichzeitig.",
  "lobby.bans": "Fraktionsbanns je Spieler",
  "lobby.bans.none": "Keine",
  "lobby.turns": "Züge",
  "lobby.turns.help": "Wie ein Zug aussieht, und ob dein Platz am Tisch deine Wahl ist.",
  "lobby.combined": "Fraktion und Held in einem Zug",
  "lobby.draftSeats": "Sitzreihenfolge mitdraften",
  "lobby.combined.help":
    "Ein Spieler nimmt seine Fraktion und dann deren Helden, bevor der nächste zieht — einzeln um den Tisch. Aus: erst draften alle Fraktionen, danach Helden.",
  "lobby.draftSeats.help":
    "Wenn alles andere gedraftet ist, sucht sich jeder einen der noch freien Plätze aus. Aus: der Startwert entscheidet.",
  "lobby.heroBans": "Heldenbanns je Spieler",
  "lobby.heroBans.help":
    "In einer eigenen Runde nach dem Fraktionsdraft ausgegeben — solange man nicht weiß, wer was spielt, ist ein Heldenbann geraten. Ein Bann, der jemandem nichts mehr zum Draften ließe, wird abgelehnt.",
  "lobby.heroBans.blindHelp":
    "Mit Fraktion und Held in einem Zug gibt es keinen Moment, in dem die Städte bekannt sind und die Helden noch nicht — diese Banns fallen also vor allem anderen. Geraten statt gelesen.",
  "lobby.banVisibility": "Banns sind",
  "lobby.banVisibility.open": "Offen",
  "lobby.banVisibility.blind": "Blind",
  "lobby.banVisibility.open.help": "Einer nach dem anderen, alle sehen zu.",
  "lobby.banVisibility.blind.help":
    "Alle bannen gleichzeitig, und die Banns werden zusammen aufgedeckt. Zwei Spieler dürfen denselben Helden oder dieselbe Fraktion bannen — entfernt wird sie trotzdem nur einmal. Gilt für beide Bannrunden.",
  "lobby.during": "Während des Drafts",
  "lobby.conceal": "Entscheidungen bis zum Schluss verbergen",
  "lobby.conceal.help":
    "Niemand sieht, was die anderen gedraftet oder gebannt haben, bis zum Blatt am Ende — an einem gemeinsamen Bildschirm heißt das: zwischen den Zügen sieht niemand irgendetwas. Was schon weg ist, bleibt auf dem Brett zu sehen, denn nehmen kannst du es nicht.",
  "lobby.heroRule": "Helden kommen aus",
  "lobby.heroRule.own": "Der eigenen Fraktion",
  "lobby.heroRule.unique-faction": "Jeder Fraktion, je einer",
  "lobby.heroRule.any": "Überallher",
  "lobby.heroRule.own.help": "Der Held, den du draftest, gehört zu der Fraktion, die du gedraftet hast.",
  "lobby.heroRule.unique-faction.help":
    "Dein Held darf aus einer Fraktion stammen, die du nicht gedraftet hast, aber die Helden zweier Spieler dürfen keine gemeinsame Heimatfraktion haben.",
  "lobby.heroRule.any.help": "Jeder Held aus jeder Fraktion.",
  "lobby.uniqueIdentity": "Jeden Helden nur einmal",
  "lobby.uniqueIdentity.help":
    "Tarnum hat in sechs Fraktionen eine Karte, Lord Haart in zwei. Damit kann nur ein Spieler Tarnum sein.",
  "lobby.otherTowns": "Helden dürfen aus der Stadt eines anderen Spielers kommen",
  "lobby.otherTowns.combined":
    "Immer an, wenn Fraktion und Held in einem Zug laufen: der erste Spieler nimmt einen Helden, bevor der zweite eine Stadt hat — es gibt also noch keine andere Stadt, von der man sich fernhalten könnte.",
  "lobby.sharedCards": "Eine Karte, zwei Helden",
  "lobby.sharedCards.help":
    "Heldenkarten sind doppelseitig: Wer eine Seite draftet, nimmt die ganze Karte, und der Held auf der Rückseite geht mit. Ein Bann nicht — der nimmt den Helden, nicht die Karte. Fast jedes Paar teilt sich eine Stadt, das fällt also selten auf, außer Helden dürfen fraktionsfremd gedraftet werden; die Ausnahme ist Tarnum, dessen sechs Karten in Wahrheit drei sind.",
  "lobby.sharedCards.nodata":
    "Dafür fehlt die Liste, welche Helden sich eine Karte teilen; sie steht noch nicht in der Community-Datenbank. Trag die Paare in CARD_PAIRS in scripts/build-catalogue.mjs ein, dann schaltet sich das frei.",
  "lobby.collection": "Deine Sammlung",
  "lobby.collection.summary": "{factions} Fraktionen, {heroes} Helden",
  "lobby.collection.all": "Alle Schachteln",
  "lobby.collection.none": "Keine Schachteln",
  "lobby.mode": "Gespielt wird auf",
  "lobby.mode.local": "Einem Bildschirm",
  "lobby.mode.manual": "Weitergereichten Links",
  "lobby.mode.p2p": "Live",
  "lobby.mode.local.help":
    "Ein Browser führt den ganzen Tisch. Er nennt, wer als Nächstes dran ist, und wartet, bis diese Person den Bildschirm nimmt.",
  "lobby.mode.manual.help":
    "Jeder bekommt seinen eigenen Link. Zug machen, den neuen Link an den Nächsten weitergeben. Kein Server, keine Konten, und es geht auch ohne gemeinsames Netz.",
  "lobby.mode.p2p.help":
    "Alle öffnen denselben Link, und die Browser reden direkt miteinander. Blockiert das Netz, fällt es auf das Weiterreichen von Links zurück.",
  "lobby.youAre": "Du bist",
  "lobby.tooManyPlayers": "Es sind nur {factions} Fraktionen im Spiel.",
  "lobby.poolTooBig": "Das bräuchte {need} Fraktionen; {left} liegen auf dem Tisch.",
  "lobby.tooManyBans": "So viele Banns ließen nicht jedem der {players} Spieler eine Fraktion.",
  "lobby.factionNeeded": "Wird gebraucht, um {players} Spielern einen Draft auszuteilen.",
  "lobby.start": "Draft starten",
  "lobby.seed": "Startwert",
  "lobby.reroll": "Neuer Startwert",
  "lobby.reset": "Auf Standard zurücksetzen",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} Spieler, {left} Fraktionen auf dem Tisch — {need} davon ausgeteilt.",
  "feas.not-enough-factions":
    "{players} Spieler und {bans} Banns lassen {left} Fraktionen übrig. Es muss mindestens eine pro Spieler sein.",
  "feas.faction-pool-too-large":
    "{players} Spieler mit je {pool} Fraktionen brauchen {need} Fraktionen; {left} liegen auf dem Tisch. Mehr als {max} je Spieler lassen sich nicht austeilen.",
  "feas.hero-pool-too-large":
    "{faction} hat {have} Helden, je {pool} lassen sich also nicht austeilen. Höchstens {max}.",
  "feas.not-enough-heroes":
    "Es gibt nicht genug Helden für alle: {need} gebraucht, {have} verfügbar.",
  "feas.fix": "In Ordnung bringen",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Nicht begonnen",
  "phase.ban": "Banns",
  "phase.pick": "Fraktion und Held",
  "phase.position": "Sitzplätze",
  "phase.banHero": "Heldenbanns",
  "phase.faction": "Fraktion",
  "phase.hero": "Held",
  "phase.done": "Gedraftet",
  "draft.seat": "Spieler {n}",
  "draft.turn": "{name} ist am Zug",
  "draft.yourTurn": "Du bist dran",
  "draft.simultaneous": "Alle wählen gleichzeitig",
  "draft.waiting": "Warten auf die anderen",
  "draft.pickFaction": "Wähle eine Fraktion",
  "draft.pickHero": "Wähle einen Helden",
  "draft.banPrompt": "Banne eine Fraktion",
  "draft.banHeroPrompt": "Banne einen Helden",
  "draft.pickSeat": "Wähle deinen Platz",
  "draft.pickSeat.help": "Die Zugreihenfolge für das Spiel selbst",
  "draft.seatFirst": "Beginnt",
  "draft.seatNth": "{n}. am Zug",
  "draft.kept": "Kann nicht gebannt werden",
  "draft.bansLeft": "{n} übrig",
  "draft.bansProgress": "{done} von {total} ausgegeben",
  "draft.dealtOne": "Du hast {faction} bekommen.",
  "draft.dealtOneHero": "Du hast {hero} bekommen.",
  "draft.confirm": "Nehmen",
  "draft.banned": "Gebannt",
  "draft.taken": "Vergeben",
  "draft.undo": "Letzten Zug zurücknehmen",
  "draft.undo.shared": "Dein eigener letzter Zug, solange du den Link noch nicht weitergegeben hast.",
  "draft.sending": "Wird in {n} gesendet…",
  "draft.abandon": "Draft abbrechen",
  "draft.abandon.confirm": "Wirklich abbrechen? Alles bisher Gedraftete ist weg.",
  "draft.abandon.yes": "Ja, abbrechen",
  "draft.abandon.no": "Weiterspielen",
  "draft.abandon.shared":
    "Das beendet den Draft nur hier. Alle anderen haben weiterhin ihre Kopie, und der Link auf dieser Seite öffnet ihn nach wie vor.",
  "draft.hotseat": "Gib den Bildschirm an {name} weiter.",
  "draft.handover.copied": "Der Link liegt in deiner Zwischenablage — füg ihn für {name} ein.",
  "draft.handover.manual": "Kopiere den Link unten und schick ihn an {name}.",
  "draft.ready": "Ich habe den Bildschirm",
  "draft.reveal": "Banns aufdecken",
  "draft.notOffered": "Niemandem ausgeteilt",
  "draft.stats": "Angriff, Verteidigung, Zauberkraft und Wissen von {name}",
  "draft.unreplayable":
    "Der gespeicherte Draft lässt sich hier nicht nachspielen — er stammt womöglich aus einer anderen Version dieser Seite. Ein Neuanfang behält deine Einstellungen, und ein Link oder Code, den du bekommen hast, öffnet den Draft weiterhin.",
  "draft.unreplayable.reset": "Neu anfangen",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Im Wiki über {name} lesen",
  "wiki.faction": "Im Wiki über {name} lesen",

  // ----------------------------------------------------------------- result
  "result.heading": "Der Draft",
  "result.seat": "Platz",
  "result.player": "Spieler",
  "result.faction": "Fraktion",
  "result.hero": "Held",
  "result.class": "Klasse",
  "result.might": "Macht",
  "result.magic": "Magie",
  "result.copy": "Als Text kopieren",
  "result.copied": "Kopiert",
  "result.print": "Als PDF sichern",
  "result.again": "Noch einmal draften",
  "result.newSetup": "Einstellungen ändern",
  "result.code": "Draft-Code",
  "result.seed": "Startwert",
  "result.bans": "Gebannt: {factions}",
  "result.heroBans": "Gebannte Helden: {heroes}",
  "result.nobans": "Keine Banns",
  "result.showPassed": "Nicht genommene Optionen zeigen",
  "result.alsoOffered": "auch angeboten: {options}",
  "result.specialty": "Spezialgebiet",
  "result.ability": "Fähigkeit",

  // ------------------------------------------------------------------ share
  "share.code": "Draft-Code",
  "share.link": "Link",
  "share.room": "Raum-Link",
  "share.copy": "Kopieren",
  "share.copied": "Kopiert",
  "share.qr": "QR",
  "share.qrLoading": "Wird gezeichnet…",
  "share.qrHelp": "Ein Handy darauf richten, um den Draft dort zu öffnen.",
  "share.seatLinks": "Links je Spieler",
  "share.handOver": "Dein Zug steht. Schick diesen Link an {name}.",
  "share.resume": "Draft fortsetzen",
  "share.paste": "Draft-Code oder Link einfügen",
  "share.open": "Öffnen",
  "share.bad": "Diesen Code kann diese Version nicht lesen.",
  "share.badCatalogue": "Dieser Code wurde mit einer anderen Fraktionsliste erzeugt.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Welcher Platz bist du?",
  "claim.free": "Noch nichts gedraftet",
  "claim.hidden": "Bis zum Schluss verborgen",
  "claim.taken": "Hier sitzt schon jemand",
  "claim.orHotseat": "Lieber doch alle an einem Bildschirm?",
  "claim.hotseat": "Diesen Browser für den ganzen Tisch nutzen",

  // ------------------------------------------------------------------- live
  "live.off": "Nicht verbunden",
  "live.connecting": "Suche die anderen…",
  "live.online": "Live",
  "live.failed": "Verbindung nicht möglich",
  "live.with": "mit {names}",
  "live.alone": "sonst ist noch niemand da",
  "live.dismiss": "Schließen",
  "live.divergence.setup":
    "Jemand in diesem Raum hat einen anderen Draft geöffnet. Prüft, ob ihr alle denselben Link habt.",
  "live.divergence.state":
    "Dieser Browser und ein anderer sind sich über den Draft uneinig. Öffne den Link neu, um deren Stand zu übernehmen.",
  "live.divergence.seat": "Zwei Leute sitzen auf deinem Platz. Eine(r) von beiden sollte wechseln.",
  "live.fallback": "Keine Verbindung? Reicht stattdessen den Link weiter — er trägt den ganzen Draft.",
};

export default de;
