import { describe, expect, it } from "vitest";
import { FACTIONS, HEROES, hero } from "@/lib/catalogue";
import { defaultConfig, feasibility, repair } from "@/lib/draftConfig";
import {
  apply,
  canMove,
  heroBanOptions,
  legalHeroBans,
  legalHeroes,
  reduce,
  seatPosition,
} from "@/lib/draftEngine";
import { mulberry32 } from "@/lib/rng";
import { HERO_POOL_ALL, type DraftConfig, type DraftEvent, type DraftState } from "@/lib/draftTypes";

/**
 * These are the tests the product exists for. "No two players end up on the
 * same faction" is not something to check by playing a game — see
 * docs/PLAN.md §11 for the list, P1 to P7.
 */

type Rng = () => number;

const pick = <T,>(rng: Rng, items: readonly T[]): T => items[Math.floor(rng() * items.length)];

/** A random but feasible config, so the properties are tested against the
 * whole configuration space rather than one comfortable corner of it. */
function randomConfig(rng: Rng): DraftConfig {
  const base = defaultConfig();
  const heroFactionPolicy = pick(rng, ["own", "unique-faction", "any"] as const);
  const config: DraftConfig = {
    ...base,
    players: 2 + Math.floor(rng() * 7),
    format: pick(rng, ["dealt", "snake"] as const),
    factionPoolSize: 1 + Math.floor(rng() * 5),
    // "All" is an own-faction pool, and the engine has to hold every invariant
    // with it just as it does with a dealt one.
    heroPoolSize:
      heroFactionPolicy === "own" && rng() < 0.25 ? HERO_POOL_ALL : 1 + Math.floor(rng() * 5),
    bansPerPlayer: Math.floor(rng() * 3),
    heroBansPerPlayer: Math.floor(rng() * 3),
    banVisibility: pick(rng, ["open", "blind"] as const),
    heroFactionPolicy,
    uniqueHeroIdentity: rng() < 0.8,
    heroMayComeFromAnotherPlayersTown: rng() < 0.5,
    // The two shapes a turn can take, so every invariant below is defended in
    // both of them rather than only in the one that came first.
    combinedPicks: rng() < 0.4,
    draftSeats: rng() < 0.4,
  };
  return repair(config);
}

/** Plays a whole draft through, always choosing from the pool the engine
 * actually offered — which is the only way a real client can move. */
function playOut(config: DraftConfig, seed: string, rng: Rng): { state: DraftState; log: DraftEvent[] } {
  const log: DraftEvent[] = [];
  let state = reduce(config, seed, log);

  for (let i = 0; i < config.players; i++) {
    log.push({ t: "join", seat: i, name: `P${i + 1}` });
  }
  log.push({ t: "start" });
  state = reduce(config, seed, log);

  // Generous ceiling: bans + faction + hero for every seat, and a wide margin
  // so a stuck draft shows up as a failed expectation rather than a hang.
  for (let guard = 0; guard < 200 && state.phase !== "done"; guard++) {
    const movable = state.seats.filter((seat) => canMove(state, seat.index));
    expect(movable.length, `nobody can move in phase ${state.phase}`).toBeGreaterThan(0);

    const seat = pick(rng, movable);
    let event: DraftEvent;
    if (state.phase === "ban") {
      const offered = state.config.banVisibility === "blind" ? config.factionIds : untouched(state);
      const options = offered.filter((id) => !seat.bans.includes(id));
      event = { t: "ban", seat: seat.index, factionId: pick(rng, options) };
    } else if (state.phase === "banHero") {
      event = { t: "banH", seat: seat.index, heroId: pick(rng, legalHeroBans(state, seat.index)) };
    } else if (state.phase === "pick") {
      // One turn, two picks: the pool holds whichever the seat still owes.
      event = state.seats[seat.index].factionId
        ? { t: "pickH", seat: seat.index, heroId: pick(rng, state.pools[seat.index]) }
        : { t: "pickF", seat: seat.index, factionId: pick(rng, state.pools[seat.index]) };
    } else if (state.phase === "position") {
      event = { t: "pickP", seat: seat.index, position: Number(pick(rng, state.pools[seat.index])) };
    } else if (state.phase === "faction") {
      event = { t: "pickF", seat: seat.index, factionId: pick(rng, state.pools[seat.index]) };
    } else {
      event = { t: "pickH", seat: seat.index, heroId: pick(rng, state.pools[seat.index]) };
    }

    log.push(event);
    state = reduce(config, seed, log);
  }

  return { state, log };
}

