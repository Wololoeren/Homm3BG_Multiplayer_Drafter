"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { formatCode } from "@/lib/draftCode";
import { draftUrl } from "@/lib/draftUrl";
import type { DraftState } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";
import type { TransportKind } from "@/lib/transport";

/**
 * How a draft leaves this browser.
 *
 * In link mode the URL *is* the wire: it carries the whole draft, so handing
 * somebody the link hands them the draft. The QR is for the person sitting
 * across the table with a phone, which is the case a copied link does not
 * help with.
 */
export default function ShareBar({
  state,
  code,
  mode,
  mySeat,
  nextSeat,
}: {
  state: DraftState;
  code: string;
  mode: TransportKind;
  mySeat: number | null;
  /** Whose turn it is now — the person this link should go to. */
  nextSeat: number | null;
}) {
  const t = useT();
  const [copied, setCopied] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [seatLinks, setSeatLinks] = useState(false);

  const live = mode === "p2p";
  const roomLink = draftUrl({ code, seat: null, live });
  // In link mode the useful link is the next player's, not a generic one:
  // it drops them straight into their own seat with the draft as it stands.
  const handOver =
    !live && nextSeat !== null ? draftUrl({ code, seat: nextSeat, live: false }) : roomLink;

  useEffect(() => {
    if (!showQr) return;
    let stale = false;
    import("qrcode-generator").then(({ default: qrcode }) => {
      if (stale) return;
      // Type 0 lets the library size the symbol for the data; "L" keeps the
      // grid coarse, which matters because these links are long.
      const symbol = qrcode(0, "L");
      symbol.addData(handOver);
      symbol.make();
      setQr(symbol.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
    });
    return () => {
      stale = true;
    };
  }, [showQr, handOver]);

  function copy(what: string, text: string) {
    void copyText(text).then((ok) => {
      if (!ok) return;
      setCopied(what);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  const seatName = (index: number) =>
    state.seats[index].name || t("draft.seat", { n: index + 1 });

  return (
    <div className="share no-print">
      {!live && nextSeat !== null && nextSeat !== mySeat && (
        <p className="note">{t("share.handOver", { name: seatName(nextSeat) })}</p>
      )}

      <div className="shareBar">
        <span className="label">{live ? t("share.room") : t("share.link")}</span>
        <span className="code" title={handOver}>
          {handOver}
        </span>
        <button type="button" className="btn primary" onClick={() => copy("link", handOver)}>
          {copied === "link" ? t("share.copied") : t("share.copy")}
        </button>
        <button type="button" className="btn" onClick={() => setShowQr((on) => !on)}>
          {t("share.qr")}
        </button>
      </div>

      {showQr && (
        <div className="qr">
          {qr ? (
            <div dangerouslySetInnerHTML={{ __html: qr }} />
          ) : (
            <p className="hint">{t("share.qrLoading")}</p>
          )}
          <p className="hint">{t("share.qrHelp")}</p>
        </div>
      )}

      <div className="shareBar">
        <span className="label">{t("share.code")}</span>
        <span className="code">{formatCode(code)}</span>
        <button type="button" className="btn" onClick={() => copy("code", formatCode(code))}>
          {copied === "code" ? t("share.copied") : t("share.copy")}
        </button>
        {!live && (
          <button type="button" className="btn" onClick={() => setSeatLinks((on) => !on)}>
            {t("share.seatLinks")}
          </button>
        )}
      </div>

      {seatLinks && !live && (
        <ul className="seatLinks">
          {state.order.map((index) => {
            const url = draftUrl({ code, seat: index, live: false });
            return (
              <li key={index}>
                <span className="seatLinkName">{seatName(index)}</span>
                <span className="code">{url}</span>
                <button type="button" className="btn" onClick={() => copy(`seat${index}`, url)}>
                  {copied === `seat${index}` ? t("share.copied") : t("share.copy")}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
