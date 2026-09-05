"use client";

import { factionName, hero } from "@/lib/catalogue";
import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n/messages/en";

/** What your own seat sees while somebody else is deciding. It shows what you
 * already have rather than an empty box, because "what did I draft again?" is
 * the question people actually have while they wait. */
export default function WaitingPanel({
  state,
  mySeat,
  waitingOn,
}: {
  state: DraftState;
  mySeat: number;
  waitingOn: number | null;
}) {
  const t = useT();
  const seat = state.seats[mySeat];
  const card = seat.heroId ? hero(seat.heroId) : null;

  return (
    <div className="hotseat">
      <h2>
        {waitingOn === null
          ? t("draft.waiting")
          : t("draft.turn", {
              name: state.seats[waitingOn].name || t("draft.seat", { n: waitingOn + 1 }),
            })}
      </h2>
      <p className="hint">{t(`phase.${state.phase}` as MessageKey)}</p>
      {(seat.factionId || card) && (
        <p className="label">
          {seat.factionId ? factionName(seat.factionId) : ""}
          {card ? ` · ${card.name}` : ""}
        </p>
      )}
    </div>
  );
}