function untouched(state: DraftState): string[] {
  const banned = new Set(state.bannedFactions);
  return state.config.factionIds.filter((id) => !banned.has(id));
}

const RUNS = 150;

/** Each run plays a whole draft and replays the log after every move, so a
 * hundred and fifty of them is seconds rather than milliseconds. Generous
 * enough that a slow machine does not turn a passing suite red. */
const SLOW = 60_000;

describe("draft invariants", () => {
  it("P1: no two players ever end up on the same faction", () => {
    const rng = mulberry32(1);
    for (let run = 0; run < RUNS; run++) {
      const config = randomConfig(rng);
      const { state } = playOut(config, `seed${run}`, rng);
      expect(state.phase, `run ${run} did not finish`).toBe("done");
      const factions = state.seats.map((s) => s.factionId);
      expect(new Set(factions).size, `run ${run}: ${factions.join()}`).toBe(config.players);
      expect(factions.every((id) => id && config.factionIds.includes(id))).toBe(true);
    }
  }, SLOW);

  it("P2: under the 'own' policy every hero belongs to its player's faction", () => {
    const rng = mulberry32(2);
    for (let run = 0; run < RUNS; run++) {
      const config = { ...randomConfig(rng), heroFactionPolicy: "own" as const };
      const { state } = playOut(repair(config), `own${run}`, rng);
      expect(state.phase).toBe("done");
      for (const seat of state.seats) {
        expect(hero(seat.heroId!)?.factionId, `seat ${seat.index} in run ${run}`).toBe(seat.factionId);
      }
    }
  }, SLOW);

  it("P3: uniqueHeroIdentity stops two players both drafting Tarnum", () => {
    const rng = mulberry32(3);
    for (let run = 0; run < RUNS; run++) {
      const config = repair({ ...randomConfig(rng), uniqueHeroIdentity: true });
      const { state } = playOut(config, `who${run}`, rng);
      const identities = state.seats.map((s) => hero(s.heroId!)!.identity);
      expect(new Set(identities).size, `run ${run}: ${identities.join()}`).toBe(config.players);
    }
  }, SLOW);

  it("P3b: 'unique-faction' gives every hero a different home faction", () => {
    const rng = mulberry32(13);
    for (let run = 0; run < RUNS; run++) {
      const config = repair({ ...randomConfig(rng), heroFactionPolicy: "unique-faction" as const });
      const { state } = playOut(config, `uf${run}`, rng);
      const homes = state.seats.map((s) => hero(s.heroId!)!.factionId);
      expect(new Set(homes).size, `run ${run}: ${homes.join()}`).toBe(config.players);
      // The rule does not apply to combined picks: there is no "other town"
      // yet when the first player takes their hero.
      if (!config.heroMayComeFromAnotherPlayersTown && !config.combinedPicks) {
        for (const seat of state.seats) {
          const home = hero(seat.heroId!)!.factionId;
          const otherTowns = state.seats.filter((s) => s.index !== seat.index).map((s) => s.factionId);
          expect(otherTowns).not.toContain(home);
        }
      }
    }
  }, SLOW);

  it("P4: a feasible draft never deadlocks", () => {
    const rng = mulberry32(4);
    for (let run = 0; run < RUNS; run++) {
      const config = randomConfig(rng);
      expect(feasibility(config).ok, `run ${run}: repair() left an infeasible config`).toBe(true);
      const { state } = playOut(config, `live${run}`, rng);
      expect(state.phase, `run ${run} stalled in ${state.phase}`).toBe("done");
      // Every seat had something to take at every step, which is what
      // feasibility() promises up front.
      expect(state.seats.every((s) => s.factionId && s.heroId)).toBe(true);
      // Everybody has somewhere to sit, and no two in the same place.
      const seats = state.seats.map((s) => seatPosition(state, s.index));
      expect(new Set(seats).size).toBe(config.players);
      expect(Math.min(...seats)).toBe(1);
      expect(Math.max(...seats)).toBe(config.players);
    }
  }, SLOW);

  it("P6: replay is deterministic", () => {
    const rng = mulberry32(6);
    for (let run = 0; run < 100; run++) {
      const config = randomConfig(rng);
      const { state, log } = playOut(config, `det${run}`, rng);
      const again = reduce(config, `det${run}`, log);
      expect(again.hash).toBe(state.hash);
      expect(again.seats).toEqual(state.seats);
      expect(again.pools).toEqual(state.pools);
      expect(again.order).toEqual(state.order);
    }
  }, SLOW);

  it("P7: dealt pools are pairwise disjoint, so simultaneous picks cannot collide", () => {
    const rng = mulberry32(7);
    for (let run = 0; run < RUNS; run++) {
      // Disjoint dealing is what the simultaneous shape rests on; combined
      // picks are sequential by construction and have nothing to be disjoint.
      const config = repair({ ...randomConfig(rng), format: "dealt" as const, combinedPicks: false });
      const log: DraftEvent[] = [{ t: "start" }];
      let state = reduce(config, `deal${run}`, log);

      // Ban phase first, if there is one, so the faction deal is examined on
      // the table the players will actually see.
      while (state.phase === "ban") {
        const seat = state.seats.find((s) => canMove(state, s.index))!;
        log.push({ t: "ban", seat: seat.index, factionId: pick(rng, untouched(state)) });
        state = reduce(config, `deal${run}`, log);
      }

      expectDisjoint(state, run, "faction");

      for (const seat of state.seats) {
        log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
      }
      state = reduce(config, `deal${run}`, log);
      expectDisjoint(state, run, "hero");
    }
  }, SLOW);
});

