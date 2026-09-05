import { describe, expect, it } from "vitest";
import { FACTIONS, HEROES, hero } from "@/lib/catalogue";
import { defaultConfig, feasibility, repair } from "@/lib/draftConfig";
import { apply, canMove, legalHeroes, reduce } from "@/lib/draftEngine";
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
    banVisibility: pick(rng, ["open", "blind"] as const),
    heroFactionPolicy,
    uniqueHeroIdentity: rng() < 0.8,
    heroMayComeFromAnotherPlayersTown: rng() < 0.5,
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

const RUNS = 300;

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
  });

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
  });

  it("P3: uniqueHeroIdentity stops two players both drafting Tarnum", () => {
    const rng = mulberry32(3);
    for (let run = 0; run < RUNS; run++) {
      const config = repair({ ...randomConfig(rng), uniqueHeroIdentity: true });
      const { state } = playOut(config, `who${run}`, rng);
      const identities = state.seats.map((s) => hero(s.heroId!)!.identity);
      expect(new Set(identities).size, `run ${run}: ${identities.join()}`).toBe(config.players);
    }
  });

  it("P3b: 'unique-faction' gives every hero a different home faction", () => {
    const rng = mulberry32(13);
    for (let run = 0; run < RUNS; run++) {
      const config = repair({ ...randomConfig(rng), heroFactionPolicy: "unique-faction" as const });
      const { state } = playOut(config, `uf${run}`, rng);
      const homes = state.seats.map((s) => hero(s.heroId!)!.factionId);
      expect(new Set(homes).size, `run ${run}: ${homes.join()}`).toBe(config.players);
      if (!config.heroMayComeFromAnotherPlayersTown) {
        for (const seat of state.seats) {
          const home = hero(seat.heroId!)!.factionId;
          const otherTowns = state.seats.filter((s) => s.index !== seat.index).map((s) => s.factionId);
          expect(otherTowns).not.toContain(home);
        }
      }
    }
  });

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
    }
  });

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
  });

  it("P7: dealt pools are pairwise disjoint, so simultaneous picks cannot collide", () => {
    const rng = mulberry32(7);
    for (let run = 0; run < RUNS; run++) {
      const config = repair({ ...randomConfig(rng), format: "dealt" as const });
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
  });
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
    const config = repair({ ...defaultConfig(), format: "dealt", players: 4 });
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
  });

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
  it("is inert while the catalogue has no pairings, which is what ships today", () => {
    expect(HEROES.some((h) => h.pairedWith)).toBe(false);
    const rng = mulberry32(41);
    for (let run = 0; run < 40; run++) {
      const seed = `pairs${run}`;
      const off = repair({ ...defaultConfig(), players: 3, sharedHeroCards: false });
      const on = { ...off, sharedHeroCards: true };
      // Same seed, same moves: with nothing paired the switch cannot bite.
      const played = playOut(off, seed, rng);
      expect(reduce(on, seed, played.log).hash).toBe(played.state.hash);
    }
  });
});
