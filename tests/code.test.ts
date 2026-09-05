import { describe, expect, it } from "vitest";
import { FACTIONS, HEROES } from "@/lib/catalogue";
import { DraftCodeError, decodeDraft, encodeDraft, formatCode, parse } from "@/lib/draftCode";
import { defaultConfig, repair } from "@/lib/draftConfig";
import { reduce } from "@/lib/draftEngine";
import { mulberry32 } from "@/lib/rng";
import type { DraftConfig, DraftEvent } from "@/lib/draftTypes";

const pick = <T,>(rng: () => number, items: readonly T[]): T => items[Math.floor(rng() * items.length)];

function randomConfig(rng: () => number): DraftConfig {
  return repair({
    ...defaultConfig(),
    players: 2 + Math.floor(rng() * 7),
    format: pick(rng, ["dealt", "snake"] as const),
    factionPoolSize: 1 + Math.floor(rng() * 5),
    heroPoolSize: 1 + Math.floor(rng() * 5),
    bansPerPlayer: Math.floor(rng() * 3),
    banVisibility: pick(rng, ["open", "blind"] as const),
    heroFactionPolicy: pick(rng, ["own", "unique-faction", "any"] as const),
    uniqueHeroIdentity: rng() < 0.8,
    heroMayComeFromAnotherPlayersTown: rng() < 0.5,
    factionIds: FACTIONS.filter(() => rng() < 0.85).map((f) => f.id),
    heroIds: HEROES.filter(() => rng() < 0.9).map((h) => h.id),
  });
}

describe("draft codes", () => {
  it("P5: round-trips config, seed and log", () => {
    const rng = mulberry32(11);
    for (let run = 0; run < 400; run++) {
      const config = randomConfig(rng);
      const seed = `S${run.toString(32)}`;
      const events: DraftEvent[] = [
        { t: "join", seat: 0, name: "Ægir" },
        { t: "join", seat: 1, name: "P2" },
        { t: "start" },
      ];
      const code = encodeDraft(config, seed, events);
      const back = decodeDraft(code);
      expect(back.config).toEqual(config);
      expect(back.seed).toBe(seed);
      expect(back.events).toEqual(events);
    }
  });

  it("survives being read out loud and typed back in", () => {
    const config = defaultConfig();
    const code = encodeDraft(config, "ABC12");
    // Grouped for reading, lower-cased by a phone keyboard, and with the
    // characters people hear wrong substituted in.
    const spoken = formatCode(code).toLowerCase().replace(/1/g, "l").replace(/0/g, "o");
    expect(parse(spoken)).toBe(code);
    expect(decodeDraft(spoken).seed).toBe("ABC12");
  });

  it("a setup code stays short enough to read to a table", () => {
    const code = encodeDraft(defaultConfig(), "ABC12");
    expect(code.length).toBeLessThanOrEqual(40);
  });

  it("a finished six-player draft still fits in a URL", () => {
    const config = repair({ ...defaultConfig(), players: 6, bansPerPlayer: 1, format: "snake" });
    const log: DraftEvent[] = [{ t: "start" }];
    let state = reduce(config, "long", log);
    const rng = mulberry32(99);
    while (state.phase !== "done") {
      const seat = state.turn ?? state.seats.findIndex((s) => !s.factionId || !s.heroId);
      if (state.phase === "ban") {
        log.push({ t: "ban", seat, factionId: pick(rng, state.config.factionIds) });
      } else if (state.phase === "faction") {
        log.push({ t: "pickF", seat, factionId: state.pools[seat][0] });
      } else {
        log.push({ t: "pickH", seat, heroId: state.pools[seat][0] });
      }
      state = reduce(config, "long", log);
    }
    expect(encodeDraft(config, "long", log).length).toBeLessThan(200);
  });

  it("refuses a code minted against a different roster", () => {
    const code = encodeDraft(defaultConfig(), "ABC12");
    // Flip a fingerprint bit: bytes 1-2 land in the first four base32 chars.
    const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    const at = 3;
    const swapped =
      code.slice(0, at) + alphabet[(alphabet.indexOf(code[at]) + 1) % 32] + code.slice(at + 1);
    expect(() => decodeDraft(swapped)).toThrow(DraftCodeError);
    try {
      decodeDraft(swapped);
    } catch (error) {
      expect((error as DraftCodeError).reason).toBe("catalogue");
    }
  });

  it("keeps a fan expansion a draft opted into", () => {
    // The default leaves Factory out, so a config that includes it is exactly
    // the case a sanitiser filtering against the *default* list would quietly
    // strip — losing a faction from a pasted code without a word.
    const withFactory = repair({
      ...defaultConfig(),
      players: 3,
      factionIds: FACTIONS.map((f) => f.id),
      heroIds: HEROES.map((h) => h.id),
    });
    expect(withFactory.factionIds).toContain("factory");

    const back = decodeDraft(encodeDraft(withFactory, "fan"));
    expect(back.config.factionIds).toContain("factory");
    expect(back.config).toEqual(withFactory);
  });

  it("leaves a fan expansion out of a draft that never asked for it", () => {
    const plain = defaultConfig();
    expect(plain.factionIds).not.toContain("factory");
    expect(plain.heroIds.some((id) => id.endsWith("-factory"))).toBe(false);
    expect(decodeDraft(encodeDraft(plain, "plain")).config).toEqual(plain);
  });

  it("refuses junk rather than half-decoding it", () => {
    expect(() => decodeDraft("")).toThrow(DraftCodeError);
    expect(() => decodeDraft("!!!!")).toThrow(DraftCodeError);
    expect(() => decodeDraft("ZZZZZZZZ")).toThrow(DraftCodeError);
  });

  it("a decoded log replays to the same state it was encoded from", () => {
    const config = repair({ ...defaultConfig(), players: 3 });
    const log: DraftEvent[] = [
      { t: "join", seat: 0, name: "A" },
      { t: "join", seat: 1, name: "B" },
      { t: "join", seat: 2, name: "C" },
      { t: "start" },
    ];
    const before = reduce(config, "replay", log);
    const back = decodeDraft(encodeDraft(config, "replay", log));
    const after = reduce(back.config, back.seed, back.events);
    expect(after.hash).toBe(before.hash);
    expect(after.pools).toEqual(before.pools);
  });
});