function expectDisjoint(state: DraftState, run: number, label: string) {
  const seen = new Map<string, number>();
  for (const seat of state.seats) {
    for (const id of state.pools[seat.index] ?? []) {
      const previous = seen.get(id);
      expect(previous, `run ${run} ${label}: ${id} offered to seats ${previous} and ${seat.index}`).toBe(
        undefined,
      );
      seen.set(id, seat.index);
    }
  }
}

describe("pool stability", () => {
  it("a dealt pool does not change when somebody else picks", () => {
    const config = repair({ ...defaultConfig(), format: "dealt", players: 4, combinedPicks: false });
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "stable", log);
    const before = { ...state.pools };

    log.push({ t: "pickF", seat: 0, factionId: state.pools[0][0] });
    state = reduce(config, "stable", log);

    for (const seat of [1, 2, 3]) {
      expect(state.pools[seat], `seat ${seat}'s pool moved under them`).toEqual(before[seat]);
    }
  });
});

describe("move legality", () => {
  it("refuses a faction that was not in the seat's pool", () => {
    const config = repair({ ...defaultConfig(), format: "dealt", players: 3 });
    const state = reduce(config, "legal", [{ t: "start" }]);
    const notOffered = config.factionIds.find((id) => !state.pools[0].includes(id))!;
    const result = apply(state, { t: "pickF", seat: 0, factionId: notOffered });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.rejection).toBe("not-in-pool");
  });

  it("refuses a move out of turn in a snake draft", () => {
    const config = repair({ ...defaultConfig(), format: "snake", players: 3 });
    const state = reduce(config, "turns", [{ t: "start" }]);
    const notMyTurn = state.order[1];
    const result = apply(state, { t: "pickF", seat: notMyTurn, factionId: config.factionIds[0] });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.rejection).toBe("not-your-turn");
  });

  it("refuses a ban once a seat has spent its budget", () => {
    const config = repair({ ...defaultConfig(), bansPerPlayer: 1, players: 2, format: "snake" });
    let state = reduce(config, "bans", [{ t: "start" }]);
    const first = state.turn!;
    state = reduce(config, "bans", [
      { t: "start" },
      { t: "ban", seat: first, factionId: config.factionIds[0] },
    ]);
    const result = apply(state, { t: "ban", seat: first, factionId: config.factionIds[1] });
    expect(result.ok).toBe(false);
    // The budget is checked before the turn, because "you have no bans left"
    // is the useful half of the truth when both are true.
    expect(result.ok === false && result.rejection).toBe("out-of-bans");
  });

  it("blind bans allow a duplicate rather than leaking that it was taken", () => {
    const config = repair({
      ...defaultConfig(),
      bansPerPlayer: 1,
      banVisibility: "blind",
      players: 2,
    });
    const target = config.factionIds[0];
    const state = reduce(config, "blind", [
      { t: "start" },
      { t: "ban", seat: 0, factionId: target },
      { t: "ban", seat: 1, factionId: target },
    ]);
    expect(state.bannedFactions).toEqual([target]);
    expect(state.seats[0].bans).toEqual([target]);
    expect(state.seats[1].bans).toEqual([target]);
    expect(state.phase).toBe("faction");
  });

  it("undo takes back the last move but not the start", () => {
    const config = repair({ ...defaultConfig(), format: "snake", players: 3 });
    const opening: DraftEvent[] = [{ t: "start" }];
    const first = reduce(config, "undo", opening);
    const withPick: DraftEvent[] = [...opening, { t: "pickF", seat: first.turn!, factionId: first.pools[first.turn!][0] }];
    const undone = reduce(config, "undo", [...withPick, { t: "undo" }]);
    expect(undone.phase).toBe("faction");
    expect(undone.hash).toBe(first.hash);
  });
});

