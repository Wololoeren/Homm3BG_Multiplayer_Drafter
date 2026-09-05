import { HEROES, hero as heroById } from "./catalogue";
import { dealCeiling, dealDisjoint, hash32, rngFor, sample, shuffle } from "./rng";
import type {
  DraftConfig,
  DraftEvent,
  DraftState,
  Hero,
  Phase,
  Rejection,
  Seat,
} from "./draftTypes";

/**
 * The whole draft, as a pure function.
 *
 *   state = reduce(config, seed, events)
 *
 * Nothing in here touches the network, the clock or the DOM. Two clients
 * holding the same three inputs compute the same state down to the dealt
 * pools, which is what makes the multiplayer story work without a server —
 * see docs/PLAN.md §3.1. Anything that would break that (Date.now(),
 * Math.random(), iterating an unordered Set) is a bug, not a shortcut.
 */

export class DraftReplayError extends Error {
  constructor(
    readonly rejection: Rejection,
    readonly index: number,
  ) {
    super(`event ${index} rejected: ${rejection}`);
  }
}

function emptySeat(index: number): Seat {
  return { index, name: "", joined: false, factionId: null, heroId: null, bans: [] };
}

export function initialState(config: DraftConfig, seed: string): DraftState {
  // The seating order is rolled from the seed, not taken from whoever opened
  // the link first, so who picks first is never an argument.
  const order = shuffle(
    rngFor(seed, "order"),
    Array.from({ length: config.players }, (_, i) => i),
  );
  return withDerived({
    config,
    seed,
    phase: "lobby",
    seats: Array.from({ length: config.players }, (_, i) => emptySeat(i)),
    order,
    turn: null,
    bannedFactions: [],
    pools: {},
    hash: "",
  });
}

// --------------------------------------------------------------- legal moves

/** Factions nobody has banned or drafted. */
export function availableFactions(state: DraftState): string[] {
  const taken = new Set(state.seats.map((s) => s.factionId).filter(Boolean) as string[]);
  const banned = new Set(state.bannedFactions);
  return state.config.factionIds.filter((id) => !taken.has(id) && !banned.has(id));
}

/**
 * What a seat could legally end up with, before the deal narrows it to a pool.
 *
 * In blind bans every faction stays on the table even if someone has already
 * banned it: rejecting a duplicate would tell the banner what someone else
 * did, which is the one thing a blind ban is for. Duplicates simply collapse.
 */
export function legalBans(state: DraftState): string[] {
  return state.config.banVisibility === "blind"
    ? [...state.config.factionIds]
    : availableFactions(state);
}

export function legalHeroes(
  state: DraftState,
  seatIndex: number,
  { ignoreTaken = false } = {},
): Hero[] {
  const { config } = state;
  const seat = state.seats[seatIndex];
  const enabled = new Set(config.heroIds);

  // The dealt format asks what a seat *could* have been offered before anyone
  // moved, because a pool that reshuffles every time a neighbour picks is a
  // pool nobody can think about. The deal is disjoint on exactly these keys,
  // so ignoring what has been taken cannot produce an illegal offer.
  const others = ignoreTaken ? [] : state.seats;
  const takenIds = new Set(others.map((s) => s.heroId).filter(Boolean) as string[]);
  const takenIdentities = new Set(
    others.map((s) => (s.heroId ? heroById(s.heroId)?.identity : null)).filter(Boolean) as string[],
  );
  const takenHeroFactions = new Set(
    others.map((s) => (s.heroId ? heroById(s.heroId)?.factionId : null)).filter(Boolean) as string[],
  );
  const otherTowns = new Set(
    state.seats.filter((s) => s.index !== seatIndex).map((s) => s.factionId).filter(Boolean) as string[],
  );

  return HEROES.filter((h) => {
    if (!enabled.has(h.id)) return false;
    if (takenIds.has(h.id)) return false;
    if (config.uniqueHeroIdentity && takenIdentities.has(h.identity)) return false;

    switch (config.heroFactionPolicy) {
      case "own":
        return h.factionId === seat.factionId;
      case "unique-faction":
        if (takenHeroFactions.has(h.factionId)) return false;
        if (!config.heroMayComeFromAnotherPlayersTown && otherTowns.has(h.factionId)) return false;
        return true;
      case "any":
        return true;
    }
  });
}

