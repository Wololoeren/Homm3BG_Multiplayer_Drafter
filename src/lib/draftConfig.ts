import { DEFAULT_FACTIONS, DEFAULT_HEROES, FACTIONS, HEROES, hero, heroesOf } from "./catalogue";
import {
  DRAFT_VERSION,
  HERO_POOL_ALL,
  MAX_BANS,
  MAX_HERO_BANS,
  MAX_PLAYERS,
  MAX_POOL,
  MIN_PLAYERS,
  type DraftConfig,
  type DraftFormat,
  type HeroFactionPolicy,
} from "./draftTypes";

export function defaultConfig(): DraftConfig {
  return {
    version: DRAFT_VERSION,
    players: 4,
    format: "dealt",
    factionPoolSize: 2,
    heroPoolSize: 3,
    bansPerPlayer: 0,
    heroBansPerPlayer: 0,
    banVisibility: "open",
    heroFactionPolicy: "own",
    uniqueHeroIdentity: true,
    sharedHeroCards: true,
    draftSeats: false,
    combinedPicks: false,
    heroMayComeFromAnotherPlayersTown: false,
    factionIds: DEFAULT_FACTIONS.map((f) => f.id),
    heroIds: DEFAULT_HEROES.map((h) => h.id),
  };
}

const clamp = (n: unknown, lo: number, hi: number, fallback: number) => {
  const value = Math.trunc(Number(n));
  return Number.isFinite(value) ? Math.min(Math.max(value, lo), hi) : fallback;
};

/**
 * Fills a config-shaped object from an untrusted source (localStorage, a
 * pasted draft code, a hand-edited file) onto the current template, the same
 * way the Scenario Editor brings old saves forward. Returns null only for the
 * one thing that cannot be defaulted: a version this build does not speak,
 * where quietly substituting defaults would deal a different draft than the
 * code promised.
 */
export function sanitizeConfig(raw: unknown): DraftConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<DraftConfig>;
  if (input.version !== undefined && input.version !== DRAFT_VERSION) return null;

  const base = defaultConfig();
  // Sets built from the catalogue arrays, so iterating one yields catalogue
  // order — which is what keeps a config canonical.
  const knownFactions = new Set(FACTIONS.map((f) => f.id));
  const knownHeroes = new Set(HEROES.map((h) => h.id));

  // Canonical order, always. These lists seed the shuffles that deal the
  // pools, so two clients holding the same factions in a different order would
  // deal each other different games — and a draft code, which stores them as a
  // bitmap, would not round-trip.
  const keep = (raw: unknown, known: Set<string>, universe: string[], fallback: string[]) => {
    if (!Array.isArray(raw)) return fallback;
    const chosen = new Set(raw.filter((id): id is string => typeof id === "string" && known.has(id)));
    // Ordered by the whole catalogue, not by the default selection: a draft
    // that opted into a fan expansion must keep it, and it is not in the
    // default. Getting this wrong silently drops Factory from a pasted code.
    return universe.filter((id) => chosen.has(id));
  };
  const factionIds = keep(input.factionIds, knownFactions, [...knownFactions], base.factionIds);
  const heroIds = keep(input.heroIds, knownHeroes, [...knownHeroes], base.heroIds);

  const combinedPicks = input.combinedPicks === true;
  const format: DraftFormat = input.format === "snake" ? "snake" : "dealt";
  const policy: HeroFactionPolicy =
    input.heroFactionPolicy === "unique-faction" || input.heroFactionPolicy === "any"
      ? input.heroFactionPolicy
      : "own";

  return dropOrphanHeroes({
    version: DRAFT_VERSION,
    players: clamp(input.players, MIN_PLAYERS, MAX_PLAYERS, base.players),
    format,
    factionPoolSize: clamp(input.factionPoolSize, 1, MAX_POOL, base.factionPoolSize),
    // 0 is HERO_POOL_ALL, and only means anything under the "own" rule — a
    // pool of "every hero there is" would be a different feature.
    heroPoolSize:
      policy === "own" ? clamp(input.heroPoolSize, HERO_POOL_ALL, MAX_POOL, base.heroPoolSize)
      : Math.max(1, clamp(input.heroPoolSize, 1, MAX_POOL, base.heroPoolSize)),
    bansPerPlayer: clamp(input.bansPerPlayer, 0, MAX_BANS, base.bansPerPlayer),
    // Hero bans need no feasibility rule of their own: a ban that would leave
    // somebody with nothing to draft is refused at the moment it is made
    // (see legalHeroBans), which no arithmetic up front can do as precisely.
    heroBansPerPlayer: clamp(input.heroBansPerPlayer, 0, MAX_HERO_BANS, base.heroBansPerPlayer),
    banVisibility: input.banVisibility === "blind" ? "blind" : "open",
    heroFactionPolicy: policy,
    uniqueHeroIdentity: input.uniqueHeroIdentity !== false,
    sharedHeroCards: input.sharedHeroCards === true,
    draftSeats: input.draftSeats === true,
    combinedPicks,
    // Combined picks settle this one for you. The first player takes a hero
    // before the second has a town, so "not from another player's town" is a
    // rule about facts that do not exist yet; keeping it would mean enforcing
    // it backwards, forbidding a town because somebody already took its hero.
    heroMayComeFromAnotherPlayersTown:
      combinedPicks || input.heroMayComeFromAnotherPlayersTown === true,
    // An empty list would be a draft with nothing to draft; fall back rather
    // than shipping a config that can only deadlock.
    factionIds: factionIds.length ? factionIds : base.factionIds,
    heroIds: heroIds.length ? heroIds : base.heroIds,
  });
}

