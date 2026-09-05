"use client";

import Crest from "./Crest";
import WikiLink from "./WikiLink";
import { faction, factionName, hero } from "@/lib/catalogue";
import { factionWikiUrl, heroStatsImage, heroWikiUrl } from "@/lib/wiki";
import { legalBans } from "@/lib/draftEngine";
import type { DraftEvent, DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n/messages/en";

/**
 * The one board every phase uses: a grid of cards, and a click emits the move.
 * Bans, factions and heroes differ in what a card says and which cards are
 * live, not in how any of it works — so they share a component rather than
 * three that drift apart.
 */
export default function PickBoard({
  state,
  seatIndex,
  onMove,
}: {
  state: DraftState;
  seatIndex: number;
  onMove: (event: DraftEvent) => void;
}) {
  const t = useT();
  const seat = state.seats[seatIndex];

  if (state.phase === "ban") {
    // Under blind bans everything stays clickable: greying out what somebody
    // else already took would be telling.
    const blind = state.config.banVisibility === "blind";
    const options = legalBans(state);
    const left = state.config.bansPerPlayer - seat.bans.length;

    return (
      <>
        <div className="phaseBar">
          <h2>{t("draft.banPrompt")}</h2>
          <span className="label">{t("draft.bansLeft", { n: left })}</span>
        </div>
        <div className="cards">
          {state.config.factionIds.map((id) => {
            const town = faction(id)!;
            const gone = !blind && !options.includes(id);
            return (
              <button
                key={id}
                type="button"
                className={`card${gone ? " struck" : ""}`}
                style={{ "--tint": town.color } as React.CSSProperties}
                disabled={gone}
                onClick={() => onMove({ t: "ban", seat: seatIndex, factionId: id })}
              >
                <span className="cardName">
                  <Crest factionId={town.id} />
                  {town.name}
                </span>
                {gone && <span className="cardTag">{t("draft.banned")}</span>}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  const pool = state.pools[seatIndex] ?? [];

  if (state.phase === "faction") {
    // A pool of one is not a choice, so it is not presented as one — it is
    // told to the player, who confirms it.
    const forced = pool.length === 1;
    return (
      <>
        <div className="phaseBar">
          <h2>{forced ? t("draft.dealtOne", { faction: factionName(pool[0]) }) : t("draft.pickFaction")}</h2>
        </div>
        <div className="cards">
          {pool.map((id) => {
            const town = faction(id)!;
            return (
              <div className="cardSlot" key={id}>
                <button
                  type="button"
                  className="card"
                  style={{ "--tint": town.color } as React.CSSProperties}
                  onClick={() => onMove({ t: "pickF", seat: seatIndex, factionId: id })}
                >
                  <span className="cardName">
                    <Crest factionId={town.id} className="big" />
                    {town.name}
                  </span>
                  {forced && <span className="cardMeta">{t("draft.confirm")}</span>}
                </button>
                <WikiLink href={factionWikiUrl(town)} label={t("wiki.faction", { name: town.name })} />
              </div>
            );
          })}
        </div>
      </>
    );
  }

  if (state.phase === "hero") {
    const forced = pool.length === 1;
    return (
      <>
        <div className="phaseBar">
          <h2>{forced ? t("draft.dealtOneHero", { hero: hero(pool[0])?.name ?? "" }) : t("draft.pickHero")}</h2>
          {seat.factionId && <span className="label">{factionName(seat.factionId)}</span>}
        </div>
        <div className="cards wide">
          {pool.map((id) => {
            const card = hero(id)!;
            const town = faction(card.factionId)!;
            return (
              <div className="cardSlot" key={id}>
                <button
                  type="button"
                  className="card"
                  style={{ "--tint": town.color } as React.CSSProperties}
                  onClick={() => onMove({ t: "pickH", seat: seatIndex, heroId: id })}
                >
                  <span className="cardName">{card.name}</span>
                  <span className="cardMeta">
                    {town.name} · {card.className} ·{" "}
                    {t(`result.${card.klass}` as MessageKey)}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="cardStats"
                    src={heroStatsImage(card)}
                    alt={t("draft.stats", { name: card.name })}
                    loading="lazy"
                  />
                  <span className="cardMeta">
                    {t("result.ability")}: {card.ability}
                  </span>
                  <span className="cardMeta">
                    {t("result.specialty")}: {card.specialty}
                  </span>
                </button>
                <WikiLink href={heroWikiUrl(card)} label={t("wiki.hero", { name: card.name })} />
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return null;
}
