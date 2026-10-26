import type { Messages } from "./en";

/**
 * Suomi. Jokainen puuttuva avain putoaa itsekseen takaisin englantiin, joten
 * vajaakin luettelo on aivan kelpo panos — lisää ne rivit jotka osaat ja
 * jätä loput pois.
 */
const fi: Partial<Messages> = {
  "app.title": "Moninpelidraft",
  "app.subtitle": "Heroes of Might & Magic III: lautapeli",
  "lang.label": "Kieli",
  "footer.more": "Tykkäätkö? Katso myös:",
  "footer.cardCreator": "Korttipaja",
  "footer.editor": "Skenaarioeditori",
  "footer.generator": "Satunnaisskenaarioiden generaattori",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Draftin asetukset",
  "lobby.players": "Pelaajat",
  "lobby.format": "Muoto",
  "lobby.format.dealt": "Jaettu",
  "lobby.format.snake": "Käärme",
  "lobby.format.dealt.help":
    "Yksi sekoitus antaa jokaiselle pelaajalle valikoiman, jota kukaan muu ei saanut, joten kaikki valitsevat yhtä aikaa eivätkä kaksi pelaajaa voi päätyä samaan faktioon.",
  "lobby.format.snake.help":
    "Vuorotellen, yksi pelaaja kerrallaan, kullekin tuore otos siitä mitä on vielä vapaana. Käytä kun faktioita ei riitä antamaan kaikille oikeaa valinnanvaraa.",
  "lobby.factionPool": "Faktioita valittavaksi",
  "lobby.heroPool": "Sankareita valittavaksi",
  "lobby.pool.forced": "ei valinnanvaraa — faktio jaetaan",
  "lobby.pool.forcedHero": "ei valinnanvaraa — sankari jaetaan",
  "lobby.pool.all": "Kaikki",
  "lobby.pool.all.help":
    "Kaikki sankarit jotka faktiollasi on vielä jäljellä. Siellä missä kahdelle pelaajalle voitaisiin tarjota sama henkilö — Tarnumilla on kortti kuudessa faktiossa — sankarivaihe kiertää pöydän yksi kerrallaan eikä kaikki yhtä aikaa.",
  "lobby.bans": "Faktiobanneja kullekin",
  "lobby.bans.none": "Ei yhtään",
  "lobby.turns": "Vuorot",
  "lobby.turns.help": "Minkä muotoinen vuoro on, ja saatko valita paikkasi pöydässä.",
  "lobby.combined": "Faktio ja sankari samalla vuorolla",
  "lobby.draftSeats": "Draftaa myös istumajärjestys",
  "lobby.combined.help":
    "Pelaaja ottaa faktionsa ja sitten sen sankarin ennen kuin seuraava siirtää — yksi kerrallaan pöydän ympäri. Pois päältä: ensin kaikki draftaavat faktiot, sankarit vasta sitten.",
  "lobby.draftSeats.help":
    "Kun kaikki muu on draftattu, kukin valitsee paikkansa vielä vapaista. Pois päältä: siemen päättää.",
  "lobby.heroBans": "Sankaribanneja kullekin",
  "lobby.heroBans.help":
    "Käytetään omalla kierroksellaan faktioiden draftin jälkeen — ennen kuin tiedät kuka pelaa mitä, sankarin bannaaminen on arvaus. Banni joka jättäisi jonkun ilman draftattavaa hylätään.",
  "lobby.heroBans.blindHelp":
    "Kun faktio ja sankari tulevat samalla vuorolla, ei ole hetkeä jolloin kaupungit tiedetään mutta sankareita ei — joten nämä bannit tapahtuvat ennen mitään muuta. Arvaus, ei lukema.",
  "lobby.banVisibility": "Bannit ovat",
  "lobby.banVisibility.open": "Avoimia",
  "lobby.banVisibility.blind": "Sokkoja",
  "lobby.banVisibility.open.help": "Yksi kerrallaan, kaikkien nähden.",
  "lobby.banVisibility.blind.help":
    "Kaikki bannaavat yhtä aikaa ja bannit paljastetaan yhdessä. Kaksi pelaajaa voi käyttää bannin samaan sankariin tai faktioon, ja se poistuu silti vain kerran. Koskee molempia bannikierroksia.",
  "lobby.during": "Draftin aikana",
  "lobby.conceal": "Pidä valinnat piilossa loppuun asti",
  "lobby.conceal.help":
    "Kukaan ei näe mitä muut draftasivat tai bannasivat ennen lopun koostetta — yhden ruudun ääressä se tarkoittaa, ettei kukaan näe vuorojen välissä mitään. Se mikä on jo mennyt näkyy laudalla edelleen, koska sitä ei voi ottaa.",
  "lobby.heroRule": "Sankarit tulevat",
  "lobby.heroRule.own": "Omasta faktiosta",
  "lobby.heroRule.unique-faction": "Mistä tahansa, yksi kustakin",
  "lobby.heroRule.any": "Mistä vain",
  "lobby.heroRule.own.help": "Draftaamasi sankari kuuluu siihen faktioon jonka draftasit.",
  "lobby.heroRule.unique-faction.help":
    "Sankarisi voi tulla faktiosta jota et draftannut, mutta kahden pelaajan sankareilla ei saa olla samaa kotifaktiota.",
  "lobby.heroRule.any.help": "Mikä tahansa sankari mistä tahansa faktiosta.",
  "lobby.uniqueIdentity": "Kutakin sankaria yksi",
  "lobby.uniqueIdentity.help":
    "Tarnumilla on kortti kuudessa faktiossa ja Lord Haartilla kahdessa. Tämä päällä vain yksi pelaaja voi olla Tarnum.",
  "lobby.otherTowns": "Sankari voi tulla toisen pelaajan kaupungista",
  "lobby.otherTowns.combined":
    "Aina päällä kun faktio ja sankari tulevat samalla vuorolla: ensimmäinen pelaaja ottaa sankarin ennen kuin toisella on kaupunkia, joten ei ole vielä toista kaupunkia jota välttää.",
  "lobby.sharedCards": "Yksi kortti, kaksi sankaria",
  "lobby.sharedCards.help":
    "Sankarikortit ovat kaksipuolisia, joten yhden puolen draftaaminen vie koko kortin ja kääntöpuolen sankari lähtee mukana. Banni ei — se vie sankarin, ei korttia. Melkein jokainen pari jakaa kaupungin, joten tämä puree harvoin ellei sankareita saa draftata oman faktion ulkopuolelta; poikkeus on Tarnum, jonka kuusi korttia ovat oikeasti kolme.",
  "lobby.sharedCards.nodata":
    "Tähän tarvitaan lista siitä ketkä sankarit jakavat kortin, eikä sitä ole vielä yhteisön tietokannassa. Lisää parit CARD_PAIRS-listaan tiedostossa scripts/build-catalogue.mjs, niin tämä kytkeytyy päälle.",
  "lobby.collection": "Kokoelmasi",
  "lobby.collection.summary": "{factions} faktiota, {heroes} sankaria",
  "lobby.collection.all": "Kaikki laatikot",
  "lobby.collection.none": "Ei laatikoita",
  "lobby.mode": "Pelataan",
  "lobby.mode.local": "Yhdellä ruudulla",
  "lobby.mode.manual": "Linkkejä kierrättäen",
  "lobby.mode.p2p": "Livenä",
  "lobby.mode.local.help":
    "Yksi selain vetää koko pöydän. Se kertoo kuka on seuraavana ja odottaa että tämä ottaa ruudun.",
  "lobby.mode.manual.help":
    "Jokainen saa oman linkkinsä. Tee siirtosi ja ojenna uusi linkki seuraavalle. Ei palvelinta, ei tunnuksia, ja toimii vaikka ette olisi samassa verkossa.",
  "lobby.mode.p2p.help":
    "Kaikki avaavat saman linkin ja selaimet juttelevat suoraan keskenään. Jos verkko estää, palataan linkkien kierrättämiseen.",
  "lobby.youAre": "Sinä olet",
  "lobby.tooManyPlayers": "Pelissä on vain {factions} faktiota.",
  "lobby.poolTooBig": "Siihen tarvittaisiin {need} faktiota; pöydällä on {left}.",
  "lobby.tooManyBans": "Noin monta bannia ei jättäisi faktiota jokaiselle {players} pelaajalle.",
  "lobby.factionNeeded": "Tarvitaan {players} pelaajan draftin jakamiseen.",
  "lobby.start": "Aloita draft",
  "lobby.seed": "Siemen",
  "lobby.reroll": "Uusi siemen",
  "lobby.reset": "Palauta oletukset",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} pelaajaa, {left} faktiota pöydällä — {need} niistä jaetaan.",
  "feas.not-enough-factions":
    "{players} pelaajaa ja {bans} bannia jättää {left} faktiota. Yksi per pelaaja on vähin mahdollinen.",
  "feas.faction-pool-too-large":
    "{players} pelaajaa à {pool} faktiota vaatii {need} faktiota; pöydällä on {left}. Enintään {max} kullekin.",
  "feas.hero-pool-too-large":
    "{faction} omistaa {have} sankaria, joten {pool} kullekin ei onnistu. Enintään {max}.",
  "feas.not-enough-heroes": "Sankareita ei riitä kaikille: tarvitaan {need}, saatavilla {have}.",
  "feas.fix": "Korjaa",

  // ------------------------------------------------------------------ draft
  "phase.lobby": "Ei aloitettu",
  "phase.ban": "Bannit",
  "phase.pick": "Faktio ja sankari",
  "phase.position": "Paikat",
  "phase.banHero": "Sankaribannit",
  "phase.faction": "Faktio",
  "phase.hero": "Sankari",
  "phase.done": "Draftattu",
  "draft.seat": "Pelaaja {n}",
  "draft.turn": "{name} siirtää",
  "draft.yourTurn": "Sinun vuorosi",
  "draft.simultaneous": "Kaikki valitsevat yhtä aikaa",
  "draft.waiting": "Odotetaan muita",
  "draft.pickFaction": "Valitse faktio",
  "draft.pickHero": "Valitse sankari",
  "draft.banPrompt": "Bannaa faktio",
  "draft.banHeroPrompt": "Bannaa sankari",
  "draft.pickSeat": "Valitse paikkasi",
  "draft.pickSeat.help": "Vuorojärjestys itse peliä varten",
  "draft.seatFirst": "Aloittaa",
  "draft.seatNth": "{n}. vuorossa",
  "draft.kept": "Ei voi bannata",
  "draft.bansLeft": "{n} jäljellä",
  "draft.bansProgress": "{done}/{total} käytetty",
  "draft.dealtOne": "Sait faktion {faction}.",
  "draft.dealtOneHero": "Sait sankarin {hero}.",
  "draft.confirm": "Otan sen",
  "draft.banned": "Bannattu",
  "draft.taken": "Varattu",
  "draft.undo": "Kumoa viimeisin siirto",
  "draft.undo.shared": "Oma viimeisin siirtosi, kunnes ojennat linkin eteenpäin.",
  "draft.abandon": "Hylkää draft",
  "draft.abandon.confirm": "Hylätäänkö? Kaikki tähän asti draftattu menetetään.",
  "draft.abandon.yes": "Kyllä, hylätään",
  "draft.abandon.no": "Jatketaan",
  "draft.abandon.shared":
    "Tämä päättää draftin vain täällä. Muilla on yhä oma kopionsa, ja tämän sivun linkki avaa sen edelleen.",
  "draft.hotseat": "Ojenna ruutu: {name}.",
  "draft.handover.copied": "Hänen linkkinsä on leikepöydälläsi — liitä se: {name}.",
  "draft.handover.manual": "Kopioi alla oleva linkki ja lähetä se: {name}.",
  "draft.ready": "Ruutu on minulla",
  "draft.reveal": "Paljasta bannit",
  "draft.notOffered": "Ei jaettu kenellekään",
  "draft.stats": "{name}: hyökkäys, puolustus, loitsuvoima ja tietous",
  "draft.unreplayable":
    "Tallennettu draft ei toistu täällä — sen on ehkä kirjoittanut tämän sivun toinen versio. Alusta aloittaminen säilyttää asetuksesi, ja saamasi linkki tai koodi avaa itse draftin edelleen.",
  "draft.unreplayable.reset": "Aloita alusta",

  // ------------------------------------------------------------------- wiki
  "wiki.hero": "Lue {name} wikistä",
  "wiki.faction": "Lue {name} wikistä",

  // ----------------------------------------------------------------- result
  "result.heading": "Draft",
  "result.seat": "Paikka",
  "result.player": "Pelaaja",
  "result.faction": "Faktio",
  "result.hero": "Sankari",
  "result.class": "Luokka",
  "result.might": "Voima",
  "result.magic": "Magia",
  "result.copy": "Kopioi tekstinä",
  "result.copied": "Kopioitu",
  "result.print": "Tallenna PDF:nä",
  "result.again": "Draftaa uudelleen",
  "result.newSetup": "Muuta asetuksia",
  "result.code": "Draftin koodi",
  "result.seed": "Siemen",
  "result.bans": "Bannattu: {factions}",
  "result.heroBans": "Bannatut sankarit: {heroes}",
  "result.nobans": "Ei banneja",
  "result.showPassed": "Näytä vaihtoehdot, joita ei otettu",
  "result.alsoOffered": "tarjolla myös: {options}",
  "result.specialty": "Erikoisuus",
  "result.ability": "Kyky",

  // ------------------------------------------------------------------ share
  "share.code": "Draftin koodi",
  "share.link": "Linkki",
  "share.room": "Huoneen linkki",
  "share.copy": "Kopioi",
  "share.copied": "Kopioitu",
  "share.qr": "QR",
  "share.qrLoading": "Piirretään…",
  "share.qrHelp": "Osoita tätä puhelimella, niin draft avautuu siellä.",
  "share.seatLinks": "Linkit pelaajittain",
  "share.handOver": "Siirtosi on kirjattu. Lähetä tämä linkki: {name}.",
  "share.resume": "Jatka draftia",
  "share.paste": "Liitä draftin koodi tai linkki",
  "share.open": "Avaa",
  "share.bad": "Tämä versio ei osaa lukea tuota koodia.",
  "share.badCatalogue": "Tuo koodi on tehty eri faktiolistalla.",

  // ------------------------------------------------------------------ seats
  "claim.heading": "Mikä paikka on sinun?",
  "claim.free": "Ei vielä mitään draftattuna",
  "claim.hidden": "Piilossa loppuun asti",
  "claim.taken": "Täällä on jo joku",
  "claim.orHotseat": "Kaikki sittenkin yhden ruudun ääreen?",
  "claim.hotseat": "Käytä tätä selainta koko pöydälle",

  // ------------------------------------------------------------------- live
  "live.off": "Ei yhteyttä",
  "live.connecting": "Etsitään muita…",
  "live.online": "Live",
  "live.failed": "Yhteyttä ei saatu",
  "live.with": "mukana {names}",
  "live.alone": "täällä ei ole vielä muita",
  "live.dismiss": "Sulje",
  "live.divergence.setup":
    "Joku tässä huoneessa avasi eri draftin. Tarkistakaa että kaikilla on sama linkki.",
  "live.divergence.state":
    "Tämä selain ja toinen ovat eri mieltä draftista. Avaa linkki uudelleen, niin saat heidän versionsa.",
  "live.divergence.seat": "Paikallasi istuu kaksi. Toisen teistä kannattaisi siirtyä.",
  "live.fallback": "Eikö yhdistä? Kierrättäkää linkkiä — se kantaa koko draftin.",
};

export default fi;