/**
 * A faction you do not have is a faction whose heroes you do not have either.
 *
 * Enforced here rather than in the lobby's toggles because there are several
 * ways to switch a faction off — its own chip, the box it came in, a pasted
 * code — and every one of them has to leave the same thing behind. Under the
 * own-faction rule an orphaned hero is merely unreachable; under the others it
 * would be a hero from a town nobody at the table owns.
 */
export function dropOrphanHeroes(config: DraftConfig): DraftConfig {
  const factions = new Set(config.factionIds);
  const heroIds = config.heroIds.filter((id) => {
    const card = hero(id);
    return card ? factions.has(card.factionId) : false;
  });
  return heroIds.length === config.heroIds.length ? config : { ...config, heroIds };
}

export type FeasibilityCode =
  | "not-enough-factions"
  | "faction-pool-too-large"
  | "faction-pool-too-large-snake"
  | "not-enough-heroes"
  | "hero-pool-too-large";

/** Which part of the setup an issue is about, so a control can grey itself
 * for its own reasons rather than for something else being wrong. A hero pool
 * has no business dimming because the faction pool will not fit. */
export const FACTION_ISSUES: FeasibilityCode[] = ["not-enough-factions", "faction-pool-too-large"];
export const HERO_ISSUES: FeasibilityCode[] = ["not-enough-heroes", "hero-pool-too-large"];

export interface FeasibilityIssue {
  code: FeasibilityCode;
  /** Numbers for the message, so the UI can say *why* rather than just "no". */
  vars: Record<string, string | number>;
}

export interface Feasibility {
  ok: boolean;
  issues: FeasibilityIssue[];
  /** Largest pool the current player count and ban count can actually be
   * dealt, so the lobby can offer the fix instead of only the complaint. */
  maxFactionPoolSize: number;
  maxHeroPoolSize: number;
  /** Factions still on the table once every ban has landed, worst case. */
  factionsAfterBans: number;
}

/**
 * Can this configuration actually be dealt?
 *
 * The dealt format's disjoint pools are what make simultaneous picking safe,
 * and they are also its one real limit: six players cannot each be offered two
 * of ten factions. Rather than let the draft discover that halfway through,
 * the lobby computes it up front and shows the arithmetic — see
 * docs/PLAN.md §4.1.
 */
