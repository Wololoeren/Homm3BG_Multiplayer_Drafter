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
  // The wiki's own page name, kept rather than derived: reconstructing it from
  // an id would quietly break every link the day the id scheme changes, and a
  // dead link is the kind of thing nobody notices for months.
  const wiki = /\(([^)]+)\.md\)/.exec(name)?.[1] ?? id;
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
    wiki: page ?? slug(`${name}-${factionId}`),
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
console.log(`${factions.length} factions, ${heroes.length} heroes`);
console.log(`sets: ${bySet.join(", ")}`);
for (const faction of factions) {
  const own = heroes.filter((h) => h.factionId === faction.id);
  const might = own.filter((h) => h.klass === "might").length;
  console.log(`  ${faction.id.padEnd(12)} ${String(own.length).padStart(2)} heroes  (${might} might / ${own.length - might} magic)`);
}
