import { describe, expect, it } from "vitest";
import { encodeDraft } from "@/lib/draftCode";
import { defaultConfig, repair } from "@/lib/draftConfig";
import { canMove, reduce } from "@/lib/draftEngine";
import { acceptEvents, canonicalise, eventKey, mergeEvents } from "@/lib/draftLog";
import { mulberry32, shuffle } from "@/lib/rng";
import type { DraftConfig, DraftEvent } from "@/lib/draftTypes";

/**
 * P8, the property the networked transports rest on: what a client ends up
 * holding depends on *which* moves it received, never on the order they
 * arrived in. Without it two players in the same draft would compute different
 * hashes and each conclude the other had desynced.
 */

type Rng = () => number;
const pick = <T,>(rng: Rng, items: readonly T[]): T => items[Math.floor(rng() * items.length)];

function playOut(config: DraftConfig, seed: string, rng: Rng): DraftEvent[] {
  const log: DraftEvent[] = [];
  for (let i = 0; i < config.players; i++) log.push({ t: "join", seat: i, name: `P${i + 1}` });
  log.push({ t: "start" });
  let state = reduce(config, seed, log);

  for (let guard = 0; guard < 200 && state.phase !== "done"; guard++) {
    const seat = pick(rng, state.seats.filter((s) => canMove(state, s.index)));
    if (state.phase === "ban") {
      const offered = state.config.banVisibility === "blind" ? config.factionIds : untouched(state);
      log.push({
        t: "ban",
        seat: seat.index,
        factionId: pick(rng, offered.filter((id) => !seat.bans.includes(id))),
      });
    } else if (state.phase === "faction") {
      log.push({ t: "pickF", seat: seat.index, factionId: pick(rng, state.pools[seat.index]) });
    } else {
      log.push({ t: "pickH", seat: seat.index, heroId: pick(rng, state.pools[seat.index]) });
    }
    state = reduce(config, seed, log);
  }
  return log;
}

function untouched(state: ReturnType<typeof reduce>): string[] {
  const banned = new Set(state.bannedFactions);
  return state.config.factionIds.filter((id) => !banned.has(id));
}

function randomConfig(rng: Rng): DraftConfig {
  return repair({
    ...defaultConfig(),
    players: 2 + Math.floor(rng() * 5),
    format: pick(rng, ["dealt", "snake"] as const),
    factionPoolSize: 1 + Math.floor(rng() * 4),
    heroPoolSize: 1 + Math.floor(rng() * 4),
    bansPerPlayer: Math.floor(rng() * 3),
    banVisibility: pick(rng, ["open", "blind"] as const),
  });
}

describe("merging", () => {
  it("gives every legal move its own identity", () => {
    const keys = [
      eventKey({ t: "ban", seat: 0, factionId: "castle" }),
      eventKey({ t: "ban", seat: 0, factionId: "tower" }),
      eventKey({ t: "ban", seat: 1, factionId: "castle" }),
      eventKey({ t: "pickF", seat: 0, factionId: "castle" }),
      eventKey({ t: "pickH", seat: 0, heroId: "valeska" }),
    ];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("treats a second join from a seat as a rename", () => {
    const merged = mergeEvents(
      [{ t: "join", seat: 0, name: "Ada" }],
      [{ t: "join", seat: 0, name: "Ada Lovelace" }],
    );
    expect(merged).toEqual([{ t: "join", seat: 0, name: "Ada Lovelace" }]);
  });

  it("is idempotent, so a peer can be re-sent the whole log at any time", () => {
    const config = repair({ ...defaultConfig(), players: 3 });
    const log = playOut(config, "idem", mulberry32(5));
    expect(mergeEvents(log, log)).toHaveLength(log.length);
    expect(acceptEvents(config, "idem", log, log).log).toHaveLength(log.length);
  });
});

describe("P8: arrival order does not matter", () => {
  it("converges on the same log, state and code however the moves arrive", () => {
    const rng = mulberry32(21);
    for (let run = 0; run < 60; run++) {
      const config = randomConfig(rng);
      const seed = `net${run}`;
      const truth = playOut(config, seed, rng);
      const expectedLog = canonicalise(config, seed, truth);
      const expectedState = reduce(config, seed, expectedLog);
      const expectedCode = encodeDraft(config, seed, expectedLog);

      // Five clients, each fed the same moves in a different order and in
      // different sized batches, the way a flaky wire would deliver them.
      for (let client = 0; client < 5; client++) {
        const arrival = shuffle(mulberry32(run * 10 + client), truth);
        let log: DraftEvent[] = [];
        for (let at = 0; at < arrival.length; at += 1 + Math.floor(rng() * 3)) {
          const batch = arrival.slice(at, at + 3);
          log = acceptEvents(config, seed, log, batch).log;
        }
        // Anything held back on the way is delivered again, as a peer would.
        log = acceptEvents(config, seed, log, arrival).log;

        expect(log, `run ${run} client ${client}`).toEqual(expectedLog);
        const state = reduce(config, seed, log);
        expect(state.hash, `run ${run} client ${client} hash`).toBe(expectedState.hash);
        expect(encodeDraft(config, seed, log)).toBe(expectedCode);
      }
    }
  });

  it("holds a move that has overtaken the one it depends on, then applies it", () => {
    const config = repair({ ...defaultConfig(), players: 3, format: "snake" });
    const seed = "overtake";
    const truth = playOut(config, seed, mulberry32(9));

    // Deliver the last move first: it cannot apply to an empty log.
    const last = truth[truth.length - 1];
    const first = acceptEvents(config, seed, [], [last]);
    expect(first.log).toHaveLength(0);
    expect(first.held).toEqual([last]);

    const settled = acceptEvents(config, seed, [], [last, ...truth.slice(0, -1)]);
    expect(settled.held).toHaveLength(0);
    expect(reduce(config, seed, settled.log).phase).toBe("done");
  });

  it("refuses a move that is not legal for anybody", () => {
    const config = repair({ ...defaultConfig(), players: 2 });
    const bogus: DraftEvent = { t: "pickF", seat: 0, factionId: "atlantis" };
    const { log, held } = acceptEvents(config, "bogus", [{ t: "start" }], [bogus]);
    expect(log).toEqual([{ t: "start" }]);
    expect(held).toEqual([bogus]);
  });
});