describe("catalogue", () => {
  it("every faction has heroes, or a draft on it could not finish", () => {
    for (const faction of FACTIONS) {
      expect(HEROES.filter((h) => h.factionId === faction.id).length).toBeGreaterThan(0);
    }
  });

  it("knows that Tarnum and Lord Haart are the same person in several towns", () => {
    const counts = new Map<string, number>();
    for (const h of HEROES) counts.set(h.identity, (counts.get(h.identity) ?? 0) + 1);
    expect(counts.get("tarnum")).toBeGreaterThan(1);
    expect(counts.get("lord-haart")).toBeGreaterThan(1);
  });

  it("legalHeroes hides an identity another seat already took", () => {
    const config = repair({ ...defaultConfig(), players: 2, heroFactionPolicy: "any" as const });
    const state = reduce(config, "ident", [{ t: "start" }]);
    const tarnum = HEROES.find((h) => h.identity === "tarnum")!;
    const withTarnum: DraftState = {
      ...state,
      phase: "hero",
      seats: state.seats.map((s) => (s.index === 0 ? { ...s, heroId: tarnum.id } : s)),
    };
    const others = legalHeroes(withTarnum, 1).map((h) => h.identity);
    expect(others).not.toContain("tarnum");
  });
});

describe("a hero pool of 'all'", () => {
  const allConfig = (over: Partial<DraftConfig> = {}) =>
    repair({ ...defaultConfig(), players: 4, heroPoolSize: HERO_POOL_ALL, ...over });

  it("survives repair rather than being clamped to a number", () => {
    expect(allConfig().heroPoolSize).toBe(HERO_POOL_ALL);
    expect(feasibility(allConfig()).ok).toBe(true);
  });

  it("offers a seat its whole faction", () => {
    const config = allConfig();
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "all", log);
    for (const seat of state.seats) {
      log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
    }
    state = reduce(config, "all", log);

    const movable = state.turn ?? state.order.find((i) => canMove(state, i))!;
    const own = HEROES.filter((h) => h.factionId === state.seats[movable].factionId);
    // Everything from that faction bar anything a uniqueness rule has removed.
    expect(state.pools[movable].length).toBeGreaterThan(1);
    expect(state.pools[movable].every((id) => hero(id)!.factionId === state.seats[movable].factionId)).toBe(
      true,
    );
    expect(state.pools[movable].length).toBeLessThanOrEqual(own.length);
  });

  it("still lets only one player be Tarnum", () => {
    const rng = mulberry32(31);
    for (let run = 0; run < 80; run++) {
      const config = allConfig({ players: 2 + Math.floor(rng() * 5), uniqueHeroIdentity: true });
      const { state } = playOut(config, `alltarnum${run}`, rng);
      expect(state.phase, `run ${run} stalled in ${state.phase}`).toBe("done");
      const identities = state.seats.map((s) => hero(s.heroId!)!.identity);
      expect(new Set(identities).size, `run ${run}: ${identities.join()}`).toBe(config.players);
    }
  }, SLOW);

  it("goes round the table when two seats could be offered the same person", () => {
    // Castle and Conflux both have a Tarnum, so those two pools overlap.
    const config = repair({
      ...defaultConfig(),
      players: 2,
      heroPoolSize: HERO_POOL_ALL,
      uniqueHeroIdentity: true,
      factionIds: ["castle", "conflux"],
    });
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "collide", log);
    for (const seat of state.seats) {
      log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
    }
    state = reduce(config, "collide", log);
    expect(state.phase).toBe("hero");
    expect(state.turn, "a colliding all-pool has to be sequential").not.toBeNull();
  });

  it("keeps picking at once when nothing can collide", () => {
    // No shared identities between these two, and identity uniqueness off.
    const config = repair({
      ...defaultConfig(),
      players: 2,
      heroPoolSize: HERO_POOL_ALL,
      uniqueHeroIdentity: false,
      factionIds: ["tower", "cove"],
    });
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "apart", log);
    for (const seat of state.seats) {
      log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
    }
    state = reduce(config, "apart", log);
    expect(state.phase).toBe("hero");
    expect(state.turn).toBeNull();
  });
});

