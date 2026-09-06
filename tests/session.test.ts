import { describe, expect, it } from "vitest";
import { decodeDraft, encodeDraft } from "@/lib/draftCode";
import { defaultConfig, repair } from "@/lib/draftConfig";
import { canMove, legalHeroBans, reduce } from "@/lib/draftEngine";
import { sanitizeSession } from "@/lib/session";
import { mulberry32 } from "@/lib/rng";
import type { DraftEvent } from "@/lib/draftTypes";

const pick = <T,>(rng: () => number, items: readonly T[]): T => items[Math.floor(rng() * items.length)];

/** A draft played to the end, hero bans and all. */
function played() {
  const rng = mulberry32(3);
  const config = repair({
    ...defaultConfig(),
    players: 4,
    heroBansPerPlayer: 2,
    heroFactionPolicy: "unique-faction" as const,
  });
  const log: DraftEvent[] = [{ t: "start" }];
  let state = reduce(config, "SAVED", log);
  for (let guard = 0; guard < 200 && state.phase !== "done"; guard++) {
    const seat = pick(
      rng,
      state.seats.filter((s) => canMove(state, s.index)),
    );
    const i = seat.index;
    if (state.phase === "banHero") {
      log.push({ t: "banH", seat: i, heroId: pick(rng, legalHeroBans(state, i)) });
    } else if (state.phase === "faction") {
      log.push({ t: "pickF", seat: i, factionId: pick(rng, state.pools[i]) });
    } else {
      log.push({ t: "pickH", seat: i, heroId: pick(rng, state.pools[i]) });
    }
    state = reduce(config, "SAVED", log);
  }
  expect(state.phase).toBe("done");
  return { config, log, state };
}

describe("the saved session", () => {
  it("keeps the hero bans it was given", () => {
    const { config, log, state } = played();
    expect(log.filter((e) => e.t === "banH")).toHaveLength(8);

    // Through JSON, which is how it actually reaches localStorage.
    const stored = JSON.parse(JSON.stringify({ config, seed: "SAVED", events: log, mySeat: null, mode: "local" }));
    const back = sanitizeSession(stored);
    expect(back).not.toBeNull();
    expect(back!.events.filter((e) => e.t === "banH")).toHaveLength(8);

    // And the whole draft comes back, not a draft rewound to its ban round.
    const after = reduce(back!.config, back!.seed, back!.events);
    expect(after.phase).toBe("done");
    expect(after.hash).toBe(state.hash);
  });

  it("drops a hero ban naming a hero this build has never heard of", () => {
    const { config, log } = played();
    const events = [...log, { t: "banH", seat: 0, heroId: "nobody-of-that-name" }];
    const back = sanitizeSession({ config, seed: "SAVED", events, mySeat: null, mode: "local" });
    expect(back!.events).toHaveLength(log.length);
  });

  it("a draft that has been round-tripped through a link and a reload still replays", () => {
    // The two ways a draft comes back — a shared link and this browser's own
    // memory — have to agree, or reopening the app rewinds somebody's game.
    const { config, log, state } = played();
    const { config: c2, seed, events } = decodeDraft(encodeDraft(config, "SAVED", log));
    const back = sanitizeSession({ config: c2, seed, events, mySeat: null, mode: "local" });
    expect(reduce(back!.config, back!.seed, back!.events).hash).toBe(state.hash);
  });
});
