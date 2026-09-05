"use client";

import { factionName } from "@/lib/catalogue";
import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";

/**
 * "Which one are you?" — asked when somebody opens a shared link that did not
 * name a seat.
 *
 * A seat somebody else is already sitting in is shown as taken rather than
 * hidden, because in a link draft nobody can know for sure and guessing wrong
 * would leave a player with nowhere to sit. Taking one anyway is allowed; the
 * live mode notices two people in one seat and says so.
 */
export default function SeatClaim({
  state,
  takenSeats,
  onClaim,
  onHotseat,
}: {
  state: DraftState;
  takenSeats: (number | null)[];
  onClaim: (seat: number) => void;
  onHotseat: () => void;
}) {
  const t = useT();
  const taken = new Set(takenSeats.filter((seat): seat is number => seat !== null));

  return (
    <div className="claim">
      <h2>{t("claim.heading")}</h2>
      <div className="cards">
        {state.order.map((index) => {
          const seat = state.seats[index];
          return (
            <button
              key={index}
              type="button"
              className="card"
              onClick={() => onClaim(index)}
            >
              <span className="cardName">{seat.name || t("draft.seat", { n: index + 1 })}</span>
              <span className="cardMeta">
                {seat.factionId ? factionName(seat.factionId) : t("claim.free")}
              </span>
              {taken.has(index) && <span className="cardTag">{t("claim.taken")}</span>}
            </button>
          );
        })}
      </div>
      <p className="hint">
        {t("claim.orHotseat")}{" "}
        <button type="button" className="linkish" onClick={onHotseat}>
          {t("claim.hotseat")}
        </button>
      </p>
    </div>
  );
}
