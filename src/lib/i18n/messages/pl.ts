import type { Messages } from "./en";

/**
 * Polski. Każdy brakujący klucz sam wraca do angielskiego, więc niepełny
 * katalog też jest dobrym wkładem — dopisz to, co wiesz, resztę zostaw.
 */
const pl: Partial<Messages> = {
  "app.title": "Draft wieloosobowy",
  "app.subtitle": "Heroes of Might & Magic III: Gra planszowa",
  "lang.label": "Język",
  "footer.more": "Podoba Ci się? Zobacz też:",
  "footer.cardCreator": "Kreator kart",
  "footer.editor": "Edytor scenariuszy",
  "footer.generator": "Losowy generator scenariuszy",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Ustaw draft",
  "lobby.players": "Gracze",
  "lobby.format": "Format",
  "lobby.format.dealt": "Rozdanie",
  "lobby.format.snake": "Wąż",
  "lobby.format.dealt.help":
    "Jedno tasowanie daje każdemu graczowi pulę, której nikt inny nie dostał, więc wszyscy wybierają naraz i dwie osoby nie mogą trafić na tę samą frakcję.",
  "lobby.format.snake.help":
    "Kolejka, jeden gracz naraz, każdy dostaje świeżą próbkę z tego, co jeszcze wolne. Przydaje się, gdy frakcji nie starcza, by dać każdemu prawdziwy wybór.",
  "lobby.factionPool": "Frakcje do wyboru",
  "lobby.heroPool": "Bohaterowie do wyboru",
  "lobby.pool.forced": "bez wyboru — frakcja jest rozdana",
  "lobby.pool.forcedHero": "bez wyboru — bohater jest rozdany",
  "lobby.pool.all": "Wszyscy",
  "lobby.pool.all.help":
    "Wszyscy bohaterowie, jacy zostali Twojej frakcji. Tam, gdzie dwóm graczom mogłaby trafić się ta sama postać — Tarnum ma kartę w sześciu frakcjach — etap bohaterów idzie wokół stołu po kolei zamiast naraz.",
  "lobby.bans": "Bany frakcji",
  "lobby.bans.none": "Brak",
  "lobby.turns": "Tury",
  "lobby.turns.help": "Jak wygląda tura i czy miejsce przy stole jest Twoim wyborem.",
  "lobby.combined": "Frakcja i bohater w jednej turze",
  "lobby.draftSeats": "Draftuj kolejność miejsc",
  "lobby.combined.help":
    "Gracz bierze swoją frakcję, a potem jej bohatera, zanim ruszy się następny — po kolei wokół stołu. Wyłączone: najpierw wszyscy draftują frakcje, potem bohaterów.",
  "lobby.draftSeats.help":
    "Gdy reszta jest już wydraftowana, każdy wybiera miejsce spośród jeszcze wolnych. Wyłączone: decyduje ziarno.",
  "lobby.heroBans": "Bany bohaterów",
  "lobby.heroBans.help":
    "Wydawane w osobnej rundzie, po draftcie frakcji — póki nie wiesz, kto czym gra, ban bohatera to zgadywanka. Ban, po którym ktoś nie miałby czego wziąć, zostaje odrzucony.",
  "lobby.heroBans.blindHelp":
    "Gdy frakcja i bohater idą w jednej turze, nie ma momentu, w którym miasta są znane, a bohaterowie jeszcze nie — więc te bany padają przed czymkolwiek innym. To zgadywanka, nie odczyt.",
  "lobby.banVisibility": "Bany są",
  "lobby.banVisibility.open": "Jawne",
  "lobby.banVisibility.blind": "W ciemno",
  "lobby.banVisibility.open.help": "Po jednym, na oczach wszystkich.",
  "lobby.banVisibility.blind.help":
    "Wszyscy banują naraz i bany odsłaniane są razem. Dwóch graczy może wydać ban na tego samego bohatera lub tę samą frakcję — i tak zniknie tylko raz. Dotyczy obu rund banów.",
  "lobby.during": "W trakcie draftu",
  "lobby.conceal": "Ukryj wybory do samego końca",
  "lobby.conceal.help":
    "Nikt nie widzi, co inni wydraftowali lub zbanowali, aż do arkusza na końcu — przy jednym ekranie znaczy to, że między turami nikt nie widzi niczego. To, co już przepadło, nadal widać na planszy, bo tego nie da się wziąć.",
  "lobby.heroRule": "Bohaterowie pochodzą z",
  "lobby.heroRule.own": "Własnej frakcji",
  "lobby.heroRule.unique-faction": "Dowolnej, po jednej",
  "lobby.heroRule.any": "Skądkolwiek",
  "lobby.heroRule.own.help": "Bohater, którego bierzesz, należy do frakcji, którą wziąłeś.",
  "lobby.heroRule.unique-faction.help":
    "Twój bohater może pochodzić z frakcji, której nie wziąłeś, ale bohaterowie dwóch graczy nie mogą mieć tej samej frakcji rodzimej.",
  "lobby.heroRule.any.help": "Dowolny bohater z dowolnej frakcji.",
  "lobby.uniqueIdentity": "Każdy bohater raz",
  "lobby.uniqueIdentity.help":
    "Tarnum ma kartę w sześciu frakcjach, a Lord Haart w dwóch. Z tym włączonym tylko jeden gracz może być Tarnumem.",
  "lobby.otherTowns": "Bohater może pochodzić z miasta innego gracza",
  "lobby.otherTowns.combined":
    "Zawsze włączone przy frakcji i bohaterze w jednej turze: pierwszy gracz bierze bohatera, zanim drugi ma miasto, więc nie ma jeszcze od czego się trzymać z daleka.",
  "lobby.sharedCards": "Jedna karta, dwóch bohaterów",
  "lobby.sharedCards.help":
    "Karty bohaterów są dwustronne, więc wzięcie jednej strony zabiera całą kartę, a bohater z rewersu znika razem z nią. Ban już nie — ban zabiera bohatera, nie kartę. Prawie każda para dzieli miasto, więc rzadko to boli, chyba że bohaterów można brać spoza frakcji; wyjątkiem jest Tarnum, którego sześć kart to w istocie trzy.",
  "lobby.sharedCards.nodata":
    "Potrzebna jest lista, którzy bohaterowie dzielą kartę — nie ma jej jeszcze w bazie społeczności. Dopisz pary do CARD_PAIRS w scripts/build-catalogue.mjs, a to się włączy.",
  "lobby.collection": "Twoja kolekcja",
  "lobby.collection.summary": "frakcje: {factions}, bohaterowie: {heroes}",
  "lobby.collection.all": "Wszystkie pudełka",
  "lobby.collection.none": "Żadnych pudełek",
  "lobby.mode": "Gracie na",
  "lobby.mode.local": "Jednym ekranie",
  "lobby.mode.manual": "Przesyłanych linkach",
  "lobby.mode.p2p": "Żywo",
  "lobby.mode.local.help":
    "Jedna przeglądarka prowadzi cały stół. Mówi, kto następny, i czeka, aż ta osoba weźmie ekran.",
  "lobby.mode.manual.help":
    "Każdy dostaje własny link. Wykonaj ruch, podaj nowy link następnemu graczowi. Bez serwera, bez kont, działa nawet poza wspólną siecią.",
  "lobby.mode.p2p.help":
    "Wszyscy otwierają ten sam link, a przeglądarki rozmawiają ze sobą bezpośrednio. Gdy sieć na to nie pozwoli, wraca do przesyłania linków.",
  "lobby.youAre": "Jesteś",
  "lobby.tooManyPlayers": "W grze są tylko frakcje: {factions}.",
  "lobby.poolTooBig": "To wymagałoby {need} frakcji; na stole jest {left}.",
  "lobby.tooManyBans": "Tyle banów nie zostawiłoby frakcji dla każdego z {players} graczy.",
  "lobby.factionNeeded": "Potrzebna, by rozdać draft {players} graczom.",
  "lobby.start": "Zacznij draft",
  "lobby.seed": "Ziarno",
  "lobby.reroll": "Nowe ziarno",
  "lobby.reset": "Przywróć domyślne",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "Gracze: {players}, frakcje na stole: {left} — rozdanych {need}.",
  "feas.not-enough-factions":
    "{players} graczy i {bans} banów zostawia {left} frakcji. Musi być co najmniej jedna na gracza.",
  "feas.faction-pool-too-large":
    "{players} graczy po {pool} frakcji wymaga {need} frakcji; na stole jest {left}. Najwięcej, ile da się rozdać, to {max} na gracza.",
  "feas.hero-pool-too-large":
    "{faction} ma {have} bohaterów, więc nie da się rozdać po {pool}. Najwięcej to {max}.",
  "feas.not-enough-heroes": "Bohaterów nie starcza dla wszystkich: potrzeba {need}, dostępnych {have}.",
  "feas.fix": "Napraw",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Nie zaczęto",
  "phase.ban": "Bany",
  "phase.pick": "Frakcja i bohater",
  "phase.position": "Miejsca",
  "phase.banHero": "Bany bohaterów",
  "phase.faction": "Frakcja",
  "phase.hero": "Bohater",
  "phase.done": "Wydraftowano",
  "draft.seat": "Gracz {n}",
  "draft.turn": "Ruch: {name}",
  "draft.yourTurn": "Twój ruch",
  "draft.simultaneous": "Wszyscy wybierają naraz",
  "draft.waiting": "Czekamy na pozostałych",
  "draft.pickFaction": "Wybierz frakcję",
  "draft.pickHero": "Wybierz bohatera",
  "draft.banPrompt": "Zbanuj frakcję",
  "draft.banHeroPrompt": "Zbanuj bohatera",
  "draft.pickSeat": "Wybierz swoje miejsce",
  "draft.pickSeat.help": "Kolejność tur w samej grze",
  "draft.seatFirst": "Zaczyna",
  "draft.seatNth": "{n}. w kolejności",
  "draft.kept": "Nie można zbanować",
  "draft.bansLeft": "pozostało: {n}",
  "draft.bansProgress": "wydano {done} z {total}",
  "draft.dealtOne": "Dostajesz: {faction}.",
  "draft.dealtOneHero": "Dostajesz: {hero}.",
  "draft.confirm": "Biorę",
  "draft.banned": "Zbanowana",
  "draft.taken": "Zajęte",
  "draft.undo": "Cofnij ruch",
  "draft.abandon": "Porzuć draft",
  "draft.abandon.confirm": "Porzucić? Wszystko, co wydraftowano, przepadnie.",
  "draft.abandon.yes": "Tak, porzuć",
  "draft.abandon.no": "Graj dalej",
  "draft.abandon.shared":
    "To kończy draft tylko tutaj. Każdy inny wciąż ma swoją kopię, a link na tej stronie nadal go otwiera.",
  "draft.hotseat": "Podaj ekran: {name}.",
  "draft.handover.copied": "Link dla tej osoby jest w schowku — wklej go: {name}.",
  "draft.handover.manual": "Skopiuj link poniżej i wyślij go: {name}.",
  "draft.ready": "Mam ekran",
  "draft.reveal": "Odsłoń bany",
  "draft.notOffered": "Nikomu nie rozdano",
  "draft.stats": "Atak, obrona, moc i wiedza — {name}",
  "draft.unreplayable":
    "Zapisany draft nie da się tu odtworzyć — mógł powstać w innej wersji tej strony. Zaczynając od nowa zachowasz swoje ustawienia, a otrzymany link lub kod nadal otworzy sam draft.",
  "draft.unreplayable.reset": "Zacznij od nowa",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Przeczytaj o {name} na wiki",
  "wiki.faction": "Przeczytaj o {name} na wiki",

  // ----------------------------------------------------------------- result
  "result.heading": "Draft",
  "result.seat": "Miejsce",
  "result.player": "Gracz",
  "result.faction": "Frakcja",
  "result.hero": "Bohater",
  "result.class": "Klasa",
  "result.might": "Siła",
  "result.magic": "Magia",
  "result.copy": "Kopiuj jako tekst",
  "result.copied": "Skopiowano",
  "result.print": "Zapisz jako PDF",
  "result.again": "Draftuj jeszcze raz",
  "result.newSetup": "Zmień ustawienia",
  "result.code": "Kod draftu",
  "result.bans": "Zbanowane: {factions}",
  "result.heroBans": "Zbanowani bohaterowie: {heroes}",
  "result.nobans": "Bez banów",
  "result.specialty": "Specjalizacja",
  "result.ability": "Zdolność",

  // ------------------------------------------------------------------ share
  "share.code": "Kod draftu",
  "share.link": "Link",
  "share.room": "Link do pokoju",
  "share.copy": "Kopiuj",
  "share.copied": "Skopiowano",
  "share.qr": "QR",
  "share.qrLoading": "Rysuję…",
  "share.qrHelp": "Skieruj na to telefon, by otworzyć tam draft.",
  "share.seatLinks": "Linki dla graczy",
  "share.handOver": "Twój ruch zapisany. Wyślij ten link: {name}.",
  "share.resume": "Wznów draft",
  "share.paste": "Wklej kod lub link draftu",
  "share.open": "Otwórz",
  "share.bad": "Tej wersji kodu ta strona nie potrafi odczytać.",
  "share.badCatalogue": "Ten kod powstał przy innej liście frakcji.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Które miejsce jest Twoje?",
  "claim.free": "Nic jeszcze nie wydraftowano",
  "claim.hidden": "Ukryte do samego końca",
  "claim.taken": "Ktoś tu już jest",
  "claim.orHotseat": "Może jednak wszyscy przy jednym ekranie?",
  "claim.hotseat": "Użyj tej przeglądarki dla całego stołu",

  // ------------------------------------------------------------------- live
  "live.off": "Brak połączenia",
  "live.connecting": "Szukam pozostałych…",
  "live.online": "Na żywo",
  "live.failed": "Nie udało się połączyć",
  "live.with": "z: {names}",
  "live.alone": "nikogo tu jeszcze nie ma",
  "live.dismiss": "Zamknij",
  "live.divergence.setup":
    "Ktoś w tym pokoju otworzył inny draft. Sprawdźcie, czy wszyscy macie ten sam link.",
  "live.divergence.state":
    "Ta przeglądarka i inna nie zgadzają się co do draftu. Otwórz link ponownie, by przejąć ich wersję.",
  "live.divergence.seat": "Dwie osoby siedzą na Twoim miejscu. Jedna powinna się przesiąść.",
  "live.fallback": "Nie łączy? Podajcie sobie link — niesie cały draft.",
};

export default pl;
