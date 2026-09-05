import { hero } from "./catalogue";
import { sanitizeConfig } from "./draftConfig";
import { DRAFT_VERSION, type DraftConfig, type DraftEvent } from "./draftTypes";

/**
 * What survives a reload: the draft in progress, and the setup the host last
 * chose. Written on every move, the same way the Scenario Editor autosaves —
 * closing the tab in the middle of a draft should cost nothing.
 *
 * Only (config, seed, log) is stored. The pools are derived, so persisting
 * them would be storing a cache that can only ever be wrong.
 */

const SESSION_KEY = "homm3bg-drafter.session";
const SETUP_KEY = "homm3bg-drafter.setup";

export interface Session {
  config: DraftConfig;
  seed: string;
  events: DraftEvent[];
  /** Which seat this browser is playing. Null while passing one screen round
   * the table, where every seat is this browser's turn in turn. */
  mySeat: number | null;
}

function isEvent(raw: unknown, players: number): raw is DraftEvent {
  if (!raw || typeof raw !== "object") return false;
  const event = raw as Partial<DraftEvent> & { seat?: unknown };
  const seatOk = typeof event.seat === "number" && event.seat >= 0 && event.seat < players;
  switch (event.t) {
    case "start":
    case "undo":
      return true;
    case "join":
      return seatOk && typeof (event as { name?: unknown }).name === "string";
    case "ban":
    case "pickF":
      return seatOk && typeof (event as { factionId?: unknown }).factionId === "string";
    case "pickH": {
      const id = (event as { heroId?: unknown }).heroId;
      return seatOk && typeof id === "string" && hero(id) !== undefined;
    }
    default:
      return false;
  }
}

/** Brings a stored session forward, or gives up on it. A log that has gone
 * stale — a hand-edited entry, a build whose roster moved — is better dropped
 * than replayed into a draft that is quietly not the one that was played. */
export function sanitizeSession(raw: unknown): Session | null {
  if (!raw || typeof raw !== "object") return null;
  const input = raw as Partial<Session> & { version?: number };
  if (input.version !== undefined && input.version !== DRAFT_VERSION) return null;

  const config = sanitizeConfig(input.config);
  if (!config) return null;
  if (typeof input.seed !== "string" || !input.seed) return null;

  const events = Array.isArray(input.events)
    ? input.events.filter((event): event is DraftEvent => isEvent(event, config.players))
    : [];
  const mySeat =
    typeof input.mySeat === "number" && input.mySeat >= 0 && input.mySeat < config.players
      ? input.mySeat
      : null;

  return { config, seed: input.seed, events, mySeat };
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? sanitizeSession(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ version: DRAFT_VERSION, ...session }),
    );
  } catch {
    // Private browsing or a full quota — the draft still plays, it just
    // forgets on reload. The draft code in the share bar is the real backup.
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to do: it was never stored in the first place.
  }
}

/** The setup screen's own memory, kept apart from the draft so "draft again"
 * comes back to the table you configured rather than to the defaults. */
export function loadSetup(): DraftConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETUP_KEY);
    return raw ? sanitizeConfig(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveSetup(config: DraftConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETUP_KEY, JSON.stringify(config));
  } catch {
    // Same as above — a lost setting is not worth interrupting anyone over.
  }
}
