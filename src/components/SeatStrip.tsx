"use client";

import Crest from "./Crest";
import WikiLink from "./WikiLink";
import { faction, factionName, hero } from "@/lib/catalogue";
import { factionWikiUrl, heroWikiUrl } from "@/lib/wiki";
import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";

/**
 * Who is at the table and how far each of them has got. Shown in seating
 * order, which the seed decided — not in seat-number order, so the strip
 * reads the way the draft actually runs.
 *
 * A seat that has not moved shows a dash rather than nothing, because during
 * a blind ban an empty slot and a hidden one look the same and only one of
 * them means "still thinking".
 */
export default function SeatStrip({
  state,
  activeSeat,
  mySeat = null,
  hideChoices = false,
}: {
  state: DraftState;
  activeSeat: number | null;
  /** Which of these is the person holding this browser, if any. */
  mySeat?: number | null;
  hideChoices?: boolean;
}) {
  const t = useT();

  return (
    <div className="seatStrip no-print">
      {state.order.map((index) => {
        const seat = state.seats[index];
        const town = seat.factionId ? faction(seat.factionId) : null;
        const drafted = seat.heroId ? hero(seat.heroId) : null;

        return (
          <div
            key={index}
            className={`seat${index === activeSeat ? " active" : ""}${index === mySeat ? " you" : ""}`}
            style={town ? { borderLeftColor: town.color } : undefined}
          >
            <div className="seatName">{seat.name || t("draft.seat", { n: index + 1 })}</div>
            <div className={`seatLine${town ? " filled" : ""}`} style={town ? { color: town.color } : undefined}>
              {town ? (
                <>
                  <Crest factionId={town.id} />
                  {factionName(town.id)}
                  <WikiLink href={factionWikiUrl(town)} label={t("wiki.faction", { name: town.name })} />
                </>
              ) : (
                "—"
              )}
            </div>
            <div className={`seatLine${drafted ? " filled" : ""}`}>
              {drafted ? (
                <>
                  {drafted.name}
                  <WikiLink href={heroWikiUrl(drafted)} label={t("wiki.hero", { name: drafted.name })} />
                </>
              ) : (
                "—"
              )}
            </div>
            {state.config.bansPerPlayer > 0 && (
              <div className="seatLine">
                {hideChoices && state.phase === "ban"
                  ? "•".repeat(seat.bans.length) || "—"
                  : seat.bans.map((id) => factionName(id)).join(", ") || "—"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
