import type { Metadata } from "next";
import "./globals.css";
import { asset } from "@/lib/assets";
import { I18nProvider } from "@/lib/i18n";

/**
 * Rules that reference files in /public. They live here rather than in
 * globals.css because a stylesheet cannot see the GitHub Pages base path, and
 * a relative url() would depend on where Next happens to emit the CSS.
 */
const assetStyles = `
@font-face {
  font-family: "Liberation Serif";
  src: url("${asset("/fonts/LiberationSerif-Regular.woff2")}") format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Liberation Serif";
  src: url("${asset("/fonts/LiberationSerif-Bold.woff2")}") format("woff2");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Liberation Serif";
  src: url("${asset("/fonts/LiberationSerif-Italic.woff2")}") format("woff2");
  font-weight: normal;
  font-style: italic;
  font-display: swap;
}
.sheet {
  background-image: url("${asset("/layout/tausta.webp")}");
  background-size: cover;
}
.sheetHeading {
  background-image: url("${asset("/layout/section_heading.webp")}");
}
`;

export const metadata: Metadata = {
  title: "HoMM3 BG — Multiplayer Drafter",
  description:
    "Draft a faction and a hero for every player at the table, from random pools, with nobody sharing a faction.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={asset("/layout/random.webp")} type="image/webp" />
        <style dangerouslySetInnerHTML={{ __html: assetStyles }} />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
