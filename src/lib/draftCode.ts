import { CATALOGUE_FINGERPRINT, FACTION_INDEX, HERO_INDEX } from "./catalogue";
import { sanitizeConfig } from "./draftConfig";
import { DRAFT_VERSION, type DraftConfig, type DraftEvent, type HeroFactionPolicy } from "./draftTypes";

/**
 * A whole draft, packed small enough to live in a URL or be read out over
 * voice chat.
 *
 * The setup on its own — config plus seed, no moves yet — comes to 23 bytes,
 * or 37 characters. That is the code a host reads to the table. Appending the
 * move log costs about two bytes a move, so even a finished six-player draft
 * with bans stays inside a link.
 *
 * Crockford's base32 alphabet because this gets spoken aloud: it has no I, L,
 * O or U, so there is nothing to confuse with 1, 0 or each other, and `parse`
 * folds the look-alikes back anyway.
 *
 * Factions and heroes travel as indices into the sorted catalogue, which is
 * what keeps it this small — and why every code carries the catalogue's
 * fingerprint. A code minted against a different roster is refused rather than
 * quietly decoded into the wrong factions.
 */

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const EVENT_JOIN = 0;
const EVENT_START = 1;
const EVENT_BAN = 2;
const EVENT_PICK_FACTION = 3;
const EVENT_PICK_HERO = 4;
const EVENT_UNDO = 5;

const POLICIES: HeroFactionPolicy[] = ["own", "unique-faction", "any"];

export interface Draft {
  config: DraftConfig;
  seed: string;
  events: DraftEvent[];
}

// --------------------------------------------------------------- base32

function toBase32(bytes: Uint8Array): string {
  let out = "";
  let bits = 0;
  let value = 0;
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function fromBase32(text: string): Uint8Array {
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of text) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error(`bad character in draft code: ${char}`);
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Uint8Array.from(bytes);
}

/** Strips the grouping dashes and forgives the characters people reliably
 * mishear or mistype when a code is read out loud. */
export function parse(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0")
    .replace(/U/g, "V");
}

/** Groups a code into fours so it can be read aloud without losing your place. */
export function formatCode(code: string): string {
  return (code.match(/.{1,4}/g) ?? []).join("-");
}

// --------------------------------------------------------------- bitmaps

function packBitmap(ids: readonly string[], index: readonly string[]): number[] {
  const on = new Set(ids);
  const bytes = new Array(Math.ceil(index.length / 8)).fill(0);
  index.forEach((id, i) => {
    if (on.has(id)) bytes[i >> 3] |= 1 << (i & 7);
  });
  return bytes;
}

function unpackBitmap(bytes: Uint8Array, at: number, index: readonly string[]): string[] {
  const ids: string[] = [];
  index.forEach((id, i) => {
    if (bytes[at + (i >> 3)] & (1 << (i & 7))) ids.push(id);
  });
  return ids;
}

// ---------------------------------------------------------------- encode

export function encodeDraft(config: DraftConfig, seed: string, events: readonly DraftEvent[] = []): string {
  const out: number[] = [];
  const factionAt = new Map(FACTION_INDEX.map((id, i) => [id, i]));
  const heroAt = new Map(HERO_INDEX.map((id, i) => [id, i]));

  out.push(DRAFT_VERSION);
  out.push((CATALOGUE_FINGERPRINT >> 8) & 0xff, CATALOGUE_FINGERPRINT & 0xff);
  out.push(config.players);
  out.push(
    (config.format === "snake" ? 1 : 0) |
      (config.banVisibility === "blind" ? 2 : 0) |
      (config.uniqueHeroIdentity ? 4 : 0) |
      (config.heroMayComeFromAnotherPlayersTown ? 8 : 0),
  );
  out.push((config.factionPoolSize & 0x0f) | ((config.heroPoolSize & 0x0f) << 4));
  out.push((config.bansPerPlayer & 0x0f) | (POLICIES.indexOf(config.heroFactionPolicy) << 4));
  out.push(...packBitmap(config.factionIds, FACTION_INDEX));
  out.push(...packBitmap(config.heroIds, HERO_INDEX));

  const seedBytes = new TextEncoder().encode(seed);
  out.push(seedBytes.length, ...seedBytes);

  for (const event of events) {
    switch (event.t) {
      case "join": {
        const name = new TextEncoder().encode(event.name.slice(0, 24));
        out.push((EVENT_JOIN << 5) | event.seat, name.length, ...name);
        break;
      }
      case "start":
        out.push(EVENT_START << 5);
        break;
      case "ban":
        out.push((EVENT_BAN << 5) | event.seat, factionAt.get(event.factionId) ?? 0xff);
        break;
      case "pickF":
        out.push((EVENT_PICK_FACTION << 5) | event.seat, factionAt.get(event.factionId) ?? 0xff);
        break;
      case "pickH":
        out.push((EVENT_PICK_HERO << 5) | event.seat, heroAt.get(event.heroId) ?? 0xff);
        break;
      case "undo":
        out.push(EVENT_UNDO << 5);
        break;
    }
  }

  return toBase32(Uint8Array.from(out));
}

