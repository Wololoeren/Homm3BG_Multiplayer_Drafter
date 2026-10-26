"use client";

import { useMemo, useState } from "react";
import Crest from "./Crest";
import WikiLink from "./WikiLink";
import { faction, factionName, hero, heroName } from "@/lib/catalogue";
import { factionWikiUrl, heroWikiUrl } from "@/lib/wiki";
import { copyText } from "@/lib/clipboard";
import { encodeDraft, formatCode } from "@/lib/draftCode";
import { optionsOffered, seatPosition } from "@/lib/draftEngine";
import type { DraftEvent, DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import type { MessageKey } from "@/lib/i18n/messages/en";

/**
 * What the table came away with, laid out like a page of the Fan-Made Mission
 * Book — the same parchment the Scenario Editor prints on, so a draft can go
 * in the same folder as the scenario it was drafted for.
 *
 * The draft code is on the sheet on purpose: it is the one thing that can
 * reproduce this exact deal, and a printed sheet that cannot be checked later
 * is just an assertion.
 */
export default function ResultSheet({
  state,
  events,
  onAgain,
  onNewSetup,
}: {
  state: DraftState;
  events: DraftEvent[];
  onAgain: () => void;
  onNewSetup: () => void;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  /**
   * Off by default: the sheet is the answer to "what are we playing", and the
   * roads not taken are a second question. Asked for, they go on the sheet
   * itself rather than only on screen, so a printed copy carries them too.
   */
  const [showPassed, setShowPassed] = useState(false);
  const code = encodeDraft(state.config, state.seed, events);
  const offered = useMemo(
    () => optionsOffered(state.config, state.seed, events),
    [state.config, state.seed, events],
  );
  const passedBy = (index: number) => offered[index] ?? { factions: [], heroes: [] };

  // Printed in seating order, which is the order the table will actually play
  // in — drafted or rolled from the seed, seatPosition knows which.
  const rows = state.order
    .map((index) => {
      const seat = state.seats[index];
      return {
        seat,
        position: seatPosition(state, index),
        town: seat.factionId ? faction(seat.factionId) : null,
        card: seat.heroId ? hero(seat.heroId) : null,
        passed: passedBy(index),
      };
    })
    .sort((a, b) => a.position - b.position);

  function copyAsText() {
    const lines = rows.flatMap(({ seat, position, town, card, passed }) => {
      const out = [
        `${position}. ${seat.name || t("draft.seat", { n: seat.index + 1 })}: ${town?.name ?? "—"} — ${card?.name ?? "—"}` +
          (card ? ` (${card.className})` : ""),
      ];
      // Labelled, because two bare lists under one name say nothing about
      // which was the town and which the hero.
      if (showPassed && passed.factions.length) {
        out.push(
          `   ${t("result.faction")} — ${t("result.alsoOffered", { options: passed.factions.map(factionName).join(", ") })}`,
        );
      }
      if (showPassed && passed.heroes.length) {
        out.push(
          `   ${t("result.hero")} — ${t("result.alsoOffered", { options: passed.heroes.map(heroName).join(", ") })}`,
        );
      }
      return out;
    });
    if (state.bannedFactions.length) {
      lines.push(t("result.bans", { factions: state.bannedFactions.map(factionName).join(", ") }));
    }
    if (state.bannedHeroes.length) {
      lines.push(t("result.heroBans", { heroes: state.bannedHeroes.map(heroName).join(", ") }));
    }
    // The seed first: it is the short one, the one people say out loud,
    // and with the setup it is what reproduces this deal.
    lines.push(`${t("result.seed")}: ${state.seed}`);
    lines.push(`${t("result.code")}: ${formatCode(code)}`);
    void copyText(lines.join("\n")).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <>
      <div className="shareBar no-print">
        <button type="button" className="btn" onClick={copyAsText}>
          {copied ? t("result.copied") : t("result.copy")}
        </button>
        <button type="button" className="btn" onClick={() => window.print()}>
          {t("result.print")}
        </button>
        <button type="button" className="btn primary" onClick={onAgain}>
          {t("result.again")}
        </button>
        <button type="button" className="btn" onClick={onNewSetup}>
          {t("result.newSetup")}
        </button>
        <label className="toggle" style={{ marginLeft: "auto" }}>
          <input
            type="checkbox"
            checked={showPassed}
            onChange={(e) => setShowPassed(e.target.checked)}
          />
          <span>{t("result.showPassed")}</span>
        </label>
      </div>

      <div className="sheetWrap">
        <div className="sheet">
          <h1>{t("result.heading")}</h1>
          <p className="sheetSub">{t("app.subtitle")}</p>

          <table className="sheetTable">
            <thead>
              <tr>
                {/* Hints, not law: the four name columns are nowrap, so each
                    takes what it needs and the player column absorbs the
                    slack. The class column is left to the remainder because
                    it is the widest thing on the sheet. */}
                <th style={{ width: "6%" }}>{t("result.seat")}</th>
                <th style={{ width: "22%" }}>{t("result.player")}</th>
                <th style={{ width: "21%" }}>{t("result.faction")}</th>
                <th style={{ width: "21%" }}>{t("result.hero")}</th>
                <th>{t("result.class")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ seat, position, town, card, passed }) => (
                <tr key={seat.index}>
                  {/* The labels are the column headings again, which a phone
                      shows in front of each value once the table has stacked
                      and the header row is gone. */}
                  <td className="seatNo">{position}</td>
                  <td className="who">{seat.name || t("draft.seat", { n: seat.index + 1 })}</td>
                  <td data-label={t("result.faction")}>
                    {town && <Crest factionId={town.id} className="sheetCrest" />}
                    {town?.name ?? "—"}
                    {town && (
                      <WikiLink
                        href={factionWikiUrl(town)}
                        label={t("wiki.faction", { name: town.name })}
                      />
                    )}
                    {showPassed && passed.factions.length > 0 && (
                      <span className="passed">
                        {t("result.alsoOffered", {
                          options: passed.factions.map(factionName).join(", "),
                        })}
                      </span>
                    )}
                  </td>
                  <td data-label={t("result.hero")}>
                    {card?.name ?? "—"}
                    {card && (
                      <WikiLink href={heroWikiUrl(card)} label={t("wiki.hero", { name: card.name })} />
                    )}
                    {showPassed && passed.heroes.length > 0 && (
                      <span className="passed">
                        {t("result.alsoOffered", {
                          options: passed.heroes.map(heroName).join(", "),
                        })}
                      </span>
                    )}
                  </td>
                  <td data-label={t("result.class")}>
                    {card ? `${card.className} · ${t(`result.${card.klass}` as MessageKey)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sheetFoot">
            {state.bannedFactions.length === 0 && state.bannedHeroes.length === 0 && (
              <p style={{ margin: 0 }}>{t("result.nobans")}</p>
            )}
            {state.bannedFactions.length > 0 && (
              <p style={{ margin: 0 }}>
                {t("result.bans", { factions: state.bannedFactions.map(factionName).join(", ") })}
              </p>
            )}
            {state.bannedHeroes.length > 0 && (
              <p style={{ margin: state.bannedFactions.length ? "1mm 0 0" : 0 }}>
                {t("result.heroBans", { heroes: state.bannedHeroes.map(heroName).join(", ") })}
              </p>
            )}
            <p style={{ margin: "2mm 0 0" }}>
              {t("result.seed")}: <code>{state.seed}</code>
            </p>
            <p style={{ margin: "1mm 0 0" }}>
              {t("result.code")}: <code>{formatCode(code)}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