describe("double-sided hero cards", () => {
  const pairOf = (id: string) => hero(id)!.pairedWith!;

  /** A draft stopped at the hero step, with both seats' factions settled. */
  function atHeroStep(over: Partial<DraftConfig> = {}) {
    const config = repair({
      ...defaultConfig(),
      players: 2,
      heroFactionPolicy: "any" as const,
      uniqueHeroIdentity: false,
      heroPoolSize: 1,
      ...over,
    });
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "cards", log);
    for (const seat of state.seats) {
      log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
    }
    state = reduce(config, "cards", log);
    return { config, log, state };
  }

  it("knows both sides of every card, and knows them the same way round", () => {
    for (const h of HEROES) {
      if (!h.pairedWith) continue;
      expect(hero(h.pairedWith), `${h.id} names a hero that is not there`).toBeTruthy();
      expect(hero(h.pairedWith)!.pairedWith, `${h.id} is not paired back`).toBe(h.id);
    }
    // Every printed hero is on a card with another. Factory is print-and-play,
    // so nothing there is printed back to back and nothing there is paired.
    const unpaired = HEROES.filter((h) => !h.pairedWith);
    expect(unpaired.every((h) => h.factionId === "factory")).toBe(true);
    expect(HEROES.filter((h) => h.factionId !== "factory").every((h) => h.pairedWith)).toBe(true);
  });

  it("keeps Tarnum's six cards down to three", () => {
    const tarnums = HEROES.filter((h) => h.identity === "tarnum");
    expect(tarnums).toHaveLength(6);
    const cards = new Set(tarnums.map((h) => [h.id, h.pairedWith].sort().join("+")));
    // Two of his cards pair him with a townsman rather than with himself.
    expect(cards.size).toBe(4);
  });

  it("takes the other face out of the game when one is drafted", () => {
    const { config, log, state } = atHeroStep({ sharedHeroCards: true });
    const taker = state.order[0];
    const taken = state.pools[taker][0];
    const back = pairOf(taken);

    const after = reduce(config, "cards", [...log, { t: "pickH", seat: taker, heroId: taken }]);
    for (const seat of after.seats) {
      expect(legalHeroes(after, seat.index).map((h) => h.id)).not.toContain(back);
    }
  });

  it("leaves the other face alone when one is banned", () => {
    const { config, log, state } = atHeroStep({ sharedHeroCards: true, heroBansPerPlayer: 1 });
    expect(state.phase).toBe("banHero");

    const banner = state.turn ?? state.order[0];
    const victim = legalHeroBans(state, banner)[0];
    const back = pairOf(victim);

    const after = reduce(config, "cards", [...log, { t: "banH", seat: banner, heroId: victim }]);
    expect(after.bannedHeroes).toContain(victim);
    // The ban took the hero, not the card.
    expect(after.bannedHeroes).not.toContain(back);
    const stillThere = after.order.some((i) =>
      legalHeroes(after, i, { ignoreTaken: true }).some((h) => h.id === back),
    );
    expect(stillThere, `${back} left with ${victim}`).toBe(true);
  });

  it("does nothing at all while the setting is off", () => {
    const { config, log, state } = atHeroStep({ sharedHeroCards: false });
    const taker = state.order[0];
    const taken = state.pools[taker][0];
    const back = pairOf(taken);

    const after = reduce(config, "cards", [...log, { t: "pickH", seat: taker, heroId: taken }]);
    const other = after.order.find((i) => i !== taker)!;
    expect(legalHeroes(after, other).map((h) => h.id)).toContain(back);
  });

  it("never offers both faces of one card at the same time", () => {
    const rng = mulberry32(57);
    for (let run = 0; run < 60; run++) {
      const config = repair({
        ...randomConfig(rng),
        sharedHeroCards: true,
        heroFactionPolicy: "any" as const,
      });
      const { state } = playOut(config, `card${run}`, rng);
      expect(state.phase, `run ${run} stalled in ${state.phase}`).toBe("done");
      const cards = state.seats.map((s) => {
        const h = hero(s.heroId!)!;
        return h.pairedWith ? [h.id, h.pairedWith].sort().join("+") : h.id;
      });
      expect(new Set(cards).size, `run ${run}: two players took one card`).toBe(config.players);
    }
  }, SLOW);
});