/** The keys two seats must never share, so a hero dealt to one seat can never
 * make another seat's pool illegal. */
function heroKeys(config: DraftConfig, h: Hero): string[] {
  const keys = [`id:${h.id}`];
  if (config.uniqueHeroIdentity) keys.push(`who:${h.identity}`);
  if (config.heroFactionPolicy === "unique-faction") keys.push(`from:${h.factionId}`);
  return keys;
}

// -------------------------------------------------------------------- phases

function bansDone(state: DraftState): number {
  return state.seats.reduce((n, seat) => n + seat.bans.length, 0);
}

function factionsPicked(state: DraftState): number {
  return state.seats.filter((s) => s.factionId).length;
}

function heroesPicked(state: DraftState): number {
  return state.seats.filter((s) => s.heroId).length;
}

/** Snake: whoever drafted their faction last gets first pick of a hero. In the
 * dealt format nobody is waiting on anybody, so the order is only cosmetic. */
function heroOrder(state: DraftState): number[] {
  return state.config.format === "snake" ? [...state.order].reverse() : state.order;
}

/**
 * Whose move it is, or null when the phase is simultaneous.
 *
 * Open bans are sequential because everyone can see them land. Blind bans,
 * and every pick in the dealt format, are simultaneous — that is the whole
 * point of dealing disjoint pools.
 */
function turnFor(state: DraftState): number | null {
  switch (state.phase) {
    case "ban":
      if (state.config.banVisibility === "blind") return null;
      return state.order[bansDone(state) % state.config.players];
    case "faction":
      if (state.config.format === "dealt") return null;
      return state.order[factionsPicked(state)] ?? null;
    case "hero":
      if (state.config.format === "dealt") return null;
      return heroOrder(state)[heroesPicked(state)] ?? null;
    default:
      return null;
  }
}

function phaseAfter(state: DraftState): Phase {
  const { config } = state;
  if (state.phase === "ban" && bansDone(state) >= config.players * config.bansPerPlayer) {
    return "faction";
  }
  if (state.phase === "faction" && factionsPicked(state) === config.players) return "hero";
  if (state.phase === "hero" && heroesPicked(state) === config.players) return "done";
  return state.phase;
}

// --------------------------------------------------------------------- pools

/**
 * Deals disjoint pools, giving ground on pool size rather than on
 * disjointness. A seat offered one option it can definitely take is a worse
 * draft than one offered three; a seat offered three that somebody else can
 * also take is a *broken* draft, because simultaneous picking would then let
 * two players land on the same faction.
 *
 * feasibility() is meant to stop this ever having to shrink, but a config can
 * reach here from a pasted code that was never checked.
 */
function dealShrinking<T>(
  makeRng: () => ReturnType<typeof rngFor>,
  seats: readonly number[],
  candidatesFor: (seat: number) => readonly T[],
  size: number,
  keysOf: (item: T) => string[],
): Map<number, T[]> | null {
  // Start from what the counting argument allows rather than from what was
  // asked for: searching for a deal that cannot exist is the one case that is
  // slow, so it is the case worth never entering.
  const start = Math.min(Math.max(1, size), dealCeiling(seats, candidatesFor, keysOf));
  for (let k = start; k >= 1; k--) {
    const deal = dealDisjoint(makeRng(), seats, candidatesFor, k, keysOf);
    if (deal) return deal;
  }
  return null;
}

/**
 * The options in front of each seat right now — derived, never stored and
 * never sent. Recomputing them from (seed, config, log) on every replay is
 * what keeps a shared draft code down to a few dozen bytes.
 */
