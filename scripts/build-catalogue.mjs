/**
 * Rebuilds src/data/factions.json and src/data/heroes.json from the community
 * card database, which is the same source the Hero Randomizer credits for its
 * art:
 *
 *   https://github.com/Mirzipan/Homm3_BG_Database  (rendered at en.homm3bg.wiki)
 *
 * Run it by hand with `npm run data`, not from `prebuild` — the app must never
 * depend on a third-party site being reachable at deploy time, and a silent
 * roster change between two builds is exactly the kind of thing that would
 * make a draft wrong without anyone noticing. Review the diff before
 * committing; the notes in docs/PLAN.md §10 list the known data quirks.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RAW = "https://raw.githubusercontent.com/Mirzipan/Homm3_BG_Database/main/docs";
const WIKI = "https://en.homm3bg.wiki";

/**
 * Fan-made expansions, which by definition are not in the community database
 * and so are kept here by hand, read off the cards in their own repositories.
 *
 * They are part of the catalogue like any other box, which means they arrive
 * switched on and a table that does not own them turns them off in the lobby —
 * the same as every official expansion.
 */
const FAN_EXPANSIONS = [
  {
    faction: {
      id: "factory",
      name: "Factory",
      set: "unofficial-factory",
      color: "#e0954f",
      wiki: "https://github.com/piotrbruzda/Homm3BG-Factory",
    },
    // Stats are uniform per class, exactly as in the official game: the
    // Artificers are 0/1/2/2 and the Mercenaries 3/1/1/1.
    heroesBoards: "https://github.com/piotrbruzda/Homm3BG-Factory/blob/main/heroes%20boards",
    heroes: [
      ["agar", "Agar", "magic", "Artificer", "Wisdom", "Sandworms"],
      ["celestine", "Celestine", "magic", "Artificer", "Pathfinding", "Armadillos"],
      ["frederick", "Frederick", "magic", "Artificer", "Intelligence", "Automatons"],
      ["henrietta", "Henrietta", "might", "Mercenary", "Luck", "Halflings"],
      ["melchior", "Melchior", "might", "Mercenary", "Diplomacy", "Diplomacy"],
      ["victoria", "Victoria", "magic", "Artificer", "Learning", "Land Mine"],
      ["wynona", "Wynona", "might", "Mercenary", "Archery", "Scouting"],
    ],
  },
];
const OUT = (name) => fileURLToPath(new URL(`../src/data/${name}`, import.meta.url));

/** Banner tints for the seat strip and the faction cards. Chosen to stay
 * legible on the dark chrome and to survive the ink-saver's greyscale, since
 * they are the only thing distinguishing two factions at a glance. */
const FACTION_COLORS = {
  castle: "#d8c27a",
  necropolis: "#8e8f96",
  dungeon: "#9a6fbf",
  tower: "#7fb6d6",
  rampart: "#6ea55f",
  fortress: "#7d8a4e",
  inferno: "#c25a3a",
  stronghold: "#c0703a",
  conflux: "#67c2b4",
  cove: "#4d7fae",
  factory: "#e0954f",
};

/**
 * Which heroes are printed on the two sides of one physical card.
 *
 * Not in the community database — it has to be read off the cards themselves —
 * so this is empty until somebody does that. Write each pair once, by hero id
 * (the wiki page name with dashes, e.g. "lord_haart_castle" -> "lord-haart-castle");
 * the reverse direction is filled in automatically, and an id that does not
 * exist stops the build rather than silently doing nothing.
 *
 * Until it is populated the "one card, two heroes" setting has nothing to act
 * on, which is exactly what the lobby says about it.
 */
const CARD_PAIRS = {
  // "valeska": "adelaide",
};

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "[Castle](castle.md)" -> "Castle". Link targets are not trustworthy here:
 * several Rampart heroes link to towns/tower.md upstream, so only the label
 * is read. */
const label = (cell) => cell.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();

/** Splits a markdown table row into its cells, dropping the empty strings the
 * leading and trailing pipes produce. */
function cells(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());
}

function tableRows(markdown, heading) {
  const from = heading ? markdown.indexOf(heading) : 0;
  if (from < 0) throw new Error(`heading not found: ${heading}`);
  return markdown
    .slice(from)
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map(cells)
    .filter((row) => !row[0].startsWith(":") && !/^-+$/.test(row[0]) && row[0] !== "Name");
}

async function fetchMarkdown(path) {
  const res = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

const townsMd = await fetchMarkdown("towns/index.md");
const heroesMd = await fetchMarkdown("heroes/index.md");

// ------------------------------------------------------------------ factions

const factions = tableRows(townsMd, "## List of Towns").map(([name, content]) => {
  const id = slug(label(name));
  const color = FACTION_COLORS[id];
  if (!color) throw new Error(`no colour for faction "${id}" — add one to FACTION_COLORS`);
  // The whole link, not a page name: fan expansions live in their own
  // repositories rather than on the wiki, and one field that always holds a
  // URL is simpler than a field plus a rule for what to wrap round it.
  const page = /\(([^)]+)\.md\)/.exec(name)?.[1] ?? id;
  const wiki = `${WIKI}/towns/${page}/`;
  return {
    id,
    name: label(name),
    set: slug(label(content)),
    color,
    crest: `/factions/${id}.webp`,
    wiki,
  };
});

