import { useT } from "@/lib/i18n";

/**
 * The rest of the family, for somebody who found this one first.
 *
 * Kept off the printed sheet: a draft in a folder is about the game on the
 * table, not about where the tool came from.
 */
const PROJECTS = [
  { key: "footer.cardCreator", href: "https://wololoeren.github.io/homm3_card_creator/" },
  { key: "footer.generator", href: "https://wololoeren.github.io/homm3_Random_Scenario_Generator/" },
  // The trailing dot is part of the repository name, not a typo.
  { key: "footer.editor", href: "https://wololoeren.github.io/homm3BG_scenario_editor./" },
] as const;

export default function SiteFooter() {
  const t = useT();
  return (
    <footer className="siteFooter no-print">
      <span>{t("footer.more")}</span>
      {PROJECTS.map(({ key, href }) => (
        <a key={href} href={href} target="_blank" rel="noreferrer">
          {t(key)}
        </a>
      ))}
    </footer>
  );
}
