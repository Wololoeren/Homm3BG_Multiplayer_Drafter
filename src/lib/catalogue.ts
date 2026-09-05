import factionsJson from "@/data/factions.json";
import heroesJson from "@/data/heroes.json";
import { hash32 } from "./rng";
import type { Faction, Hero } from "./draftTypes";

/**
 * The factions and heroes the game has, scraped from the community card
 * database by scripts/build-catalogue.mjs and committed. Data, not code:
 * Archon has announced Factory, Bulwark and Forge, so a new faction has to be
 * a JSON diff and nothing else.
 */

export const FACTIONS: Faction[] = factionsJson.factions;
export const HEROES: Hero[] = heroesJson.heroes as Hero[];

const FACTION_BY_ID = new Map(FACTIONS.map((f) => [f.id, f]));
const HERO_BY_ID = new Map(HEROES.map((h) => [h.id, h]));

export function faction(id: string): Faction | undefined {
  return FACTION_BY_ID.get(id);
}

export function hero(id: string): Hero | undefined {
  return HERO_BY_ID.get(id);
}

export function factionName(id: string): string {
  return FACTION_BY_ID.get(id)?.name ?? id;
}

export function heroName(id: string): string {
  return HERO_BY_ID.get(id)?.name ?? id;
}

export function heroesOf(factionId: string): Hero[] {
  return HEROES.filter((h) => h.factionId === factionId);
}

/** Every box the catalogue mentions, in the order the factions come in, so the
 * lobby's ownership toggles read like a shelf rather than an alphabet. */
export const SETS: string[] = (() => {
  const seen: string[] = [];
  for (const item of [...FACTIONS, ...HEROES]) {
    if (!seen.includes(item.set)) seen.push(item.set);
  }
  return seen;
})();

/** "tower-expansion" -> "Tower Expansion". The set ids come from the upstream
 * page titles, so title-casing them back is enough — no separate label table
 * to fall out of date when a box is added. */
export function setLabel(set: string): string {
  return set
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Identifies this exact roster. A draft code stores factions and heroes as
 * indices into the sorted id lists, which is what keeps codes short — but it
 * means a code minted against a different roster would decode to the wrong
 * factions. Codes carry this fingerprint and refuse to open rather than
 * silently deal something else.
 */
export const CATALOGUE_FINGERPRINT: number =
  hash32([...FACTIONS.map((f) => f.id), ...HEROES.map((h) => h.id)].join(",")) & 0xffff;

/** Index order for the draft code. Sorted, not source order, so a reordering
 * of the JSON does not invalidate every code in circulation. */
export const FACTION_INDEX: string[] = FACTIONS.map((f) => f.id).sort();
export const HERO_INDEX: string[] = HEROES.map((h) => h.id).sort();