const factionIds = new Set(factions.map((f) => f.id));

// --------------------------------------------------------------------- heroes

const heroes = tableRows(heroesMd, "# List of Heroes").map((row) => {
  const [nameCell, townCell, klassCell, abilityCell, specialtyCell, contentCell] = row;

  // The page filename already disambiguates the heroes who exist in more than
  // one faction (tarnum_castle.md, lord_haart_necropolis.md), so it makes a
  // better id than the name does.
  const page = /\(([^)]+)\.md\)/.exec(nameCell)?.[1];
  const name = label(nameCell);
  const factionId = slug(label(townCell));
  if (!factionIds.has(factionId)) throw new Error(`hero "${name}" has unknown town "${factionId}"`);

  // ":might: Knight" — the icon is the authority on might vs magic, and it
  // does not always agree with the class name (Torosar is a might Wizard).
  const klass = klassCell.startsWith(":might:") ? "might" : "magic";

  return {
    id: slug(page ?? `${name}-${factionId}`),
    wiki: `${WIKI}/heroes/${page ?? slug(`${name}-${factionId}`)}/`,
    name,
    factionId,
    klass,
    className: klassCell.replace(/^:\w+:/, "").trim(),
    // Shared by the same person's cards across factions, so uniqueHeroIdentity
    // can stop two players both drafting Tarnum.
    identity: slug(name),
    ability: label(abilityCell),
    specialty: label(specialtyCell),
    set: slug(label(contentCell)),
  };
});

// --------------------------------------------------------- fan expansions

for (const expansion of FAN_EXPANSIONS) {
  const color = FACTION_COLORS[expansion.faction.id];
  if (!color) throw new Error(`no colour for faction "${expansion.faction.id}"`);
  factions.push({ ...expansion.faction, color, crest: `/factions/${expansion.faction.id}.webp` });
  factionIds.add(expansion.faction.id);

  for (const [page, name, klass, className, ability, specialty] of expansion.heroes) {
    heroes.push({
      id: slug(`${name}-${expansion.faction.id}`),
      wiki: `${expansion.heroesBoards}/hero_${page}_sm.png`,
      name,
      factionId: expansion.faction.id,
      klass,
      className,
      identity: slug(name),
      ability,
      specialty,
      set: expansion.faction.set,
    });
  }
}

// ------------------------------------------------------------- card pairings

const heroById = new Map(heroes.map((h) => [h.id, h]));
for (const [front, back] of Object.entries(CARD_PAIRS)) {
  const a = heroById.get(front);
  const b = heroById.get(back);
  if (!a) throw new Error(`CARD_PAIRS names a hero that does not exist: ${front}`);
  if (!b) throw new Error(`CARD_PAIRS names a hero that does not exist: ${back}`);
  if (a.pairedWith || b.pairedWith) throw new Error(`${front}/${back}: a card has only two sides`);
  a.pairedWith = back;
  b.pairedWith = front;
}

const duplicates = heroes.map((h) => h.id).filter((id, i, all) => all.indexOf(id) !== i);
if (duplicates.length) throw new Error(`duplicate hero ids: ${duplicates.join(", ")}`);

for (const faction of factions) {
  if (!heroes.some((h) => h.factionId === faction.id)) {
    throw new Error(`faction "${faction.id}" has no heroes — the draft would deadlock on it`);
  }
}

const missingWiki = [...factions, ...heroes].filter((entry) => !entry.wiki);
if (missingWiki.length) throw new Error(`no wiki page for: ${missingWiki.map((e) => e.id).join(", ")}`);

// ----------------------------------------------------------------------- write

const stamp = { source: "https://github.com/Mirzipan/Homm3_BG_Database", fetched: new Date().toISOString().slice(0, 10) };

writeFileSync(OUT("factions.json"), JSON.stringify({ ...stamp, factions }, null, 2) + "\n");
writeFileSync(OUT("heroes.json"), JSON.stringify({ ...stamp, heroes }, null, 2) + "\n");

const bySet = [...new Set(heroes.map((h) => h.set))].sort();
const paired = heroes.filter((h) => h.pairedWith).length;
console.log(`${factions.length} factions, ${heroes.length} heroes, ${paired / 2} card pairings`);
console.log(`sets: ${bySet.join(", ")}`);
for (const faction of factions) {
  const own = heroes.filter((h) => h.factionId === faction.id);
  const might = own.filter((h) => h.klass === "might").length;
  console.log(`  ${faction.id.padEnd(12)} ${String(own.length).padStart(2)} heroes  (${might} might / ${own.length - might} magic)`);
}