describe("banning heroes", () => {
  const banConfig = (over: Partial<DraftConfig> = {}) =>
    repair({ ...defaultConfig(), players: 4, heroBansPerPlayer: 2, ...over });

  /** Plays the faction phase out so the hero-ban round is on the table. */
  function toHeroBans(config: DraftConfig, seed: string) {
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, seed, log);
    while (state.phase === "ban") {
      const seat = state.seats.find((s) => canMove(state, s.index))!;
      const offered = config.factionIds.filter((id) => !seat.bans.includes(id));
      log.push({ t: "ban", seat: seat.index, factionId: offered[0] });
      state = reduce(config, seed, log);
    }
    for (const seat of state.seats) {
      log.push({ t: "pickF", seat: seat.index, factionId: state.pools[seat.index][0] });
    }
    return { log, state: reduce(config, seed, log) };
  }

  it("opens a round of its own once the factions are drafted", () => {
    const { state } = toHeroBans(banConfig(), "hb");
    expect(state.phase).toBe("banHero");
    expect(state.seats.every((s) => s.factionId)).toBe(true);
  });

  it("is skipped entirely when nobody has hero bans", () => {
    const { state } = toHeroBans(banConfig({ heroBansPerPlayer: 0 }), "none");
    expect(state.phase).toBe("hero");
  });

  it("only offers heroes somebody could actually draft", () => {
    const config = banConfig({ heroFactionPolicy: "own" });
    const { state } = toHeroBans(config, "own-only");
    const towns = new Set(state.seats.map((s) => s.factionId));
    expect(heroBanOptions(state).length).toBeGreaterThan(0);
    for (const id of heroBanOptions(state)) {
      expect(towns.has(hero(id)!.factionId), `${id} is nobody's to draft`).toBe(true);
    }
  });

  it("takes the banned hero out of every pool", () => {
    const config = banConfig({ heroBansPerPlayer: 1 });
    const started = toHeroBans(config, "gone");
    const victim = legalHeroBans(started.state, started.state.turn ?? 0)[0];
    const log = [...started.log, { t: "banH" as const, seat: started.state.turn ?? 0, heroId: victim }];
    const after = reduce(config, "gone", log);
    expect(after.bannedHeroes).toContain(victim);
    for (const seat of after.seats) {
      expect(legalHeroes(after, seat.index).map((h) => h.id)).not.toContain(victim);
    }
  });

  it("refuses a ban that would leave somebody with nothing to draft", () => {
    // One faction, one player, a pool of everything: banning it down to the
    // last hero has to stop before that hero.
    const config = repair({
      ...defaultConfig(),
      players: 2,
      heroBansPerPlayer: 2,
      heroPoolSize: 3,
      factionIds: ["tower", "cove"],
    });
    const { state } = toHeroBans(config, "starve");
    for (const seatIndex of state.order) {
      for (const id of legalHeroBans(state, seatIndex)) {
        const after = reduce(config, "starve", [
          ...toHeroBans(config, "starve").log,
          { t: "banH", seat: state.turn ?? seatIndex, heroId: id },
        ]);
        for (const seat of after.seats) {
          if (after.phase === "hero" || after.phase === "banHero") {
            expect(legalHeroes(after, seat.index).length).toBeGreaterThanOrEqual(1);
          }
        }
      }
    }
  });

  it("P4 still holds with hero bans in play: no draft deadlocks", () => {
    const rng = mulberry32(77);
    for (let run = 0; run < 150; run++) {
      const config = randomConfig(rng);
      expect(feasibility(config).ok).toBe(true);
      const { state } = playOut(config, `hb${run}`, rng);
      expect(state.phase, `run ${run} stalled in ${state.phase}`).toBe("done");
      expect(state.seats.every((s) => s.factionId && s.heroId)).toBe(true);
      // Nobody drafted a hero somebody had banned.
      for (const seat of state.seats) {
        expect(state.bannedHeroes).not.toContain(seat.heroId);
      }
    }
  }, SLOW);
});