// ---------------------------------------------------------------- decode

export class DraftCodeError extends Error {
  constructor(readonly reason: "malformed" | "version" | "catalogue") {
    super(`draft code rejected: ${reason}`);
  }
}

export function decodeDraft(input: string): Draft {
  let bytes: Uint8Array;
  try {
    bytes = fromBase32(parse(input));
  } catch {
    throw new DraftCodeError("malformed");
  }

  let at = 0;
  const need = (n: number) => {
    if (at + n > bytes.length) throw new DraftCodeError("malformed");
  };

  need(7);
  if (bytes[at++] !== DRAFT_VERSION) throw new DraftCodeError("version");
  const fingerprint = (bytes[at] << 8) | bytes[at + 1];
  at += 2;
  // A roster change would silently turn every stored index into a different
  // faction, so a stale code has to fail loudly rather than deal a wrong game.
  if (fingerprint !== CATALOGUE_FINGERPRINT) throw new DraftCodeError("catalogue");

  const players = bytes[at++];
  const flags = bytes[at++];
  const pools = bytes[at++];
  const bansAndPolicy = bytes[at++];

  const factionBytes = Math.ceil(FACTION_INDEX.length / 8);
  const heroBytes = Math.ceil(HERO_INDEX.length / 8);
  need(factionBytes + heroBytes + 1);
  const factionIds = unpackBitmap(bytes, at, FACTION_INDEX);
  at += factionBytes;
  const heroIds = unpackBitmap(bytes, at, HERO_INDEX);
  at += heroBytes;

  const seedLength = bytes[at++];
  need(seedLength);
  const seed = new TextDecoder().decode(bytes.subarray(at, at + seedLength));
  at += seedLength;

  const config = sanitizeConfig({
    version: DRAFT_VERSION,
    players,
    format: flags & 1 ? "snake" : "dealt",
    banVisibility: flags & 2 ? "blind" : "open",
    uniqueHeroIdentity: (flags & 4) !== 0,
    heroMayComeFromAnotherPlayersTown: (flags & 8) !== 0,
    factionPoolSize: pools & 0x0f,
    heroPoolSize: (pools >> 4) & 0x0f,
    bansPerPlayer: bansAndPolicy & 0x0f,
    heroFactionPolicy: POLICIES[(bansAndPolicy >> 4) & 0x0f] ?? "own",
    factionIds,
    heroIds,
  });
  if (!config) throw new DraftCodeError("version");

  const events: DraftEvent[] = [];
  while (at < bytes.length) {
    const header = bytes[at++];
    const seat = header & 31;
    switch (header >> 5) {
      case EVENT_JOIN: {
        need(1);
        const length = bytes[at++];
        need(length);
        events.push({ t: "join", seat, name: new TextDecoder().decode(bytes.subarray(at, at + length)) });
        at += length;
        break;
      }
      case EVENT_START:
        events.push({ t: "start" });
        break;
      case EVENT_BAN:
        need(1);
        events.push({ t: "ban", seat, factionId: FACTION_INDEX[bytes[at++]] ?? "" });
        break;
      case EVENT_PICK_FACTION:
        need(1);
        events.push({ t: "pickF", seat, factionId: FACTION_INDEX[bytes[at++]] ?? "" });
        break;
      case EVENT_PICK_HERO:
        need(1);
        events.push({ t: "pickH", seat, heroId: HERO_INDEX[bytes[at++]] ?? "" });
        break;
      case EVENT_UNDO:
        events.push({ t: "undo" });
        break;
      default:
        throw new DraftCodeError("malformed");
    }
  }

  return { config, seed, events };
}
