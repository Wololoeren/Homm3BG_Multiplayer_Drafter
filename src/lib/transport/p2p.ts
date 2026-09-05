import type { Dispatch, Transport, TransportHandlers } from "./index";

/**
 * Live drafting, browser to browser, with nothing of ours in between.
 *
 * Trystero matches peers up over public Nostr relays and then talks WebRTC
 * directly, so a draft needs no server, no account and no cost — which is the
 * only way this works from GitHub Pages at all (docs/PLAN.md §3.3).
 *
 * The protocol is deliberately not a protocol. There is one message, and it
 * carries the sender's whole log: merging is idempotent and order-independent
 * (see draftLog), so a client that missed something is repaired by the next
 * message anybody sends. Nothing tracks acknowledgements, nothing retries, and
 * a peer arriving late is just another peer who gets told everything.
 *
 * The room is named after the draft's setup code, so everyone who opened the
 * same link lands in the same room and nobody else does. That is a shared
 * secret of about 40 bits of seed — plenty for a board game, and worth knowing
 * is not a password.
 */

const APP_ID = "homm3bg-drafter";

/** Long enough that a slow relay is not called a failure, short enough that a
 * network which blocks WebRTC outright stops pretending it might work. */
const CONNECT_GRACE_MS = 12000;

export async function createP2PTransport(
  room: string,
  handlers: TransportHandlers,
): Promise<Transport> {
  const { joinRoom } = await import("trystero/nostr");

  handlers.onStatus("connecting");

  const joined = joinRoom({ appId: APP_ID }, room);
  // JSON on the wire rather than the library's structured payload type: it
  // keeps Dispatch a domain type instead of one shaped by a generic, and it
  // will not need revisiting when that generic changes.
  const dispatchAction = joined.makeAction<string>("draft");

  const send = (dispatch: Dispatch, target?: string) =>
    dispatchAction.send(JSON.stringify(dispatch), target ? { target } : undefined).catch(() => {
      // Nobody to send to yet, or a peer that vanished mid-send. The next
      // message anybody publishes repairs it.
    });

  // What each peer last told us they were sitting in, so the seat strip can
  // show who is actually here.
  const seatOfPeer = new Map<string, number | null>();
  let latest: Dispatch | null = null;
  let live = false;

  function announcePeers() {
    handlers.onPeers([...seatOfPeer.values()]);
  }

  dispatchAction.onMessage = (raw, { peerId }) => {
    let incoming: Dispatch;
    try {
      incoming = JSON.parse(raw) as Dispatch;
    } catch {
      return;
    }
    if (!incoming || !Array.isArray(incoming.events)) return;

    live = true;
    handlers.onStatus("online");
    seatOfPeer.set(peerId, incoming.seat ?? null);
    announcePeers();

    // Two people who opened different links should be told so, rather than
    // spending the draft wondering why nothing lines up.
    if (latest && incoming.setup && incoming.setup !== latest.setup) {
      handlers.onDivergence("setup");
      return;
    }
    // Two people in the same seat is a mistake somebody has to fix; the app
    // cannot pick which of them should move.
    if (latest && latest.seat !== null && incoming.seat === latest.seat) {
      handlers.onDivergence("seat");
    }

    handlers.onDispatch(incoming);
  };

  joined.onPeerJoin = (peerId) => {
    live = true;
    handlers.onStatus("online");
    seatOfPeer.set(peerId, null);
    announcePeers();
    // Hand the newcomer everything immediately. They may have more than us,
    // in which case their reply repairs us in turn.
    if (latest) void send(latest, peerId);
  };

  joined.onPeerLeave = (peerId) => {
    seatOfPeer.delete(peerId);
    announcePeers();
  };

  // A relay can take a moment, and a network that blocks WebRTC never
  // resolves at all — so say so instead of spinning. "failed" is not fatal:
  // the UI keeps the link-passing fallback in front of the player, and a peer
  // arriving later still flips this back to online.
  const grace = setTimeout(() => {
    if (!live) handlers.onStatus("failed");
  }, CONNECT_GRACE_MS);

  return {
    kind: "p2p",
    publish(dispatch) {
      latest = dispatch;
      // Nothing to send to yet is not an error — onPeerJoin catches them up.
      void send(dispatch);
    },
    leave() {
      clearTimeout(grace);
      dispatchAction.onMessage = null;
      joined.onPeerJoin = null;
      joined.onPeerLeave = null;
      void joined.leave().catch(() => {});
      handlers.onStatus("off");
    },
  };
}