export function feasibility(config: DraftConfig): Feasibility {
  const issues: FeasibilityIssue[] = [];
  const { players, bansPerPlayer, factionIds, heroIds } = config;

  const enabledFactions = factionIds.length;
  // Worst case every ban is distinct, which is also the only case that can
  // make a legal config fail — so it is the one to plan for.
  const factionsAfterBans = enabledFactions - players * bansPerPlayer;

  const maxFactionPoolSize =
    config.format === "dealt"
      ? Math.max(1, Math.floor(factionsAfterBans / players))
      : Math.max(1, Math.min(MAX_POOL, factionsAfterBans - players + 1));

  if (factionsAfterBans < players) {
    issues.push({
      code: "not-enough-factions",
      vars: { players, bans: players * bansPerPlayer, enabled: enabledFactions, left: factionsAfterBans },
    });
  } else if (config.format === "dealt" && players * config.factionPoolSize > factionsAfterBans) {
    issues.push({
      code: "faction-pool-too-large",
      vars: {
        players,
        pool: config.factionPoolSize,
        need: players * config.factionPoolSize,
        left: factionsAfterBans,
        max: maxFactionPoolSize,
      },
    });
  }

  // ---- heroes -------------------------------------------------------------

  const enabledHeroes = new Set(heroIds);
  let maxHeroPoolSize = MAX_POOL;
  // "All" is not a size to check against: it is whatever that seat still has,
  // and a faction with no heroes left is caught below on its own.
  const sizedHeroPool = config.heroPoolSize !== HERO_POOL_ALL;

  if (config.heroFactionPolicy === "own") {
    // Each seat draws only from its own faction, so the binding constraint is
    // the thinnest faction — and, when identities must stay unique, the few
    // heroes another seat could have claimed out from under it. Tarnum is in
    // six factions, so this is not hypothetical.
    for (const factionId of factionIds) {
      const own = heroesOf(factionId).filter((h) => enabledHeroes.has(h.id));
      const shared = config.uniqueHeroIdentity
        ? own.filter((h) =>
            HEROES.some(
              (other) =>
                other.identity === h.identity &&
                other.factionId !== factionId &&
                factionIds.includes(other.factionId) &&
                enabledHeroes.has(other.id),
            ),
          ).length
        : 0;
      const usable = own.length - Math.min(players - 1, shared);
      maxHeroPoolSize = Math.min(maxHeroPoolSize, Math.max(1, usable));
      if (own.length === 0) {
        issues.push({ code: "not-enough-heroes", vars: { faction: factionId, have: 0, need: 1 } });
      } else if (sizedHeroPool && config.heroPoolSize > usable) {
        issues.push({
          code: "hero-pool-too-large",
          vars: { faction: factionId, have: own.length, pool: config.heroPoolSize, max: Math.max(1, usable) },
        });
      }
    }
  } else {
    // A shared roster: the whole table draws from one pile. What runs out
    // first is not always the cards — under "unique-faction" it is the towns,
    // since two players' heroes may not come from the same one, and under
    // uniqueHeroIdentity it is the people, since Tarnum is one man with six
    // cards. Whichever is scarcest is the real supply.
    const pile = HEROES.filter((h) => enabledHeroes.has(h.id));
    let supply = pile.length;
    if (config.uniqueHeroIdentity) supply = Math.min(supply, new Set(pile.map((h) => h.identity)).size);
    if (config.heroFactionPolicy === "unique-faction") {
      supply = Math.min(supply, new Set(pile.map((h) => h.factionId)).size);
    }

    // Combined picks take a hero at the moment a seat's turn comes round, so
    // the pool is sampled rather than dealt — the same as a snake draft.
    const heroesDealt = config.format === "dealt" && !config.combinedPicks;
    maxHeroPoolSize = heroesDealt
      ? Math.max(1, Math.min(MAX_POOL, Math.floor(supply / players)))
      : Math.max(1, Math.min(MAX_POOL, supply - players + 1));
    const need = heroesDealt && sizedHeroPool ? players * config.heroPoolSize : players;
    if (need > supply) {
      issues.push({ code: "not-enough-heroes", vars: { faction: "", have: supply, need } });
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    maxFactionPoolSize,
    maxHeroPoolSize: Math.max(1, maxHeroPoolSize),
    factionsAfterBans,
  };
}

/**
 * Nudges a config back onto its feet after a change that made it impossible,
 * so raising the player count shrinks the pools rather than leaving a red
 * error for the player to unpick themselves.
 *
 * Pools give way first, because a smaller pool is still the draft you asked
 * for; bans only give way when nothing else will do, because dropping one
 * changes the shape of the game. If neither is enough — a table of eight on
 * three factions — the config comes back as it was and the lobby says why.
 */
/**
 * The pools clamped to what the players, bans and collection leave room for —
 * the first half of `repair`, on its own.
 *
 * Separate because "could this many bans work?" has to be asked with the bans
 * held fixed. Ask it through `repair` and the answer is always yes, since
 * repair's own last resort is to hand a ban back.
 */
export function shrinkPools(config: DraftConfig): DraftConfig {
  const check = feasibility(config);
  if (check.ok) return config;
  return {
    ...config,
    factionPoolSize: Math.min(config.factionPoolSize, check.maxFactionPoolSize),
    heroPoolSize:
      config.heroPoolSize === HERO_POOL_ALL
        ? HERO_POOL_ALL
        : Math.min(config.heroPoolSize, check.maxHeroPoolSize),
  };
}

export function repair(config: DraftConfig): DraftConfig {
  let next = dropOrphanHeroes(config);
  for (let guard = 0; guard <= MAX_BANS; guard++) {
    const check = feasibility(next);
    if (check.ok) return next;

    const shrunk = shrinkPools(next);
    if (feasibility(shrunk).ok) return shrunk;
    if (shrunk.bansPerPlayer === 0) return shrunk;
    next = { ...shrunk, bansPerPlayer: shrunk.bansPerPlayer - 1 };
  }
  return next;
}
