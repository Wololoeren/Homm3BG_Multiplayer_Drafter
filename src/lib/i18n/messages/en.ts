/**
 * The English catalogue, and the shape every other one is measured against.
 * Missing keys fall back here per key, so a half-translated language is fine
 * and a new string never breaks a locale that has not caught up.
 */
const en = {
  "app.title": "Multiplayer Drafter",
  "app.subtitle": "Heroes of Might & Magic III: The Board Game",
  "lang.label": "Language",

  // ---------------------------------------------------------------- lobby
  "lobby.heading": "Set up the draft",
  "lobby.players": "Players",
  "lobby.format": "Format",
  "lobby.format.dealt": "Dealt",
  "lobby.format.snake": "Snake",
  "lobby.format.dealt.help":
    "One shuffle hands every player a pool nobody else was offered, so everyone picks at the same time and no two players can land on the same faction.",
  "lobby.format.snake.help":
    "Turn order, one player at a time, each offered a fresh sample of whatever is still free. Use it when there are not enough factions to deal everyone a real choice.",
  "lobby.factionPool": "Faction options each",
  "lobby.heroPool": "Hero options each",
  "lobby.pool.forced": "no choice — the faction is dealt",
  "lobby.bans": "Bans each",
  "lobby.bans.none": "None",
  "lobby.banVisibility": "Bans are",
  "lobby.banVisibility.open": "Open",
  "lobby.banVisibility.blind": "Blind",
  "lobby.banVisibility.open.help": "One at a time, everyone watching.",
  "lobby.banVisibility.blind.help":
    "Everyone bans at once and they are revealed together. Two players can spend a ban on the same faction.",
  "lobby.heroRule": "Heroes come from",
  "lobby.heroRule.own": "Your own faction",
  "lobby.heroRule.unique-faction": "Any faction, one each",
  "lobby.heroRule.any": "Anywhere",
  "lobby.heroRule.own.help": "The hero you draft belongs to the faction you drafted.",
  "lobby.heroRule.unique-faction.help":
    "Your hero may come from a faction you did not draft, but no two players' heroes may share a home faction.",
  "lobby.heroRule.any.help": "Any hero from any faction.",
  "lobby.uniqueIdentity": "One of each hero",
  "lobby.uniqueIdentity.help":
    "Tarnum has a card in six factions and Lord Haart in two. With this on, only one player can be Tarnum.",
  "lobby.otherTowns": "Heroes may come from another player's town",
  "lobby.collection": "Your collection",
  "lobby.collection.summary": "{factions} factions, {heroes} heroes",
  "lobby.collection.all": "All boxes",
  "lobby.collection.none": "No boxes",
  "lobby.start": "Start the draft",
  "lobby.seed": "Seed",
  "lobby.reroll": "New seed",
  "lobby.reset": "Reset to defaults",

  // ------------------------------------------------------------ feasibility
  "feas.ok": "{players} players, {left} factions on the table — {need} of them dealt out.",
  "feas.not-enough-factions":
    "{players} players and {bans} bans leave {left} factions. There has to be at least one for each player.",
  "feas.faction-pool-too-large":
    "{players} players offered {pool} factions each needs {need} factions; {left} are on the table. The most that can be dealt is {max} each.",
  "feas.hero-pool-too-large":
    "{faction} has {have} heroes, so {pool} each cannot be dealt. The most is {max}.",
  "feas.not-enough-heroes": "There are not enough heroes to go round: {need} needed, {have} available.",
  "feas.fix": "Fix it",

  // ------------------------------------------------------------------ draft
  "phase.ban": "Bans",
  "phase.faction": "Faction",
  "phase.hero": "Hero",
  "phase.done": "Drafted",
  "draft.seat": "Seat {n}",
  "draft.turn": "{name} to move",
  "draft.yourTurn": "Your move",
  "draft.simultaneous": "Everyone picks at once",
  "draft.waiting": "Waiting for the others",
  "draft.pickFaction": "Choose a faction",
  "draft.pickHero": "Choose a hero",
  "draft.banPrompt": "Ban a faction",
  "draft.bansLeft": "{n} left",
  "draft.dealtOne": "You were dealt {faction}.",
  "draft.dealtOneHero": "You were dealt {hero}.",
  "draft.confirm": "Take it",
  "draft.banned": "Banned",
  "draft.taken": "Taken",
  "draft.undo": "Undo last move",
  "draft.hotseat": "Pass the screen to {name}.",
  "draft.ready": "I have the screen",
  "draft.reveal": "Reveal the bans",
  "draft.notOffered": "Not dealt to anyone",

  // ----------------------------------------------------------------- result
  "result.heading": "The draft",
  "result.player": "Player",
  "result.faction": "Faction",
  "result.hero": "Hero",
  "result.class": "Class",
  "result.might": "Might",
  "result.magic": "Magic",
  "result.copy": "Copy as text",
  "result.copied": "Copied",
  "result.print": "Save as PDF",
  "result.again": "Draft again",
  "result.newSetup": "Change the setup",
  "result.code": "Draft code",
  "result.bans": "Banned: {factions}",
  "result.nobans": "No bans",
  "result.specialty": "Specialty",
  "result.ability": "Ability",

  // ------------------------------------------------------------------ share
  "share.code": "Draft code",
  "share.copy": "Copy",
  "share.copied": "Copied",
  "share.resume": "Resume a draft",
  "share.paste": "Paste a draft code",
  "share.open": "Open",
  "share.bad": "That code is not one this build can read.",
  "share.badCatalogue": "That code was made with a different faction list.",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

export default en as Messages;
