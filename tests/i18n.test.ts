import { describe, expect, it } from "vitest";
import en, { type MessageKey, type Messages } from "@/lib/i18n/messages/en";
import cs from "@/lib/i18n/messages/cs";
import da from "@/lib/i18n/messages/da";
import de from "@/lib/i18n/messages/de";
import es from "@/lib/i18n/messages/es";
import fi from "@/lib/i18n/messages/fi";
import fr from "@/lib/i18n/messages/fr";
import he from "@/lib/i18n/messages/he";
import hu from "@/lib/i18n/messages/hu";
// Aliased: Italian's locale code is also the name of vitest's `it`.
import italian from "@/lib/i18n/messages/it";
import pl from "@/lib/i18n/messages/pl";
import ru from "@/lib/i18n/messages/ru";
import uk from "@/lib/i18n/messages/uk";
import zh from "@/lib/i18n/messages/zh";

/**
 * What a catalogue has to get right.
 *
 * Not completeness — a half-translated language is a supported state, and
 * every key falls back to English on its own. What it must not do is lose a
 * placeholder, because a `{name}` nobody substitutes is printed to the screen
 * exactly as written.
 */
const CATALOGUES: [string, Partial<Messages>][] = [
  ["cs", cs],
  ["da", da],
  ["de", de],
  ["es", es],
  ["fi", fi],
  ["fr", fr],
  ["he", he],
  ["hu", hu],
  ["it", italian],
  ["pl", pl],
  ["ru", ru],
  ["uk", uk],
  ["zh", zh],
];

const slots = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("translations", () => {
  const keys = Object.keys(en) as MessageKey[];

  it("carry the same placeholders English does", () => {
    const wrong: string[] = [];
    for (const [name, catalogue] of CATALOGUES) {
      for (const key of Object.keys(catalogue) as MessageKey[]) {
        const theirs = slots(catalogue[key]!).join(",");
        const ours = slots(en[key]).join(",");
        if (theirs !== ours) wrong.push(`${name}:${key} has [${theirs}], English has [${ours}]`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("say something", () => {
    const empty = CATALOGUES.flatMap(([name, catalogue]) =>
      (Object.keys(catalogue) as MessageKey[])
        .filter((key) => catalogue[key]!.trim() === "")
        .map((key) => `${name}:${key}`),
    );
    expect(empty).toEqual([]);
  });

  it("are all complete, for now", () => {
    // Partial catalogues are supported on purpose, so this is a progress
    // report rather than a rule: if a new English string lands and some
    // language has not caught up, relax this rather than rushing a machine
    // translation in to silence it.
    const missing = CATALOGUES.flatMap(([name, catalogue]) =>
      keys.filter((key) => !(key in catalogue)).map((key) => `${name}:${key}`),
    );
    expect(missing).toEqual([]);
  });
});