function poolsFor(state: DraftState): Record<number, string[]> {
  const { config, seed } = state;
  const pools: Record<number, string[]> = {};

  if (state.phase === "faction") {
    if (config.format === "dealt") {
      // Dealt from the table as it stood when the bans finished, not as it
      // stands now: a pool that changed under a player every time somebody
      // else picked would be unusable, and disjointness means it never has to.
      const banned = new Set(state.bannedFactions);
      const table = config.factionIds.filter((id) => !banned.has(id));
      const deal = dealShrinking(
        () => rngFor(seed, "deal", "faction"),
        state.order,
        () => table,
        Math.min(config.factionPoolSize, Math.floor(table.length / config.players)),
        (id) => [`id:${id}`],
      );
      // Only reachable when there are fewer factions than players, which the
      // lobby refuses to start — the open table at least shows what is there.
      for (const seatIndex of state.order) pools[seatIndex] = deal?.get(seatIndex) ?? table;
    } else if (state.turn !== null) {
      pools[state.turn] = sample(
        rngFor(seed, "turn", "faction", factionsPicked(state)),
        availableFactions(state),
        config.factionPoolSize,
      );
    }
    return pools;
  }

  if (state.phase === "hero") {
    if (config.format === "dealt") {
      const seats = heroOrder(state);
      const deal = dealShrinking(
        () => rngFor(seed, "deal", "hero"),
        seats,
        (seatIndex) => legalHeroes(state, seatIndex, { ignoreTaken: true }),
        config.heroPoolSize,
        (h) => heroKeys(config, h),
      );
      for (const seatIndex of seats) {
        pools[seatIndex] =
          deal?.get(seatIndex)?.map((h) => h.id) ?? legalHeroes(state, seatIndex).map((h) => h.id);
      }
    } else if (state.turn !== null) {
      pools[state.turn] = sample(
        rngFor(seed, "turn", "hero", heroesPicked(state)),
        legalHeroes(state, state.turn),
        config.heroPoolSize,
      ).map((h) => h.id);
    }
  }

  return pools;
}

/** Everything a peer would have to agree with us about, folded to 8 hex
 * digits. Exchanged with each event so a client that has drifted says so
 * instead of quietly drafting a different game. */
function fingerprint(state: Omit<DraftState, "hash" | "pools">): string {
  const parts = [
    state.config.version,
    state.seed,
    state.phase,
    state.order.join(""),
    state.bannedFactions.join(","),
    state.seats.map((s) => `${s.index}:${s.factionId ?? ""}:${s.heroId ?? ""}:${s.bans.join("+")}`).join("|"),
  ];
  return hash32(parts.join("/")).toString(16).padStart(8, "0");
}

function withDerived(state: DraftState): DraftState {
  const phase = phaseAfter(state);
  const advanced = phase === state.phase ? state : { ...state, phase };
  const turn = turnFor(advanced);
  const settled = { ...advanced, turn };
  return { ...settled, pools: poolsFor(settled), hash: fingerprint(settled) };
}

// -------------------------------------------------------------------- events

export type ApplyResult = { ok: true; state: DraftState } | { ok: false; rejection: Rejection };

const reject = (rejection: Rejection): ApplyResult => ({ ok: false, rejection });

/** Applies one event, or explains why it cannot be applied. Every client runs
 * this over every event, so an illegal move from a peer is refused everywhere
 * rather than trusted because of who sent it. */
