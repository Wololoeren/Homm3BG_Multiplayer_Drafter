"use client";

import { useState } from "react";
import Crest from "./Crest";
import WikiLink from "./WikiLink";
import { faction, factionName, hero, heroName } from "@/lib/catalogue";
import { factionWikiUrl, heroWikiUrl } from "@/lib/wiki";
import { copyText } from "@/lib/clipboard";
import { encodeDraft, formatCode } from "@/lib/draftCode";
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
  const code = encodeDraft(state.config, state.seed, events);

  const rows = state.order.map((index) => {
    const seat = state.seats[index];
    return {
      seat,
      town: seat.factionId ? faction(seat.factionId) : null,
      card: seat.heroId ? hero(seat.heroId) : null,
    };
  });

  function copyAsText() {
    const lines = rows.map(
      ({ seat, town, card }) =>
        `${seat.name || t("draft.seat", { n: seat.index + 1 })}: ${town?.name ?? "—"} — ${card?.name ?? "—"}` +
        (card ? ` (${card.className})` : ""),
    );
    if (state.bannedFactions.length) {
      lines.push(t("result.bans", { factions: state.bannedFactions.map(factionName).join(", ") }));
    }
    if (state.bannedHeroes.length) {
      lines.push(t("result.heroBans", { heroes: state.bannedHeroes.map(heroName).join(", ") }));
    }
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
      </div>

      <div className="sheetWrap">
        <div className="sheet">
          <h1>{t("result.heading")}</h1>
          <p className="sheetSub">{t("app.subtitle")}</p>

          <table className="sheetTable">
            <thead>
              <tr>
                <th style={{ width: "26%" }}>{t("result.player")}</th>
                <th style={{ width: "24%" }}>{t("result.faction")}</th>
                <th style={{ width: "26%" }}>{t("result.hero")}</th>
                <th>{t("result.class")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ seat, town, card }) => (
                <tr key={seat.index}>
                  <td className="who">{seat.name || t("draft.seat", { n: seat.index + 1 })}</td>
                  <td>
                    {town && <Crest factionId={town.id} className="sheetCrest" />}
                    {town?.name ?? "—"}
                    {town && (
                      <WikiLink
                        href={factionWikiUrl(town)}
                        label={t("wiki.faction", { name: town.name })}
                      />
                    )}
                  </td>
                  <td>
                    {card?.name ?? "—"}
                    {card && (
                      <WikiLink href={heroWikiUrl(card)} label={t("wiki.hero", { name: card.name })} />
                    )}
                  </td>
                  <td>
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
              {t("result.code")}: <code>{formatCode(code)}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
