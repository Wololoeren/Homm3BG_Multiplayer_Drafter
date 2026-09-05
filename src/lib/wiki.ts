import { asset } from "./assets";
import type { Faction, Hero } from "./draftTypes";

/**
 * Links out to the community card database, the same wiki the Random Scenario
 * Generator links its campaign casts to.
 *
 * The page name travels in the catalogue rather than being derived from an id,
 * because a slug rule that drifts produces dead links nobody notices for
 * months. scripts/build-catalogue.mjs takes it straight from the wiki's own
 * markdown, which is also what disambiguates the six Tarnums.
 */

const BASE = "https://en.homm3bg.wiki";

export function heroWikiUrl(hero: Hero): string {
  return `${BASE}/heroes/${hero.wiki}/`;
}

export function factionWikiUrl(faction: Faction): string {
  return `${BASE}/towns/${faction.wiki}/`;
}

/**
 * The stat strip for a hero: attack, defense, spell power, knowledge, and the
 * helmet or hat that says might or magic.
 *
 * Derived from the faction and class rather than stored per hero, because
 * that is genuinely all it depends on — every Castle might hero has the same
 * base statistics, which is why twenty images cover sixty-four heroes. Unlike
 * the wiki page names these are our own files, so a name that does not resolve
 * is our bug and shows up the moment anybody opens the hero step.
 *
 * Composited for the Hero Randomizer from the community Cards Database; see
 * that repo if a new faction needs one.
 */
export function heroStatsImage(hero: Hero): string {
  return asset(`/heroes/hero_stats-${hero.factionId}-${hero.klass}.webp`);
}
