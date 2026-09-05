"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createLiveTransport,
  type ConnectionStatus,
  type Dispatch,
  type Divergence,
  type Transport,
} from "./transport";

/**
 * Holds a live transport open for as long as the app wants one, and keeps the
 * peers told where this client has got to.
 *
 * The connection is made once per room, not once per move: publishing is a
 * separate effect that fires on the draft's own hash, so a re-render costs
 * nothing and a new move costs one message.
 */
export interface LiveDraft {
  status: ConnectionStatus;
  /** Seats other people are sitting in right now; null for someone who has
   * arrived but not yet claimed one. */
  peerSeats: (number | null)[];
  divergence: Divergence | null;
  dismiss: () => void;
}

export function useLiveDraft({
  live,
  room,
  payload,
  onDispatch,
}: {
  live: boolean;
  room: string;
  payload: Dispatch;
  onDispatch: (dispatch: Dispatch) => void;
}): LiveDraft {
  const [status, setStatus] = useState<ConnectionStatus>("off");
  const [peerSeats, setPeerSeats] = useState<(number | null)[]>([]);
  const [divergence, setDivergence] = useState<Divergence | null>(null);

  // Read through refs so that connecting does not depend on anything that
  // changes every render — a transport that tore itself down on each move
  // would never finish connecting.
  const payloadRef = useRef(payload);
  const onDispatchRef = useRef(onDispatch);
  payloadRef.current = payload;
  onDispatchRef.current = onDispatch;

  const transportRef = useRef<Transport | null>(null);

  useEffect(() => {
    if (!live || !room) {
      setStatus("off");
      setPeerSeats([]);
      return;
    }

    let cancelled = false;
    setDivergence(null);
    setStatus("connecting");

    // Joining is deferred by a tick so that React's development double-mount —
    // effect, cleanup, effect — collapses into a single join. Two joins of one
    // room from one page get one of them torn down again immediately, and the
    // relay sees a subscription opened and closed rather than a player
    // arriving. The delay is imperceptible next to finding a relay at all.
    const timer = setTimeout(() => {
      createLiveTransport(room, {
        onDispatch: (dispatch) => onDispatchRef.current(dispatch),
        onPeers: setPeerSeats,
        onStatus: setStatus,
        onDivergence: setDivergence,
      }).then(
        (transport) => {
          // The room may have been left again while the module was loading.
          if (cancelled) {
            transport.leave();
            return;
          }
          transportRef.current = transport;
          transport.publish(payloadRef.current);
        },
        () => {
          if (!cancelled) setStatus("failed");
        },
      );
    }, 60);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      transportRef.current?.leave();
      transportRef.current = null;
    };
  }, [live, room]);

  // One message per actual change of state. The hash covers every move and
  // the seat covers who is sitting where, which between them is everything a
  // peer needs to hear about.
  useEffect(() => {
    transportRef.current?.publish(payloadRef.current);
  }, [payload.hash, payload.seat, payload.count]);

  const dismiss = useCallback(() => setDivergence(null), []);

  return { status, peerSeats, divergence, dismiss };
}