export function apply(state: DraftState, event: DraftEvent): ApplyResult {
  const seatIndex = "seat" in event ? event.seat : -1;
  if (seatIndex >= 0 && !state.seats[seatIndex]) return reject("unknown-seat");

  switch (event.t) {
    case "join": {
      if (state.phase !== "lobby") return reject("wrong-phase");
      const seats = state.seats.map((seat) =>
        seat.index === seatIndex ? { ...seat, name: event.name.slice(0, 24), joined: true } : seat,
      );
      return { ok: true, state: withDerived({ ...state, seats }) };
    }

    case "start": {
      if (state.phase !== "lobby") return reject("wrong-phase");
      const phase: Phase = state.config.bansPerPlayer > 0 ? "ban" : "faction";
      return { ok: true, state: withDerived({ ...state, phase }) };
    }

    case "ban": {
      if (state.phase !== "ban") return reject("wrong-phase");
      const seat = state.seats[seatIndex];
      if (seat.bans.length >= state.config.bansPerPlayer) return reject("out-of-bans");
      if (state.turn !== null && state.turn !== seatIndex) return reject("not-your-turn");
      // Spending both your bans on one faction is always a mistake, and in a
      // blind ban nobody could tell you. It is also what makes every event in
      // a log distinguishable, which the merge in draftLog relies on.
      if (seat.bans.includes(event.factionId)) return reject("already-banned");
      if (!legalBans(state).includes(event.factionId)) return reject("already-banned");

      const seats = state.seats.map((s) =>
        s.index === seatIndex ? { ...s, bans: [...s.bans, event.factionId] } : s,
      );
      // A blind duplicate collapses: two seats can spend a ban on the same
      // faction, and it is removed once. The list is kept in catalogue order
      // rather than arrival order, so two clients that received the same blind
      // bans in different orders still agree — including on their state hash.
      const banned = new Set([...state.bannedFactions, event.factionId]);
      const bannedFactions = state.config.factionIds.filter((id) => banned.has(id));
      return { ok: true, state: withDerived({ ...state, seats, bannedFactions }) };
    }

    case "pickF": {
      if (state.phase !== "faction") return reject("wrong-phase");
      if (state.seats[seatIndex].factionId) return reject("already-picked");
      if (state.turn !== null && state.turn !== seatIndex) return reject("not-your-turn");
      if (!(state.pools[seatIndex] ?? []).includes(event.factionId)) return reject("not-in-pool");

      const seats = state.seats.map((s) =>
        s.index === seatIndex ? { ...s, factionId: event.factionId } : s,
      );
      return { ok: true, state: withDerived({ ...state, seats }) };
    }

    case "pickH": {
      if (state.phase !== "hero") return reject("wrong-phase");
      if (state.seats[seatIndex].heroId) return reject("already-picked");
      if (state.turn !== null && state.turn !== seatIndex) return reject("not-your-turn");
      if (!(state.pools[seatIndex] ?? []).includes(event.heroId)) return reject("not-in-pool");
      if (!heroById(event.heroId)) return reject("unknown-id");

      const seats = state.seats.map((s) => (s.index === seatIndex ? { ...s, heroId: event.heroId } : s));
      return { ok: true, state: withDerived({ ...state, seats }) };
    }

    case "undo":
      // Handled by normalise() before replay — an undo never reaches here.
      return reject("not-legal");
  }
}

/**
 * Resolves undo events away. An undo cancels the last move somebody made, not
 * the last thing that happened, so joining or starting is never rewound by
 * one — those are not moves.
 */
function normalise(events: readonly DraftEvent[]): DraftEvent[] {
  const out: DraftEvent[] = [];
  for (const event of events) {
    if (event.t !== "undo") {
      out.push(event);
      continue;
    }
    for (let i = out.length - 1; i >= 0; i--) {
      if (out[i].t === "ban" || out[i].t === "pickF" || out[i].t === "pickH") {
        out.splice(i, 1);
        break;
      }
    }
  }
  return out;
}

/**
 * Replays a log from scratch. Always a full replay — the logs are at most a
 * few dozen events, and rebuilding is the cheapest way to be certain that a
 * client which joined late holds exactly what a client that was there from the
 * start holds.
 *
 * Throws on the first illegal event rather than skipping it: a log that does
 * not replay is a log that should not be trusted, whether it arrived from a
 * pasted code or a peer.
 */
export function reduce(
  config: DraftConfig,
  seed: string,
  events: readonly DraftEvent[],
): DraftState {
  let state = initialState(config, seed);
  const log = normalise(events);
  for (let i = 0; i < log.length; i++) {
    const result = apply(state, log[i]);
    if (!result.ok) throw new DraftReplayError(result.rejection, i);
    state = result.state;
  }
  return state;
}

/** True when this seat is waiting on somebody else rather than on itself. */
export function isSeatWaiting(state: DraftState, seatIndex: number): boolean {
  if (state.phase === "ban") {
    return state.seats[seatIndex].bans.length >= state.config.bansPerPlayer;
  }
  if (state.phase === "faction") return state.seats[seatIndex].factionId !== null;
  if (state.phase === "hero") return state.seats[seatIndex].heroId !== null;
  return true;
}

/** Whether this seat may move right now — the check the UI uses to enable a
 * card, and the same one `apply` enforces. */
export function canMove(state: DraftState, seatIndex: number): boolean {
  if (state.phase === "lobby" || state.phase === "done") return false;
  if (state.turn !== null && state.turn !== seatIndex) return false;
  return !isSeatWaiting(state, seatIndex);
}
