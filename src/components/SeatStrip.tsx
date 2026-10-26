"use client";

import Crest from "./Crest";
import WikiLink from "./WikiLink";
import { faction, factionName, hero } from "@/lib/catalogue";
import { factionWikiUrl, heroWikiUrl } from "@/lib/wiki";
import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";

/** A line that has something on it but may not say what. A dash is "still
 * thinking", a dot is "decided, and not telling you". */
const mark = (filled: boolean) => (filled ? "•" : "—");

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
  seeing = null,
  hideChoices = false,
}: {
  state: DraftState;
  activeSeat: number | null;
  /** Which of these is the person holding this browser, if any. */
  mySeat?: number | null;
  /**
   * Whose eyes are on this screen — the one seat allowed to see its own
   * choices while `concealPicks` is on, since that player already knows them.
   * On a shared link it is the player; round one screen it is whoever has
   * just been handed the browser, and between turns it is nobody.
   */
  seeing?: number | null;
  hideChoices?: boolean;
}) {
  const t = useT();

  const concealed = (index: number) =>
    state.config.concealPicks && state.phase !== "done" && index !== seeing;

  return (
    <div className="seatStrip no-print">
      {state.order.map((index) => {
        const seat = state.seats[index];
        const hidden = concealed(index);
        // Read the cards through `hidden` rather than around it: the border
        // tint and the text colour would name the faction on their own.
        const town = !hidden && seat.factionId ? faction(seat.factionId) : null;
        const drafted = !hidden && seat.heroId ? hero(seat.heroId) : null;

        return (
          <div
            key={index}
            className={`seat${index === activeSeat ? " active" : ""}${index === mySeat ? " you" : ""}`}
            style={town ? { borderLeftColor: town.color } : undefined}
          >
            <div className="seatName">
              {state.config.draftSeats && seat.position !== null && (
                <span className="seatPos">{seat.position}</span>
              )}
              {seat.name || t("draft.seat", { n: index + 1 })}
            </div>
            <div className={`seatLine${town ? " filled" : ""}`} style={town ? { color: town.color } : undefined}>
              {town ? (
                <>
                  <Crest factionId={town.id} />
                  {factionName(town.id)}
                  <WikiLink href={factionWikiUrl(town)} label={t("wiki.faction", { name: town.name })} />
                </>
              ) : (
                mark(hidden && Boolean(seat.factionId))
              )}
            </div>
            <div className={`seatLine${drafted ? " filled" : ""}`}>
              {drafted ? (
                <>
                  {drafted.name}
                  <WikiLink href={heroWikiUrl(drafted)} label={t("wiki.hero", { name: drafted.name })} />
                </>
              ) : (
                mark(hidden && Boolean(seat.heroId))
              )}
            </div>
            {(state.config.bansPerPlayer > 0 || state.config.heroBansPerPlayer > 0) && (
              <div className="seatLine">
                {hidden || (hideChoices && (state.phase === "ban" || state.phase === "banHero"))
                  ? "•".repeat(seat.bans.length + seat.heroBans.length) || "—"
                  : [
                      ...seat.bans.map((id) => factionName(id)),
                      ...seat.heroBans.map((id) => hero(id)?.name ?? id),
                    ].join(", ") || "—"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
