import { initialState, reduce } from "./draftEngine";
import type { DraftConfig, DraftEvent } from "./draftTypes";

/**
 * Turning a bag of moves that arrived in any order into the one log everybody
 * agrees on.
 *
 * Once a draft is spread over several computers the moves stop arriving in a
 * single order. Two players picking at the same time is not a race to be
 * resolved — it is the point of the dealt format — but if one client ends up
 * holding [seat 3, seat 1] and another [seat 1, seat 3], their state hashes
 * differ, their draft codes differ, and they will each accuse the other of
 * having desynced.
 *
 * So the log is treated as a *set* of moves with a canonical order derived
 * from the draft's own rules, rather than as a stream. Merging is then a set
 * union: idempotent, commutative, and safe to redo — which means a peer can
 * simply be handed the whole log whenever it seems useful, and nothing has to
 * track what it has already seen.
 */

/**
 * What makes two moves the same move.
 *
 * Every legal move is unique in its own right: a seat drafts one faction and
 * one hero, and cannot spend two bans on the same faction. A second `join`
 * from a seat is a rename, so it replaces the first.
 */
export function eventKey(event: DraftEvent): string {
  switch (event.t) {
    case "join":
      return `join:${event.seat}`;
    case "start":
      return "start";
    case "ban":
      return `ban:${event.seat}:${event.factionId}`;
    case "banH":
      return `banH:${event.seat}:${event.heroId}`;
    case "pickF":
      return `pickF:${event.seat}`;
    case "pickH":
      return `pickH:${event.seat}`;
    case "undo":
      // Never merged or transmitted: undo is a local convenience for one
      // screen being passed round a table (see draftSession's `undoLast`),
      // and rewinding somebody else's move over a wire is a different feature.
      return "undo";
  }
}

/** Set union, last writer winning for a key that can legitimately repeat. */
export function mergeEvents(existing: readonly DraftEvent[], incoming: readonly DraftEvent[]): DraftEvent[] {
  const byKey = new Map<string, DraftEvent>();
  for (const event of [...existing, ...incoming]) {
    if (event.t === "undo") continue;
    byKey.set(eventKey(event), event);
  }
  return [...byKey.values()];
}

const PHASE_RANK: Record<DraftEvent["t"], number> = {
  join: 0,
  start: 1,
  ban: 2,
  pickF: 3,
  banH: 4,
  pickH: 5,
  undo: 6,
};

/**
 * Sorts a bag of moves into the order the draft itself implies.
 *
 * The order is worked out by counting, not by replaying — a replay would need
 * a working order to start from, which is the thing being computed. Every
 * ingredient is available without one:
 *
 *  - the seating order comes from the seed alone, before anybody joined;
 *  - a seat picks exactly one faction and one hero, so its place in those
 *    phases is just its place at the table (reversed for heroes in a snake
 *    draft, where drafting last means choosing a hero first);
 *  - the bans go round the table, so a ban's round is how many that seat had
 *    already spent. Which of a seat's own two bans counts as first is
 *    genuinely arbitrary — they are interchangeable — so it is settled by
 *    faction id, which every client agrees on.
 *
 * The result is verified against the engine before being returned: if it will
 * not replay, that is a bug in here rather than in the caller, and the caller
 * is better off with a working order than an exception mid-draft.
 */
export function canonicalise(
  config: DraftConfig,
  seed: string,
  events: readonly DraftEvent[],
): DraftEvent[] {
  const { order } = initialState(config, seed);
  const seatRankOf = (seat: number) => Math.max(order.indexOf(seat), 0);

  // Each seat's bans, in the order this function will claim they happened.
  // Faction and hero bans are separate rounds, so they are counted separately.
  const bansBySeat = new Map<string, string[]>();
  for (const event of events) {
    if (event.t !== "ban" && event.t !== "banH") continue;
    const key = `${event.t}:${event.seat}`;
    const own = bansBySeat.get(key) ?? [];
    own.push(event.t === "ban" ? event.factionId : event.heroId);
    bansBySeat.set(key, own);
  }
  for (const own of bansBySeat.values()) own.sort();

  function key(event: DraftEvent): [number, number, number] {
    const phase = PHASE_RANK[event.t];
    if (!("seat" in event)) return [phase, 0, 0];
    const rank =
      event.t === "pickH" && config.format === "snake"
        ? config.players - 1 - seatRankOf(event.seat)
        : seatRankOf(event.seat);
    const round =
      event.t === "ban"
        ? (bansBySeat.get(`ban:${event.seat}`)?.indexOf(event.factionId) ?? 0)
        : event.t === "banH"
          ? (bansBySeat.get(`banH:${event.seat}`)?.indexOf(event.heroId) ?? 0)
          : 0;
    return [phase, round, rank];
  }

  const sorted = [...events].sort((a, b) => {
    const [ap, ar, ak] = key(a);
    const [bp, br, bk] = key(b);
    return ap - bp || ar - br || ak - bk;
  });

  try {
    reduce(config, seed, sorted);
    return sorted;
  } catch {
    return [...events];
  }
}

/**
 * Folds new moves into a log, keeping only the ones that replay.
 *
 * A move can arrive before the move it depends on — the last pick of a phase
 * overtaking one of the picks that ended it, say — so anything that does not
 * apply yet is held and retried after each success rather than thrown away.
 * Whatever is still unusable at the end is genuinely not ours to apply, and
 * is reported so a caller can say so.
 */
export function acceptEvents(
  config: DraftConfig,
  seed: string,
  log: readonly DraftEvent[],
  incoming: readonly DraftEvent[],
): { log: DraftEvent[]; held: DraftEvent[] } {
  const known = new Set(log.map(eventKey));
  const pending = incoming.filter((event) => event.t !== "undo" && !known.has(eventKey(event)));
  if (!pending.length) return { log: [...log], held: [] };

  let accepted = [...log];
  let progress = true;
  while (progress && pending.length) {
    progress = false;
    for (let i = 0; i < pending.length; i++) {
      const candidate = canonicalise(config, seed, mergeEvents(accepted, [pending[i]]));
      try {
        reduce(config, seed, candidate);
      } catch {
        continue;
      }
      accepted = candidate;
      pending.splice(i, 1);
      progress = true;
      break;
    }
  }

  return { log: accepted, held: pending };
}
