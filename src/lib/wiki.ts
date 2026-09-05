import { asset } from "./assets";
import type { Faction, Hero } from "./draftTypes";

/**
 * Where to read more about a faction or a hero.
 *
 * The catalogue carries the whole link rather than a page name to wrap: the
 * official ten point at the community card database, and a fan-made expansion
 * points at its own repository, so there is no single base to bolt a slug on
 * to. It is also what disambiguates the six Tarnums, since the link comes
 * straight from the source rather than from a slug rule that could drift.
 */

export function heroWikiUrl(hero: Hero): string {
  return hero.wiki;
}

export function factionWikiUrl(faction: Faction): string {
  return faction.wiki;
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
