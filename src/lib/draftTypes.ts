/** Bumped when the stored/encoded draft format changes, so an old code or an
 * old localStorage entry can be recognised and refused rather than
 * half-loaded into a draft that then deals the wrong thing. */
export const DRAFT_VERSION = 4;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
export const MAX_POOL = 5;
export const MAX_BANS = 2;

/**
 * Hero bans go further than faction bans because there is far more to spend
 * them on: ten factions against a couple of dozen heroes anybody could draft.
 * The round still stops itself when no ban is left that would not starve
 * somebody, so a generous budget costs nothing.
 */
export const MAX_HERO_BANS = 5;

/**
 * A hero pool of "everything my faction still has left", rather than a fixed
 * number of cards. Stored as 0 because that is not a pool size anybody could
 * have meant, and it costs no room in the draft code.
 *
 * Only offered under the "own" hero rule: every seat then draws from its own
 * faction, so "all of them" is a handful of cards rather than the whole
 * sixty-four.
 */
export const HERO_POOL_ALL = 0;

export interface Faction {
  id: string;
  name: string;
  /** Which box it comes in — "core-game", "tower-expansion", … */
  set: string;
  /** Banner tint; the only thing telling two faction cards apart at a glance. */
  color: string;
  crest: string;
  /** Its page name on the community wiki — kept, not derived. See lib/wiki. */
  wiki: string;
}

export interface Hero {
  id: string;
  /** Its page name on the community wiki — kept, not derived. See lib/wiki. */
  wiki: string;
  name: string;
  factionId: string;
  /** The card's might/magic icon, which is the authority — it does not always
   * agree with the class name (Torosar is a might Wizard). */
  klass: "might" | "magic";
  className: string;
  /**
   * The same person's cards in different factions share this: Tarnum has six,
   * Lord Haart two. Without it, `uniqueHeroIdentity` would happily let two
   * players both draft Tarnum from two different towns.
   */
  identity: string;
  /**
   * The hero printed on the other side of the same physical card, if the
   * pairings are known. Taking either one puts the card in play, so the other
   * leaves the game with it — which is what `sharedHeroCards` enforces.
   *
   * Unpopulated for now: the pairings are not in the community database and
   * have to be read off the cards. See scripts/build-catalogue.mjs.
   */
  pairedWith?: string;
  ability: string;
  specialty: string;
  set: string;
}

/** Where a player's hero may come from. Settled in docs/PLAN.md §14: "own" is
 * the default, the other two exist because the rule was worth making
 * configurable rather than guessing at. */
export type HeroFactionPolicy = "own" | "unique-faction" | "any";

export type DraftFormat = "dealt" | "snake";

export interface DraftConfig {
  version: number;
  players: number;
  /**
   * "dealt"  — one seeded shuffle hands every seat a pool no one else was
   *            offered, so everybody picks at the same time and cannot collide.
   * "snake"  — turn order, pools sampled from whatever is still legal. Needed
   *            when there are not enough factions to go round (§4.1).
   */
  format: DraftFormat;
  factionPoolSize: number;
  heroPoolSize: number;
  bansPerPlayer: number;
  /**
   * Bans spent on heroes rather than factions, in a round of their own after
   * the factions are drafted. They come second on purpose: until you know who
   * is playing what, banning a hero is a guess.
   */
  heroBansPerPlayer: number;
  banVisibility: "open" | "blind";
  heroFactionPolicy: HeroFactionPolicy;
  uniqueHeroIdentity: boolean;
  /**
   * Treat a hero card as the physical, double-sided object it is: drafting one
   * face takes the whole card, so the hero on its back goes with it. Has no
   * effect until the catalogue carries the pairings.
   */
  sharedHeroCards: boolean;
  /**
   * Draft the seating order too: each player picks where they sit from what is
   * left, once everything else is settled. Off by default, which leaves the
   * seed to assign it — the way it has always been.
   */
  draftSeats: boolean;
  /**
   * Take a whole turn at once: faction, then that faction's hero, before the
   * next player moves. It goes round the table one player at a time, because
   * "immediately after" is only meaningful if somebody is waiting.
   */
  combinedPicks: boolean;
  /** Only meaningful under "unique-faction": may your hero hail from a faction
   * another player drafted as their town? */
  heroMayComeFromAnotherPlayersTown: boolean;
  /** The factions actually in play. The lobby's "which boxes do you own"
   * toggles are a convenience that writes into this list — the engine and the
   * draft code only ever see the resolved set. */
  factionIds: string[];
  heroIds: string[];
}

export type Phase =
  | "lobby"
  | "ban"
  | "faction"
  | "banHero"
  | "hero"
  /** Faction and hero in one turn, when combinedPicks is on. */
  | "pick"
  /** Choosing where to sit, when draftSeats is on. */
  | "position"
  | "done";

export type DraftEvent =
  | { t: "join"; seat: number; name: string }
  | { t: "start" }
  | { t: "ban"; seat: number; factionId: string }
  | { t: "banH"; seat: number; heroId: string }
  | { t: "pickF"; seat: number; factionId: string }
  | { t: "pickH"; seat: number; heroId: string }
  | { t: "pickP"; seat: number; position: number }
  | { t: "undo" };

export interface Seat {
  index: number;
  name: string;
  joined: boolean;
  factionId: string | null;
  heroId: string | null;
  /** Which factions this seat has spent its bans on, in order. */
  bans: string[];
  /** And which heroes, in the round after the factions were drafted. */
  heroBans: string[];
  /** Where this player sits, 1-based, when the seating order is drafted.
   * Null while it is still the seed's to decide — see seatPosition. */
  position: number | null;
}

export interface DraftState {
  config: DraftConfig;
  seed: string;
  phase: Phase;
  seats: Seat[];
  /**
   * The seeded seating order. Draft turns follow this rather than seat number,
   * so nobody has to argue about who picks first — the seed decided it.
   */
  order: number[];
  /** Whose turn it is in a sequential phase; null when everyone moves at once. */
  turn: number | null;
  bannedFactions: string[];
  bannedHeroes: string[];
  /** Derived from (config, seed, log) on every replay, never stored or sent —
   * see docs/PLAN.md §3.1. Keyed by seat index. */
  pools: Record<number, string[]>;
  /** Fingerprint of everything above except `pools`, for spotting a client
   * that has drifted out of step. */
  hash: string;
}

/** Why a move was refused. Every client checks this independently, so a peer
 * cannot push an illegal event past anyone. */
export type Rejection =
  | "wrong-phase"
  | "not-your-turn"
  | "not-in-pool"
  | "already-picked"
  | "already-banned"
  | "out-of-bans"
  | "unknown-seat"
  | "unknown-id"
  | "not-legal";
