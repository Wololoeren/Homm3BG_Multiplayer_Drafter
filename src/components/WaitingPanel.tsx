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
  handover = null,
}: {
  state: DraftState;
  mySeat: number;
  waitingOn: number | null;
  /** Link mode: the hand-off link is already on the clipboard, or the browser
   * would not let us put it there. Either way the player should be told,
   * because the difference decides whether they need to press Copy. */
  handover?: { seat: number; copied: boolean } | null;
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
      {handover && waitingOn !== null && (
        <p className={handover.copied ? "note good" : "note"}>
          {t(handover.copied ? "draft.handover.copied" : "draft.handover.manual", {
            name: state.seats[waitingOn].name || t("draft.seat", { n: waitingOn + 1 }),
          })}
        </p>
      )}
      {(seat.factionId || card) && (
        <p className="label">
          {seat.factionId ? factionName(seat.factionId) : ""}
          {card ? ` · ${card.name}` : ""}
        </p>
      )}
    </div>
  );
}
