"use client";

import { useEffect, useRef, useState } from "react";
import Flag from "./Flag";
import { useI18n } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/locales";

/** The current flag, and a popover of the rest. Small on purpose — it sits
 * in the top bar's corner and is not what anyone came here to do. */
export default function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className="langPicker no-print" ref={ref}>
      <button
        type="button"
        className="langButton"
        title={t("lang.label")}
        aria-label={t("lang.label")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Flag code={current.flag} className="langFlag" />
      </button>
      {open && (
        <div className="langPanel">
          {LOCALES.map((option) => (
            <button
              type="button"
              key={option.code}
              className={option.code === locale ? "langRow active" : "langRow"}
              lang={option.code}
              onClick={() => {
                setLocale(option.code);
                setOpen(false);
              }}
            >
              <Flag code={option.flag} className="langFlag" />
              <span className="langCode">{option.flag}</span>
              <span className="langName">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
