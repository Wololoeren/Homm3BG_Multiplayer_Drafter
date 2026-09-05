"use client";

import { useState } from "react";
import { DraftCodeError, decodeDraft } from "@/lib/draftCode";
import type { DraftConfig, DraftEvent } from "@/lib/draftTypes";
import { useT } from "@/lib/i18n";

/**
 * Opening a draft from its code. Small on purpose for now: it is the seed of
 * the code-passing transport (docs/PLAN.md §3.3 B), and what it already does
 * — carry a whole draft between two browsers with no server in between — is
 * the part worth having before seats and URLs are built on top of it.
 */
export default function ResumeBar({
  onResume,
}: {
  onResume: (draft: { config: DraftConfig; seed: string; events: DraftEvent[] }) => void;
}) {
  const t = useT();
  const [text, setText] = useState("");
  const [error, setError] = useState<"bad" | "badCatalogue" | null>(null);

  function open() {
    try {
      onResume(decodeDraft(text));
      setText("");
      setError(null);
    } catch (thrown) {
      // A code from a build with a different faction list gets its own message,
      // because "that is not a code" would be a lie and would send someone
      // looking for a typo that is not there.
      setError(thrown instanceof DraftCodeError && thrown.reason === "catalogue" ? "badCatalogue" : "bad");
    }
  }

  return (
    <div className="shareBar">
      <span className="label">{t("share.resume")}</span>
      <input
        className="codeInput"
        value={text}
        placeholder={t("share.paste")}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") open();
        }}
      />
      <button type="button" className="btn" disabled={!text.trim()} onClick={open}>
        {t("share.open")}
      </button>
      {error && <span style={{ color: "#e8bdb6" }}>{t(error === "bad" ? "share.bad" : "share.badCatalogue")}</span>}
    </div>
  );
}