describe("a turn that takes both", () => {
  const combined = (over: Partial<DraftConfig> = {}) =>
    repair({ ...defaultConfig(), players: 4, combinedPicks: true, ...over });

  it("gives a seat its hero before the next seat has a faction", () => {
    const config = combined();
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "combined", log);
    expect(state.phase).toBe("pick");

    const first = state.turn!;
    log.push({ t: "pickF", seat: first, factionId: state.pools[first][0] });
    state = reduce(config, "combined", log);
    // Still the same player: they owe a hero before anybody else moves.
    expect(state.turn).toBe(first);
    expect(state.seats.filter((s) => s.factionId)).toHaveLength(1);

    log.push({ t: "pickH", seat: first, heroId: state.pools[first][0] });
    state = reduce(config, "combined", log);
    expect(state.turn).not.toBe(first);
    expect(state.seats[first].heroId).toBeTruthy();
  });

  it("refuses a second player moving before the first has finished", () => {
    const config = combined();
    const state = reduce(config, "queue", [{ t: "start" }]);
    const other = state.order.find((i) => i !== state.turn)!;
    const result = apply(state, { t: "pickF", seat: other, factionId: state.pools[other]?.[0] ?? "castle" });
    expect(result.ok).toBe(false);
  });

  it("puts the hero bans first, since there is no later moment for them", () => {
    const config = combined({ heroBansPerPlayer: 1 });
    const state = reduce(config, "bansfirst", [{ t: "start" }]);
    expect(state.phase).toBe("banHero");
    expect(state.seats.every((s) => s.factionId === null)).toBe(true);
  });
});

describe("drafting where you sit", () => {
  it("hands out every place exactly once", () => {
    const rng = mulberry32(91);
    for (let run = 0; run < 60; run++) {
      const config = repair({ ...defaultConfig(), players: 2 + Math.floor(rng() * 5), draftSeats: true });
      const { state } = playOut(config, `seats${run}`, rng);
      expect(state.phase).toBe("done");
      const taken = state.seats.map((s) => s.position);
      expect(new Set(taken).size).toBe(config.players);
      expect([...taken].sort((a, b) => a! - b!)).toEqual(
        Array.from({ length: config.players }, (_, i) => i + 1),
      );
    }
  }, SLOW);

  it("falls back to the seed's order when it is not drafted", () => {
    const config = repair({ ...defaultConfig(), players: 4, draftSeats: false });
    const state = reduce(config, "rolled", [{ t: "start" }]);
    expect(state.seats.every((s) => s.position === null)).toBe(true);
    for (const [place, seatIndex] of state.order.entries()) {
      expect(seatPosition(state, seatIndex)).toBe(place + 1);
    }
  });

  it("comes after everything else, so the choice is an informed one", () => {
    const config = repair({ ...defaultConfig(), players: 3, draftSeats: true });
    const { state, log } = playOut(config, "last", mulberry32(4));
    expect(state.phase).toBe("done");
    const lastMoves = log.slice(-config.players).map((e) => e.t);
    expect(lastMoves.every((t) => t === "pickP")).toBe(true);
  });
});
