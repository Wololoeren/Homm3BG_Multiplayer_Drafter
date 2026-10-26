import type { Messages } from "./en";

/**
 * Čeština. Každý chybějící klíč sám spadne zpět na angličtinu, takže i
 * neúplný katalog je dobrý příspěvek — doplň, co víš, zbytek nech být.
 */
const cs: Partial<Messages> = {
  "app.title": "Draft pro více hráčů",
  "app.subtitle": "Heroes of Might & Magic III: desková hra",
  "lang.label": "Jazyk",
  "footer.more": "Líbí se ti to? Mrkni na:",
  "footer.cardCreator": "Tvůrce karet",
  "footer.editor": "Editor scénářů",
  "footer.generator": "Generátor náhodných scénářů",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Nastavení draftu",
  "lobby.players": "Hráči",
  "lobby.format": "Formát",
  "lobby.format.dealt": "Rozdání",
  "lobby.format.snake": "Had",
  "lobby.format.dealt.help":
    "Jedno zamíchání dá každému hráči nabídku, kterou nikdo jiný nedostal, takže všichni vybírají naráz a dva hráči nemohou skončit u stejné frakce.",
  "lobby.format.snake.help":
    "Po řadě, jeden hráč po druhém, každý dostane čerstvý vzorek z toho, co zbývá. Hodí se, když frakcí není dost na to, aby měl každý opravdovou volbu.",
  "lobby.factionPool": "Frakcí na výběr",
  "lobby.heroPool": "Hrdinů na výběr",
  "lobby.pool.forced": "bez výběru — frakce je rozdána",
  "lobby.pool.forcedHero": "bez výběru — hrdina je rozdán",
  "lobby.pool.all": "Všichni",
  "lobby.pool.all.help":
    "Všichni hrdinové, kteří tvé frakci zbyli. Tam, kde by dvěma hráčům mohla padnout stejná postava — Tarnum má kartu v šesti frakcích — jde krok s hrdiny kolem stolu po jednom místo všech naráz.",
  "lobby.bans": "Banů frakcí",
  "lobby.bans.none": "Žádné",
  "lobby.turns": "Tahy",
  "lobby.turns.help": "Jak vypadá tah a jestli si místo u stolu vybíráš sám.",
  "lobby.combined": "Frakce a hrdina v jednom tahu",
  "lobby.draftSeats": "Draftovat i pořadí míst",
  "lobby.combined.help":
    "Hráč si vezme frakci a hned jejího hrdinu, než je na řadě další — po jednom kolem stolu. Vypnuto: nejdřív všichni draftují frakce, pak hrdiny.",
  "lobby.draftSeats.help":
    "Až je všechno ostatní nadraftované, každý si vybere místo z těch, co zbyla. Vypnuto: rozhodne seed.",
  "lobby.heroBans": "Banů hrdinů",
  "lobby.heroBans.help":
    "Utrácejí se ve vlastním kole, až po draftu frakcí — dokud nevíš, kdo co hraje, je ban hrdiny jen odhad. Ban, po kterém by někdo neměl co draftovat, se odmítne.",
  "lobby.heroBans.blindHelp":
    "Když jdou frakce a hrdina v jednom tahu, není chvíle, kdy jsou města známá a hrdinové ještě ne — tyhle bany tedy padnou dřív než cokoli jiného. Odhad, ne čtení.",
  "lobby.banVisibility": "Bany jsou",
  "lobby.banVisibility.open": "Otevřené",
  "lobby.banVisibility.blind": "Naslepo",
  "lobby.banVisibility.open.help": "Po jednom, všichni se dívají.",
  "lobby.banVisibility.blind.help":
    "Všichni banují naráz a bany se odkryjí společně. Dva hráči mohou dát ban na stejného hrdinu nebo stejnou frakci — stejně zmizí jen jednou. Platí pro obě kola banů.",
  "lobby.during": "Během draftu",
  "lobby.conceal": "Držet volby skryté až do konce",
  "lobby.conceal.help":
    "Nikdo nevidí, co ostatní nadraftovali nebo zabanovali, až do závěrečného listu — u jedné obrazovky to znamená, že mezi tahy nevidí nikdo nic. Co už je pryč, je na desce pořád vidět, protože to prostě nejde vzít.",
  "lobby.heroRule": "Hrdinové jsou z",
  "lobby.heroRule.own": "Vlastní frakce",
  "lobby.heroRule.unique-faction": "Libovolné, po jednom",
  "lobby.heroRule.any": "Odkudkoli",
  "lobby.heroRule.own.help": "Hrdina, kterého si vezmeš, patří k frakci, kterou sis vzal.",
  "lobby.heroRule.unique-faction.help":
    "Tvůj hrdina může být z frakce, kterou sis nevzal, ale hrdinové dvou hráčů nesmějí sdílet domovskou frakci.",
  "lobby.heroRule.any.help": "Libovolný hrdina z libovolné frakce.",
  "lobby.uniqueIdentity": "Od každého hrdiny jen jeden",
  "lobby.uniqueIdentity.help":
    "Tarnum má kartu v šesti frakcích a Lord Haart ve dvou. S tímhle zapnutým může být Tarnumem jen jeden hráč.",
  "lobby.otherTowns": "Hrdina může být z města jiného hráče",
  "lobby.otherTowns.combined":
    "Vždy zapnuto, když jdou frakce a hrdina v jednom tahu: první hráč si bere hrdinu dřív, než má druhý město, takže se zatím není čemu vyhýbat.",
  "lobby.sharedCards": "Jedna karta, dva hrdinové",
  "lobby.sharedCards.help":
    "Karty hrdinů jsou oboustranné, takže vzít jednu stranu znamená vzít celou kartu a hrdina na rubu odchází s ní. Ban ne — ten bere hrdinu, ne kartu. Skoro každá dvojice sdílí město, takže to málokdy vadí, pokud se nesmí draftovat mimo vlastní frakci; výjimkou je Tarnum, jehož šest karet jsou ve skutečnosti tři.",
  "lobby.sharedCards.nodata":
    "Je k tomu potřeba seznam, kteří hrdinové sdílejí kartu, a ten v komunitní databázi zatím není. Doplň dvojice do CARD_PAIRS v scripts/build-catalogue.mjs a volba se zapne.",
  "lobby.collection": "Tvoje sbírka",
  "lobby.collection.summary": "frakcí: {factions}, hrdinů: {heroes}",
  "lobby.collection.all": "Všechny krabice",
  "lobby.collection.none": "Žádné krabice",
  "lobby.mode": "Hrajete na",
  "lobby.mode.local": "Jedné obrazovce",
  "lobby.mode.manual": "Posílaných odkazech",
  "lobby.mode.p2p": "Živě",
  "lobby.mode.local.help":
    "Jeden prohlížeč vede celý stůl. Řekne, kdo je na řadě, a počká, než si ten člověk obrazovku vezme.",
  "lobby.mode.manual.help":
    "Každý dostane svůj odkaz. Zahraj tah, předej nový odkaz dalšímu hráči. Žádný server, žádné účty, funguje i mimo společnou síť.",
  "lobby.mode.p2p.help":
    "Všichni otevřou tentýž odkaz a prohlížeče spolu mluví přímo. Když to síť nedovolí, vrátí se to k posílání odkazů.",
  "lobby.youAre": "Jsi",
  "lobby.tooManyPlayers": "Ve hře je jen {factions} frakcí.",
  "lobby.poolTooBig": "To by chtělo {need} frakcí; na stole jich je {left}.",
  "lobby.tooManyBans": "Tolik banů by nenechalo frakci pro každého z {players} hráčů.",
  "lobby.factionNeeded": "Potřeba k rozdání draftu pro {players} hráčů.",
  "lobby.start": "Spustit draft",
  "lobby.seed": "Seed",
  "lobby.reroll": "Nový seed",
  "lobby.reset": "Obnovit výchozí",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "Hráčů: {players}, frakcí na stole: {left} — rozdáno {need}.",
  "feas.not-enough-factions":
    "{players} hráčů a {bans} banů nechá {left} frakcí. Musí být aspoň jedna na hráče.",
  "feas.faction-pool-too-large":
    "{players} hráčů po {pool} frakcích potřebuje {need} frakcí; na stole jich je {left}. Nejvíc lze rozdat {max} na hráče.",
  "feas.hero-pool-too-large":
    "{faction} má {have} hrdinů, takže po {pool} to rozdat nejde. Nejvíc {max}.",
  "feas.not-enough-heroes": "Hrdinů není dost pro všechny: potřeba {need}, k dispozici {have}.",
  "feas.fix": "Spravit",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Nezačalo",
  "phase.ban": "Bany",
  "phase.pick": "Frakce a hrdina",
  "phase.position": "Místa",
  "phase.banHero": "Bany hrdinů",
  "phase.faction": "Frakce",
  "phase.hero": "Hrdina",
  "phase.done": "Nadraftováno",
  "draft.seat": "Hráč {n}",
  "draft.turn": "Na tahu je {name}",
  "draft.yourTurn": "Jsi na tahu",
  "draft.simultaneous": "Všichni vybírají naráz",
  "draft.waiting": "Čeká se na ostatní",
  "draft.pickFaction": "Vyber frakci",
  "draft.pickHero": "Vyber hrdinu",
  "draft.banPrompt": "Zabanuj frakci",
  "draft.banHeroPrompt": "Zabanuj hrdinu",
  "draft.pickSeat": "Vyber si místo",
  "draft.pickSeat.help": "Pořadí tahů pro samotnou hru",
  "draft.seatFirst": "Začíná",
  "draft.seatNth": "{n}. na tahu",
  "draft.kept": "Nelze zabanovat",
  "draft.bansLeft": "zbývá: {n}",
  "draft.bansProgress": "utraceno {done} z {total}",
  "draft.dealtOne": "Dostal jsi {faction}.",
  "draft.dealtOneHero": "Dostal jsi {hero}.",
  "draft.confirm": "Beru",
  "draft.banned": "Zabanováno",
  "draft.taken": "Obsazeno",
  "draft.undo": "Vrátit poslední tah",
  "draft.undo.shared": "Jen tvůj poslední tah, a jen dokud jsi nepředal odkaz dál.",
  "draft.sending": "Odeslání za {n}…",
  "draft.abandon": "Opustit draft",
  "draft.abandon.confirm": "Opustit? Všechno nadraftované přijde vniveč.",
  "draft.abandon.yes": "Ano, opustit",
  "draft.abandon.no": "Hrát dál",
  "draft.abandon.shared":
    "Tím draft skončí jen tady. Ostatní mají pořád svou kopii a odkaz na téhle stránce ho stále otevírá.",
  "draft.hotseat": "Předej obrazovku: {name}.",
  "draft.handover.copied": "Odkaz pro něj máš ve schránce — vlož ho: {name}.",
  "draft.handover.manual": "Zkopíruj odkaz níže a pošli ho: {name}.",
  "draft.ready": "Mám obrazovku",
  "draft.reveal": "Odkrýt bany",
  "draft.notOffered": "Nikomu rozdáno",
  "draft.stats": "Útok, obrana, síla kouzel a znalosti — {name}",
  "draft.unreplayable":
    "Uložený draft tu nejde přehrát — možná ho zapsala jiná verze téhle stránky. Nový začátek ti zachová nastavení a odkaz nebo kód, který jsi dostal, draft pořád otevře.",
  "draft.unreplayable.reset": "Začít znovu",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Přečíst si o {name} na wiki",
  "wiki.faction": "Přečíst si o {name} na wiki",

  // ----------------------------------------------------------------- result
  "result.heading": "Draft",
  "result.seat": "Místo",
  "result.player": "Hráč",
  "result.faction": "Frakce",
  "result.hero": "Hrdina",
  "result.class": "Třída",
  "result.might": "Síla",
  "result.magic": "Magie",
  "result.copy": "Zkopírovat jako text",
  "result.copied": "Zkopírováno",
  "result.print": "Uložit jako PDF",
  "result.again": "Draftovat znovu",
  "result.newSetup": "Změnit nastavení",
  "result.code": "Kód draftu",
  "result.seed": "Seed",
  "result.bans": "Zabanováno: {factions}",
  "result.heroBans": "Zabanovaní hrdinové: {heroes}",
  "result.nobans": "Bez banů",
  "result.showPassed": "Zobrazit možnosti, které nikdo nevzal",
  "result.alsoOffered": "nabízeno také: {options}",
  "result.specialty": "Specializace",
  "result.ability": "Schopnost",

  // ------------------------------------------------------------------ share
  "share.code": "Kód draftu",
  "share.link": "Odkaz",
  "share.room": "Odkaz na místnost",
  "share.copy": "Kopírovat",
  "share.copied": "Zkopírováno",
  "share.qr": "QR",
  "share.qrLoading": "Kreslí se…",
  "share.qrHelp": "Namiř na to telefon a draft se otevře tam.",
  "share.seatLinks": "Odkazy po hráčích",
  "share.handOver": "Tvůj tah je zapsaný. Pošli tenhle odkaz: {name}.",
  "share.resume": "Pokračovat v draftu",
  "share.paste": "Vlož kód nebo odkaz draftu",
  "share.open": "Otevřít",
  "share.bad": "Takový kód tahle verze přečíst neumí.",
  "share.badCatalogue": "Tenhle kód vznikl s jiným seznamem frakcí.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Které místo je tvoje?",
  "claim.free": "Zatím nic nadraftováno",
  "claim.hidden": "Skryto až do konce",
  "claim.taken": "Tady už někdo je",
  "claim.orHotseat": "Nebo přece jen všichni u jedné obrazovky?",
  "claim.hotseat": "Použít tenhle prohlížeč pro celý stůl",

  // ------------------------------------------------------------------- live
  "live.off": "Nepřipojeno",
  "live.connecting": "Hledám ostatní…",
  "live.online": "Živě",
  "live.failed": "Nepodařilo se připojit",
  "live.with": "s: {names}",
  "live.alone": "zatím tu nikdo další není",
  "live.dismiss": "Zavřít",
  "live.divergence.setup":
    "Někdo v téhle místnosti otevřel jiný draft. Ověřte, že máte všichni stejný odkaz.",
  "live.divergence.state":
    "Tenhle prohlížeč a jiný se na draftu neshodnou. Otevři odkaz znovu a převezmi jejich verzi.",
  "live.divergence.seat": "Na tvém místě sedí dva. Jeden z vás by se měl přesunout.",
  "live.fallback": "Nespojuje se? Posílejte si odkaz — nese celý draft.",
};

export default cs;
