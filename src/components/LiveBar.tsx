"use client";

import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import type { ConnectionStatus, Divergence } from "@/lib/transport";
import type { MessageKey } from "@/lib/i18n/messages/en";

/**
 * Whether the wire is up, and who is on the other end of it.
 *
 * "failed" is reported plainly rather than retried behind a spinner: a network
 * that blocks peer-to-peer traffic will not start allowing it, and the useful
 * response is to fall back to passing the link — which is right there.
 */
export default function LiveBar({
  state,
  status,
  peerSeats,
  divergence,
  onDismiss,
}: {
  state: DraftState;
  status: ConnectionStatus;
  peerSeats: (number | null)[];
  divergence: Divergence | null;
  onDismiss: () => void;
}) {
  const t = useT();
  const here = peerSeats.filter((seat): seat is number => seat !== null);
  const names = here.map(
    (seat) => state.seats[seat].name || t("draft.seat", { n: seat + 1 }),
  );

  return (
    <>
      <div className="liveBar">
        <span className={`dot ${status}`} aria-hidden="true" />
        <span className="label">{t(`live.${status}` as MessageKey)}</span>
        {status === "online" && (
          <span className="hint">
            {names.length
              ? t("live.with", { names: names.join(", ") })
              : t("live.alone")}
          </span>
        )}
      </div>
      {divergence && (
        <p className="note bad">
          {t(`live.divergence.${divergence}` as MessageKey)}{" "}
          <button type="button" className="linkish" onClick={onDismiss}>
            {t("live.dismiss")}
          </button>
        </p>
      )}
    </>
  );
}
