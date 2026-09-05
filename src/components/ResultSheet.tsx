"use client";

import { useState } from "react";
import { faction, factionName, hero } from "@/lib/catalogue";
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
    lines.push(`${t("result.code")}: ${formatCode(code)}`);
    navigator.clipboard?.writeText(lines.join("\n")).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => setCopied(false),
    );
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
                    {town && <span className="sheetSwatch" style={{ background: town.color }} />}
                    {town?.name ?? "—"}
                  </td>
                  <td>{card?.name ?? "—"}</td>
                  <td>
                    {card ? `${card.className} · ${t(`result.${card.klass}` as MessageKey)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="sheetFoot">
            <p style={{ margin: 0 }}>
              {state.bannedFactions.length
                ? t("result.bans", { factions: state.bannedFactions.map(factionName).join(", ") })
                : t("result.nobans")}
            </p>
            <p style={{ margin: "2mm 0 0" }}>
              {t("result.code")}: <code>{formatCode(code)}</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
