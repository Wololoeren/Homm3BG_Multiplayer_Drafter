import type { DraftEvent } from "../draftTypes";

/**
 * How moves get from one player to another.
 *
 * The draft engine never learns which of these is in use. It only ever sees
 * (config, seed, set of moves), and draftLog guarantees that a set of moves
 * means the same thing however it arrived — so a transport's whole job is to
 * deliver moves eventually, in any order, as often as it likes.
 *
 * Three of them, in order of how much they ask of the world:
 *
 *  - **local** — one screen passed round a table. No wire at all.
 *  - **manual** — the wire is a person: the address bar holds the whole draft,
 *    and you hand somebody the link. Works with no server, no accounts and no
 *    network between the players, which is why it is the fallback for every
 *    other mode.
 *  - **p2p** — WebRTC between browsers, matched up over public relays. No
 *    server of ours either, but it can be blocked by a network that refuses
 *    peer-to-peer traffic, in which case it falls back to manual.
 *
 * See docs/PLAN.md §3 for why these three and not a database.
 */

export type TransportKind = "local" | "manual" | "p2p";

export type ConnectionStatus = "off" | "connecting" | "online" | "failed";

/** What a client tells its peers, and what it hears back. The whole log
 * travels every time: it is a few hundred bytes, merging is idempotent, and a
 * peer that missed something is then repaired by the next message anybody
 * sends rather than by a retransmission protocol. */
export interface Dispatch {
  /** Which seat the sender is playing, or null if they have not claimed one. */
  seat: number | null;
  /** The sender's config-and-seed code, so two people who are not actually in
   * the same draft find out immediately rather than confusingly. */
  setup: string;
  events: DraftEvent[];
  /** The sender's state hash and move count, for spotting a real divergence. */
  hash: string;
  count: number;
}

export type Divergence = "setup" | "state" | "seat";

export interface TransportHandlers {
  onDispatch: (dispatch: Dispatch) => void;
  onPeers: (seats: (number | null)[]) => void;
  onStatus: (status: ConnectionStatus) => void;
  onDivergence: (kind: Divergence) => void;
}

export interface Transport {
  readonly kind: TransportKind;
  /** Tell everyone where things stand. Called after every local move, and
   * whenever a peer turns up. */
  publish: (dispatch: Dispatch) => void;
  leave: () => void;
}

/** local and manual have nothing to connect to, so they share this. */
export function nullTransport(kind: "local" | "manual"): Transport {
  return { kind, publish: () => {}, leave: () => {} };
}

/**
 * Trystero is loaded only when someone actually asks for a live draft: it
 * brings WebRTC and a relay client with it, and neither belongs in the bundle
 * of a page that is usually just one laptop on a kitchen table.
 */
export async function createLiveTransport(
  room: string,
  handlers: TransportHandlers,
): Promise<Transport> {
  const { createP2PTransport } = await import("./p2p");
  return createP2PTransport(room, handlers);
}
