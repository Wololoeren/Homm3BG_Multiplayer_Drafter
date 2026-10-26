import type { Messages } from "./en";

/**
 * Magyar. Minden hiányzó kulcs magától visszaesik az angolra, így a részleges
 * katalógus is tökéletesen jó hozzájárulás — írd be, amit tudsz, a többit
 * hagyd ki.
 */
const hu: Partial<Messages> = {
  "app.title": "Többjátékos draft",
  "app.subtitle": "Heroes of Might & Magic III: a társasjáték",
  "lang.label": "Nyelv",
  "footer.more": "Tetszik, amit csinálok? Nézd meg ezeket is:",
  "footer.cardCreator": "Kártyakészítő",
  "footer.editor": "Küldetésszerkesztő",
  "footer.generator": "Véletlen küldetésgenerátor",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "A draft beállítása",
  "lobby.players": "Játékosok",
  "lobby.format": "Formátum",
  "lobby.format.dealt": "Osztott",
  "lobby.format.snake": "Kígyó",
  "lobby.format.dealt.help":
    "Egyetlen keverés mindenkinek olyan kínálatot ad, amit senki más nem kapott: így mindenki egyszerre választ, és két játékos nem futhat ugyanarra a frakcióra.",
  "lobby.format.snake.help":
    "Körben, egyszerre egy játékos, mindenkinek friss minta abból, ami még szabad. Akkor kell, ha nincs elég frakció ahhoz, hogy mindenkinek valódi választást adjunk.",
  "lobby.factionPool": "Választható frakciók",
  "lobby.heroPool": "Választható hősök",
  "lobby.pool.forced": "nincs választás — a frakciót kiosztjuk",
  "lobby.pool.forcedHero": "nincs választás — a hőst kiosztjuk",
  "lobby.pool.all": "Mind",
  "lobby.pool.all.help":
    "A frakciódnak maradt összes hős. Ahol két játékosnak ugyanaz a személy jutna — Tarnumnak hat frakcióban van lapja — a hőslépés egyesével körbejár az asztalon, nem mindenki egyszerre.",
  "lobby.bans": "Frakciótiltás fejenként",
  "lobby.bans.none": "Nincs",
  "lobby.turns": "Körök",
  "lobby.turns.help": "Hogyan néz ki egy kör, és hogy te döntöd-e el, hol ülsz.",
  "lobby.combined": "Frakció és hős egy körben",
  "lobby.draftSeats": "Az ülésrendet is draftoljuk",
  "lobby.combined.help":
    "A játékos elveszi a frakcióját, majd annak hősét, mielőtt a következő lépne — egyesével körbe. Kikapcsolva: előbb mindenki frakciót draftol, a hősök utána jönnek.",
  "lobby.draftSeats.help":
    "Ha minden más megvan, mindenki a még szabad helyek közül választ. Kikapcsolva: a mag dönt.",
  "lobby.heroBans": "Hőstiltás fejenként",
  "lobby.heroBans.help":
    "Külön körben költik el, a frakciók draftja után — amíg nem tudod, ki mivel játszik, egy hős tiltása találgatás. Az olyan tiltást, ami után valakinek nem maradna mit draftolnia, elutasítjuk.",
  "lobby.heroBans.blindHelp":
    "Ha frakció és hős egy körben jön, nincs olyan pillanat, amikor a városok már ismertek, a hősök viszont még nem — így ezek a tiltások minden más előtt esnek meg. Találgatás, nem olvasás.",
  "lobby.banVisibility": "A tiltások",
  "lobby.banVisibility.open": "Nyíltak",
  "lobby.banVisibility.blind": "Vakok",
  "lobby.banVisibility.open.help": "Egyesével, mindenki szeme láttára.",
  "lobby.banVisibility.blind.help":
    "Mindenki egyszerre tilt, és a tiltások együtt fordulnak fel. Két játékos is költhet tiltást ugyanarra a hősre vagy frakcióra, az mégis csak egyszer kerül ki. Mindkét tiltókörre vonatkozik.",
  "lobby.during": "A draft alatt",
  "lobby.conceal": "A választások maradjanak rejtve a végéig",
  "lobby.conceal.help":
    "Senki sem látja, ki mit draftolt vagy tiltott, egészen a záró lapig — egy képernyő körül ez azt jelenti, hogy a körök között senki sem lát semmit. Ami már elment, az továbbra is látszik a táblán, hiszen elvenni úgysem lehet.",
  "lobby.heroRule": "A hősök innen jönnek",
  "lobby.heroRule.own": "A saját frakciódból",
  "lobby.heroRule.unique-faction": "Bármelyikből, egy-egy",
  "lobby.heroRule.any": "Bárhonnan",
  "lobby.heroRule.own.help": "A hős, akit draftolsz, ahhoz a frakcióhoz tartozik, amit draftoltál.",
  "lobby.heroRule.unique-faction.help":
    "A hősöd jöhet olyan frakcióból, amit nem draftoltál, de két játékos hőse nem oszthat közös anyafrakciót.",
  "lobby.heroRule.any.help": "Bármelyik hős bármelyik frakcióból.",
  "lobby.uniqueIdentity": "Minden hősből egy",
  "lobby.uniqueIdentity.help":
    "Tarnumnak hat frakcióban van lapja, Lord Haartnak kettőben. Ezzel bekapcsolva csak egy játékos lehet Tarnum.",
  "lobby.otherTowns": "A hős jöhet másik játékos városából",
  "lobby.otherTowns.combined":
    "Mindig bekapcsolva, ha frakció és hős egy körben megy: az első játékos előbb vesz hőst, mint ahogy a másodiknak városa lenne, így még nincs másik város, amitől távol kellene maradni.",
  "lobby.sharedCards": "Egy lap, két hős",
  "lobby.sharedCards.help":
    "A hőslapok kétoldalasak, így az egyik oldal draftolásával az egész lap elkel, és a hátoldal hőse vele megy. A tiltás nem ilyen — az a hőst viszi, nem a lapot. Majdnem minden pár azonos várost oszt, ezért ez ritkán fáj, hacsak nem lehet frakción kívülről hőst draftolni; a kivétel Tarnum, akinek hat lapja valójában három.",
  "lobby.sharedCards.nodata":
    "Ehhez kell a lista arról, mely hősök osztoznak egy lapon, és ez még nincs benne a közösségi adatbázisban. Írd be a párokat a CARD_PAIRS listába a scripts/build-catalogue.mjs fájlban, és ez bekapcsol.",
  "lobby.collection": "A gyűjteményed",
  "lobby.collection.summary": "{factions} frakció, {heroes} hős",
  "lobby.collection.all": "Minden doboz",
  "lobby.collection.none": "Egy doboz sem",
  "lobby.mode": "Ezen játszotok",
  "lobby.mode.local": "Egy képernyőn",
  "lobby.mode.manual": "Továbbadott linkeken",
  "lobby.mode.p2p": "Élőben",
  "lobby.mode.local.help":
    "Egyetlen böngésző viszi az egész asztalt. Megmondja, ki jön, és megvárja, hogy az illető kézbe vegye a képernyőt.",
  "lobby.mode.manual.help":
    "Mindenki saját linket kap. Lépsz, majd az új linket továbbadod a következőnek. Nincs szerver, nincs fiók, és akkor is megy, ha nem vagytok egy hálózaton.",
  "lobby.mode.p2p.help":
    "Mindenki ugyanazt a linket nyitja meg, és a böngészők közvetlenül beszélgetnek. Ha a hálózat nem engedi, visszavált a linkek továbbadására.",
  "lobby.youAre": "Te vagy",
  "lobby.tooManyPlayers": "Mindössze {factions} frakció van játékban.",
  "lobby.poolTooBig": "Ehhez {need} frakció kellene; {left} van az asztalon.",
  "lobby.tooManyBans": "Ennyi tiltás nem hagyna frakciót mind a(z) {players} játékosnak.",
  "lobby.factionNeeded": "Kell ahhoz, hogy {players} játékosnak lehessen draftot osztani.",
  "lobby.start": "Draft indítása",
  "lobby.seed": "Mag",
  "lobby.reroll": "Új mag",
  "lobby.reset": "Alapértelmezések visszaállítása",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} játékos, {left} frakció az asztalon — ebből {need} kerül kiosztásra.",
  "feas.not-enough-factions":
    "{players} játékos és {bans} tiltás után {left} frakció marad. Játékosonként legalább egy kell.",
  "feas.faction-pool-too-large":
    "{players} játékos fejenként {pool} frakcióval {need} frakciót igényel; {left} van az asztalon. Legfeljebb {max} osztható ki fejenként.",
  "feas.hero-pool-too-large":
    "{faction} frakciónak {have} hőse van, így fejenként {pool} nem osztható ki. A maximum {max}.",
  "feas.not-enough-heroes": "Nincs elég hős mindenkinek: {need} kellene, {have} érhető el.",
  "feas.fix": "Javítás",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Nem indult el",
  "phase.ban": "Tiltások",
  "phase.pick": "Frakció és hős",
  "phase.position": "Ülésrend",
  "phase.banHero": "Hőstiltások",
  "phase.faction": "Frakció",
  "phase.hero": "Hős",
  "phase.done": "Kész a draft",
  "draft.seat": "{n}. játékos",
  "draft.turn": "{name} következik",
  "draft.yourTurn": "Te jössz",
  "draft.simultaneous": "Mindenki egyszerre választ",
  "draft.waiting": "Várunk a többiekre",
  "draft.pickFaction": "Válassz frakciót",
  "draft.pickHero": "Válassz hőst",
  "draft.banPrompt": "Tilts ki egy frakciót",
  "draft.banHeroPrompt": "Tilts ki egy hőst",
  "draft.pickSeat": "Válaszd ki, hol ülsz",
  "draft.pickSeat.help": "A körsorrend magához a játékhoz",
  "draft.seatFirst": "Ő kezd",
  "draft.seatNth": "{n}. a sorban",
  "draft.kept": "Nem tiltható ki",
  "draft.bansLeft": "{n} maradt",
  "draft.bansProgress": "{done} / {total} elköltve",
  "draft.dealtOne": "{faction} jutott neked.",
  "draft.dealtOneHero": "{hero} jutott neked.",
  "draft.confirm": "Elfogadom",
  "draft.banned": "Kitiltva",
  "draft.taken": "Foglalt",
  "draft.undo": "Utolsó lépés visszavonása",
  "draft.undo.shared": "Csak a saját utolsó lépésed, amíg nem adtad tovább a linket.",
  "draft.sending": "Küldés {n} múlva…",
  "draft.abandon": "Draft feladása",
  "draft.abandon.confirm": "Feladod? Minden eddigi draftolás elvész.",
  "draft.abandon.yes": "Igen, feladom",
  "draft.abandon.no": "Játszunk tovább",
  "draft.abandon.shared":
    "Ez csak itt zárja le a draftot. A többieknél megmarad a saját másolatuk, és az ezen az oldalon lévő link továbbra is megnyitja.",
  "draft.hotseat": "Add át a képernyőt: {name}.",
  "draft.handover.copied": "A linkje a vágólapodon van — illeszd be neki: {name}.",
  "draft.handover.manual": "Másold ki az alábbi linket, és küldd el neki: {name}.",
  "draft.ready": "Nálam a képernyő",
  "draft.reveal": "Tiltások felfedése",
  "draft.notOffered": "Senkinek sem osztottuk",
  "draft.stats": "{name} támadása, védelme, varázsereje és tudása",
  "draft.unreplayable":
    "A mentett draft itt nem játszható vissza — lehet, hogy az oldal másik változata írta. Az újrakezdés megtartja a beállításaidat, és a kapott link vagy kód továbbra is megnyitja magát a draftot.",
  "draft.unreplayable.reset": "Kezdjük újra",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Olvass {name} hősről a wikin",
  "wiki.faction": "Olvass a(z) {name} frakcióról a wikin",

  // ----------------------------------------------------------------- result
  "result.heading": "A draft",
  "result.seat": "Hely",
  "result.player": "Játékos",
  "result.faction": "Frakció",
  "result.hero": "Hős",
  "result.class": "Osztály",
  "result.might": "Erő",
  "result.magic": "Mágia",
  "result.copy": "Másolás szövegként",
  "result.copied": "Másolva",
  "result.print": "Mentés PDF-be",
  "result.again": "Új draft",
  "result.newSetup": "Beállítások módosítása",
  "result.code": "Draftkód",
  "result.seed": "Mag",
  "result.bans": "Kitiltva: {factions}",
  "result.heroBans": "Kitiltott hősök: {heroes}",
  "result.nobans": "Nincs tiltás",
  "result.showPassed": "Mutasd a nem választott lehetőségeket",
  "result.alsoOffered": "felajánlva még: {options}",
  "result.specialty": "Szakterület",
  "result.ability": "Képesség",

  // ------------------------------------------------------------------ share
  "share.code": "Draftkód",
  "share.link": "Link",
  "share.room": "Szobalink",
  "share.copy": "Másolás",
  "share.copied": "Másolva",
  "share.qr": "QR",
  "share.qrLoading": "Rajzolom…",
  "share.qrHelp": "Irányíts rá egy telefont, és ott nyílik meg a draft.",
  "share.seatLinks": "Linkek játékosonként",
  "share.handOver": "A lépésed megvan. Küldd el ezt a linket neki: {name}.",
  "share.resume": "Draft folytatása",
  "share.paste": "Illessz be draftkódot vagy linket",
  "share.open": "Megnyitás",
  "share.bad": "Ezt a kódot ez a változat nem tudja elolvasni.",
  "share.badCatalogue": "Ez a kód más frakciólistával készült.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Melyik hely a tiéd?",
  "claim.free": "Még nem draftolt semmit",
  "claim.hidden": "Rejtve a végéig",
  "claim.taken": "Itt már ül valaki",
  "claim.orHotseat": "Inkább mindenki egy képernyő köré?",
  "claim.hotseat": "Ez a böngésző vigye az egész asztalt",

  // ------------------------------------------------------------------- live
  "live.off": "Nincs kapcsolat",
  "live.connecting": "Keresem a többieket…",
  "live.online": "Élő",
  "live.failed": "Nem sikerült csatlakozni",
  "live.with": "velük: {names}",
  "live.alone": "még senki más nincs itt",
  "live.dismiss": "Bezárás",
  "live.divergence.setup":
    "Valaki ebben a szobában másik draftot nyitott meg. Nézzétek meg, hogy mindenkinél ugyanaz a link van-e.",
  "live.divergence.state":
    "Ez a böngésző és egy másik nem ért egyet a draftról. Nyisd meg újra a linket, hogy az ő változatukat vedd át.",
  "live.divergence.seat": "Ketten ülnek a helyeden. Egyikőtöknek arrébb kellene ülnie.",
  "live.fallback": "Nem áll össze a kapcsolat? Adjátok körbe a linket — az egész draftot viszi.",
};

export default hu;
