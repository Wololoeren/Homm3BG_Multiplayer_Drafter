import type { Messages } from "./en";

/**
 * Dansk. Hver manglende nøgle falder selv tilbage på engelsk, så et halvt
 * katalog er et helt fint bidrag — skriv de linjer du kender, og lad resten
 * stå tomme.
 */
const da: Partial<Messages> = {
  "app.title": "Multiplayer-draft",
  "app.subtitle": "Heroes of Might & Magic III: Brætspillet",
  "lang.label": "Sprog",
  "footer.more": "Kan du lide mit arbejde? Så kig på:",
  "footer.cardCreator": "Kortværksted",
  "footer.editor": "Scenarieeditor",
  "footer.generator": "Tilfældig scenariegenerator",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Sæt draften op",
  "lobby.players": "Spillere",
  "lobby.format": "Format",
  "lobby.format.dealt": "Uddelt",
  "lobby.format.snake": "Slange",
  "lobby.format.dealt.help":
    "Én blanding giver hver spiller et udvalg, ingen anden fik, så alle vælger på samme tid, og to spillere kan ikke lande på samme fraktion.",
  "lobby.format.snake.help":
    "Tur for tur, én spiller ad gangen, hver med en frisk stikprøve af det, der stadig er frit. Brug det, når der ikke er fraktioner nok til at give alle et rigtigt valg.",
  "lobby.factionPool": "Fraktioner at vælge mellem",
  "lobby.heroPool": "Helte at vælge mellem",
  "lobby.pool.forced": "intet valg — fraktionen bliver uddelt",
  "lobby.pool.forcedHero": "intet valg — helten bliver uddelt",
  "lobby.pool.all": "Alle",
  "lobby.pool.all.help":
    "Alle de helte, din fraktion har tilbage. Hvor to spillere kunne få samme person tilbudt — Tarnum har et kort i seks fraktioner — går helte-trinnet rundt om bordet én ad gangen i stedet for alle på én gang.",
  "lobby.bans": "Fraktionsbans hver",
  "lobby.bans.none": "Ingen",
  "lobby.turns": "Ture",
  "lobby.turns.help": "Hvordan en tur ser ud, og om pladsen ved bordet er dit valg.",
  "lobby.combined": "Fraktion og helt i samme tur",
  "lobby.draftSeats": "Draft også pladsernes rækkefølge",
  "lobby.combined.help":
    "En spiller tager sin fraktion og derefter dens helt, før den næste rykker — én ad gangen rundt om bordet. Slået fra: først drafter alle fraktioner, helte bagefter.",
  "lobby.draftSeats.help":
    "Når alt andet er draftet, vælger hver spiller plads blandt dem, der stadig er ledige. Slået fra: det afgør frøet.",
  "lobby.heroBans": "Helte-bans hver",
  "lobby.heroBans.help":
    "Bruges i en runde for sig, efter fraktionerne er draftet — indtil du ved, hvem der spiller hvad, er det gætteri at banne en helt. Et ban, der ville efterlade nogen uden noget at drafte, bliver afvist.",
  "lobby.heroBans.blindHelp":
    "Med fraktion og helt i samme tur findes der ikke et øjeblik, hvor byerne er kendte og heltene ikke er — så disse bans falder, før noget som helst er draftet. Gæt, ikke aflæsning.",
  "lobby.banVisibility": "Bans er",
  "lobby.banVisibility.open": "Åbne",
  "lobby.banVisibility.blind": "Blinde",
  "lobby.banVisibility.open.help": "Ét ad gangen, mens alle ser på.",
  "lobby.banVisibility.blind.help":
    "Alle banner på samme tid, og de bliver vendt samtidig. To spillere må gerne bruge et ban på samme helt eller fraktion, og den ryger kun ud én gang. Gælder begge ban-runder.",
  "lobby.during": "Undervejs i draften",
  "lobby.conceal": "Hold valgene skjult til det sidste",
  "lobby.conceal.help":
    "Ingen ser, hvad de andre har draftet eller bannet, før arket til sidst — om én skærm betyder det, at ingen ser noget som helst mellem turene. Det, der allerede er væk, står stadig på brættet, for det kan du jo ikke tage.",
  "lobby.heroRule": "Helte kommer fra",
  "lobby.heroRule.own": "Din egen fraktion",
  "lobby.heroRule.unique-faction": "Hvilken som helst, én hver",
  "lobby.heroRule.any": "Hvor som helst",
  "lobby.heroRule.own.help": "Den helt, du drafter, hører til den fraktion, du draftede.",
  "lobby.heroRule.unique-faction.help":
    "Din helt må komme fra en fraktion, du ikke draftede, men to spilleres helte må ikke dele hjemfraktion.",
  "lobby.heroRule.any.help": "En hvilken som helst helt fra en hvilken som helst fraktion.",
  "lobby.uniqueIdentity": "Én af hver helt",
  "lobby.uniqueIdentity.help":
    "Tarnum har et kort i seks fraktioner og Lord Haart i to. Med denne slået til kan kun én spiller være Tarnum.",
  "lobby.otherTowns": "Helte må komme fra en anden spillers by",
  "lobby.otherTowns.combined":
    "Altid slået til, når fraktion og helt går i samme tur: den første spiller tager en helt, før den næste har en by, så der er endnu ingen anden by at holde sig fra.",
  "lobby.sharedCards": "Ét kort, to helte",
  "lobby.sharedCards.help":
    "Heltekort er dobbeltsidede, så drafter man den ene side, tager man hele kortet, og helten på bagsiden følger med. Et ban gør ikke — det tager helten, ikke kortet. Næsten hvert par deler by, så det bider sjældent, medmindre helte må draftes uden for fraktionen; undtagelsen er Tarnum, hvis seks kort i virkeligheden er tre.",
  "lobby.sharedCards.nodata":
    "Det kræver listen over, hvilke helte der deler kort, og den er endnu ikke i fællesskabets database. Skriv parrene ind i CARD_PAIRS i scripts/build-catalogue.mjs, så tænder den her.",
  "lobby.collection": "Din samling",
  "lobby.collection.summary": "{factions} fraktioner, {heroes} helte",
  "lobby.collection.all": "Alle æsker",
  "lobby.collection.none": "Ingen æsker",
  "lobby.mode": "I spiller på",
  "lobby.mode.local": "Én skærm",
  "lobby.mode.manual": "Delte links",
  "lobby.mode.p2p": "Live",
  "lobby.mode.local.help":
    "Én browser kører hele bordet. Den siger, hvem der er næste, og venter på, at vedkommende tager skærmen.",
  "lobby.mode.manual.help":
    "Alle får deres eget link. Lav dit træk, og giv det nye link videre til den næste. Ingen server, ingen konti, og det virker, selv om I ikke er på samme netværk.",
  "lobby.mode.p2p.help":
    "Alle åbner det samme link, og browserne taler direkte sammen. Falder tilbage til at sende links rundt, hvis netværket spærrer.",
  "lobby.youAre": "Du er",
  "lobby.tooManyPlayers": "Der er kun {factions} fraktioner i spil.",
  "lobby.poolTooBig": "Det ville kræve {need} fraktioner; der er {left} på bordet.",
  "lobby.tooManyBans": "Så mange bans ville ikke levne en fraktion til hver af de {players} spillere.",
  "lobby.factionNeeded": "Nødvendig for at dele en draft ud til {players} spillere.",
  "lobby.start": "Start draften",
  "lobby.seed": "Frø",
  "lobby.reroll": "Nyt frø",
  "lobby.reset": "Nulstil til standard",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} spillere, {left} fraktioner på bordet — {need} af dem deles ud.",
  "feas.not-enough-factions":
    "{players} spillere og {bans} bans levner {left} fraktioner. Der skal være mindst én til hver spiller.",
  "feas.faction-pool-too-large":
    "{players} spillere med {pool} fraktioner hver kræver {need} fraktioner; der er {left} på bordet. Der kan højst deles {max} ud til hver.",
  "feas.hero-pool-too-large":
    "{faction} har {have} helte, så {pool} til hver kan ikke lade sig gøre. Højst {max}.",
  "feas.not-enough-heroes": "Der er ikke helte nok til alle: {need} kræves, {have} til rådighed.",
  "feas.fix": "Ret det",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Ikke begyndt",
  "phase.ban": "Bans",
  "phase.pick": "Fraktion og helt",
  "phase.position": "Pladser",
  "phase.banHero": "Helte-bans",
  "phase.faction": "Fraktion",
  "phase.hero": "Helt",
  "phase.done": "Draftet",
  "draft.seat": "Spiller {n}",
  "draft.turn": "{name} er på tur",
  "draft.yourTurn": "Din tur",
  "draft.simultaneous": "Alle vælger på én gang",
  "draft.waiting": "Venter på de andre",
  "draft.pickFaction": "Vælg en fraktion",
  "draft.pickHero": "Vælg en helt",
  "draft.banPrompt": "Ban en fraktion",
  "draft.banHeroPrompt": "Ban en helt",
  "draft.pickSeat": "Vælg hvor du sidder",
  "draft.pickSeat.help": "Turrækkefølgen i selve spillet",
  "draft.seatFirst": "Starter",
  "draft.seatNth": "{n}. på tur",
  "draft.kept": "Kan ikke bannes",
  "draft.bansLeft": "{n} tilbage",
  "draft.bansProgress": "{done} af {total} brugt",
  "draft.dealtOne": "Du fik {faction}.",
  "draft.dealtOneHero": "Du fik {hero}.",
  "draft.confirm": "Den tager jeg",
  "draft.banned": "Bannet",
  "draft.taken": "Optaget",
  "draft.undo": "Fortryd sidste træk",
  "draft.abandon": "Forlad draften",
  "draft.abandon.confirm": "Forlade den? Alt det draftede går tabt.",
  "draft.abandon.yes": "Ja, forlad",
  "draft.abandon.no": "Spil videre",
  "draft.abandon.shared":
    "Det afslutter kun draften her. Alle andre har stadig deres kopi, og linket på denne side åbner den stadig.",
  "draft.hotseat": "Giv skærmen videre til {name}.",
  "draft.handover.copied": "Linket ligger i din udklipsholder — sæt det ind til {name}.",
  "draft.handover.manual": "Kopier linket nedenfor og send det til {name}.",
  "draft.ready": "Jeg har skærmen",
  "draft.reveal": "Vend alle bans",
  "draft.notOffered": "Ikke delt ud til nogen",
  "draft.stats": "{name}s angreb, forsvar, trolddomskraft og viden",
  "draft.unreplayable":
    "Den gemte draft kan ikke spilles igennem her — den er måske skrevet af en anden version af siden. Starter du forfra, beholder du dine indstillinger, og et link eller en kode, du har fået, åbner stadig selve draften.",
  "draft.unreplayable.reset": "Start forfra",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Læs om {name} på wikien",
  "wiki.faction": "Læs om {name} på wikien",

  // ----------------------------------------------------------------- result
  "result.heading": "Draften",
  "result.seat": "Plads",
  "result.player": "Spiller",
  "result.faction": "Fraktion",
  "result.hero": "Helt",
  "result.class": "Klasse",
  "result.might": "Styrke",
  "result.magic": "Magi",
  "result.copy": "Kopier som tekst",
  "result.copied": "Kopieret",
  "result.print": "Gem som PDF",
  "result.again": "Draft igen",
  "result.newSetup": "Ret opsætningen",
  "result.code": "Draftkode",
  "result.seed": "Frø",
  "result.bans": "Bannet: {factions}",
  "result.heroBans": "Bannede helte: {heroes}",
  "result.nobans": "Ingen bans",
  "result.showPassed": "Vis de valg, ingen tog",
  "result.alsoOffered": "også tilbudt: {options}",
  "result.specialty": "Speciale",
  "result.ability": "Evne",

  // ------------------------------------------------------------------ share
  "share.code": "Draftkode",
  "share.link": "Link",
  "share.room": "Rumlink",
  "share.copy": "Kopier",
  "share.copied": "Kopieret",
  "share.qr": "QR",
  "share.qrLoading": "Tegner den…",
  "share.qrHelp": "Hold en telefon op foran den for at åbne draften der.",
  "share.seatLinks": "Links pr. spiller",
  "share.handOver": "Dit træk er registreret. Send dette link til {name}.",
  "share.resume": "Genoptag en draft",
  "share.paste": "Indsæt en draftkode eller et link",
  "share.open": "Åbn",
  "share.bad": "Den kode kan denne version ikke læse.",
  "share.badCatalogue": "Den kode er lavet med en anden fraktionsliste.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Hvilken plads er din?",
  "claim.free": "Har ikke draftet noget endnu",
  "claim.hidden": "Skjult til det sidste",
  "claim.taken": "Der sidder allerede nogen",
  "claim.orHotseat": "Skal I hellere samles om én skærm?",
  "claim.hotseat": "Brug denne browser til hele bordet",

  // ------------------------------------------------------------------- live
  "live.off": "Ikke forbundet",
  "live.connecting": "Leder efter de andre…",
  "live.online": "Live",
  "live.failed": "Kunne ikke forbinde",
  "live.with": "med {names}",
  "live.alone": "der er ikke andre her endnu",
  "live.dismiss": "Luk",
  "live.divergence.setup":
    "Nogen i rummet har åbnet en anden draft. Tjek, at I alle sammen er på det samme link.",
  "live.divergence.state":
    "Denne browser og en anden er uenige om draften. Åbn linket igen for at overtage deres version.",
  "live.divergence.seat": "Der sidder to på din plads. En af jer bør flytte sig.",
  "live.fallback": "Forbinder den ikke? Send linket rundt i stedet — det bærer hele draften.",
};

export default da;
