import { describe, expect, it } from "vitest";
import { FACTIONS, HEROES } from "@/lib/catalogue";
import { defaultConfig, feasibility, repair } from "@/lib/draftConfig";

/**
 * The limit documented in docs/PLAN.md §4.1: a dealt draft needs
 * `players x pool` factions on the table once the bans are gone.
 *
 * Written against the catalogue's own size rather than a pinned ten, because
 * factions get added — the fan-made Factory took it to eleven — and the point
 * of the rule is the arithmetic, not the number that happened to come out of
 * it on the day it was written.
 */
/** How many factions a fresh draft starts with — the official ten; the
 * unofficial Factory is switched on in the lobby, not by default. */
const TABLE = defaultConfig().factionIds.length;

describe("what the dealt format can actually deal", () => {
  const cases: Array<[players: number, bans: number]> = [
    [2, 0],
    [3, 1],
    [4, 0],
    [4, 1],
    [6, 0],
  ];

  it.each(cases)("deals %i players with %i ban(s) each as much as will fit", (players, bans) => {
    const left = TABLE - players * bans;
    const maxPool = Math.min(5, Math.floor(left / players));
    const config = { ...defaultConfig(), players, bansPerPlayer: bans, factionPoolSize: maxPool };

    expect(feasibility(config).maxFactionPoolSize).toBe(maxPool);
    expect(feasibility(config).ok).toBe(true);
    // One more than fits is refused, unless the cap was the pool size itself.
    if (maxPool < 5) {
      expect(feasibility({ ...config, factionPoolSize: maxPool + 1 }).ok).toBe(false);
    }
  });
});

describe("feasibility explains itself", () => {
  it("names the arithmetic when the pool will not fit", () => {
    const config = { ...defaultConfig(), players: 6, factionPoolSize: 2 };
    const check = feasibility(config);
    expect(check.ok).toBe(false);
    const issue = check.issues.find((i) => i.code === "faction-pool-too-large")!;
    expect(issue.vars).toMatchObject({
      players: 6,
      pool: 2,
      need: 12,
      left: TABLE,
      max: Math.floor(TABLE / 6),
    });
  });

  it("says when the bans have eaten the table", () => {
    const config = { ...defaultConfig(), players: 5, bansPerPlayer: 2 };
    const check = feasibility(config);
    expect(check.issues.some((i) => i.code === "not-enough-factions")).toBe(true);
    expect(check.factionsAfterBans).toBe(TABLE - 10);
    expect(check.factionsAfterBans).toBeLessThan(config.players);
  });

  it("caps the hero pool at the thinnest faction, allowing for a stolen Tarnum", () => {
    // Six heroes is the thinnest faction, and one of those six can be a hero
    // another town claimed first (Conflux and Necropolis each share one), so
    // the whole roster supports a pool of five.
    expect(feasibility({ ...defaultConfig(), players: 4 }).maxHeroPoolSize).toBe(5);

    // Switch two Conflux heroes off and that faction becomes the binding one:
    // four left, minus Tarnum, who Rampart or Stronghold may take first.
    const thin = defaultConfig();
    const conflux = HEROES.filter((h) => h.factionId === "conflux" && h.identity !== "tarnum");
    const off = new Set(conflux.slice(0, 2).map((h) => h.id));
    const check = feasibility({
      ...thin,
      players: 4,
      heroPoolSize: 5,
      heroIds: thin.heroIds.filter((id) => !off.has(id)),
    });
    expect(check.ok).toBe(false);
    expect(check.maxHeroPoolSize).toBe(3);
    expect(check.issues.some((i) => i.code === "hero-pool-too-large" && i.vars.faction === "conflux")).toBe(
      true,
    );
  });

  it("counts towns, not cards, when two heroes may not share a faction", () => {
    const config = {
      ...defaultConfig(),
      players: 4,
      heroFactionPolicy: "unique-faction" as const,
      heroPoolSize: 5,
    };
    // Four seats needing five distinct home factions each would want twenty
    // towns; the catalogue has nowhere near that.
    expect(feasibility(config).maxHeroPoolSize).toBe(Math.floor(TABLE / 4));
  });
});

describe("repair", () => {
  it("shrinks the pool rather than dropping a ban", () => {
    const fixed = repair({ ...defaultConfig(), players: 4, bansPerPlayer: 1, factionPoolSize: 3 });
    expect(fixed.bansPerPlayer).toBe(1);
    expect(fixed.factionPoolSize).toBe(1);
    expect(feasibility(fixed).ok).toBe(true);
  });

  it("gives a ban back only when shrinking is not enough", () => {
    const fixed = repair({ ...defaultConfig(), players: 5, bansPerPlayer: 2 });
    expect(fixed.bansPerPlayer).toBeLessThan(2);
    expect(feasibility(fixed).ok).toBe(true);
  });

  it("leaves a genuinely impossible table alone for the lobby to explain", () => {
    const config = {
      ...defaultConfig(),
      players: 8,
      factionIds: FACTIONS.slice(0, 3).map((f) => f.id),
    };
    expect(feasibility(repair(config)).ok).toBe(false);
  });
});
