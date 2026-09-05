import { parse } from "./draftCode";

/**
 * Where a draft lives in the address bar.
 *
 *   #/d/<code>            the draft, on whatever screen you open it
 *   #/d/<code>/s/2        …and you are seat 2
 *   #/d/<code>/live       …and everyone is in the same room, picking live
 *   #/d/<code>/s/2/live   both
 *
 * The **fragment**, not a query string: a fragment is never sent to the
 * server, which matters because the whole draft is in it, and a static export
 * needs no routing config to serve it.
 */

export interface DraftLink {
  code: string;
  /** Which seat this link is for; null means "ask when you get there". */
  seat: number | null;
  live: boolean;
}

export function parseHash(hash: string): DraftLink | null {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] !== "d" || !parts[1]) return null;

  const code = parse(parts[1]);
  if (!code) return null;

  let seat: number | null = null;
  let live = false;
  for (let i = 2; i < parts.length; i++) {
    if (parts[i] === "s" && parts[i + 1] !== undefined) {
      const n = Number(parts[i + 1]);
      // Seats are 1-based in a link, because "you are player 1" is what a
      // person hands to another person.
      if (Number.isInteger(n) && n >= 1) seat = n - 1;
      i += 1;
    } else if (parts[i] === "live") {
      live = true;
    }
  }
  return { code, seat, live };
}

export function buildHash({ code, seat, live }: DraftLink): string {
  let hash = `#/d/${code}`;
  if (seat !== null) hash += `/s/${seat + 1}`;
  if (live) hash += "/live";
  return hash;
}

/** The link to actually hand somebody. Falls back to the fragment alone when
 * there is no window to read an origin from. */
export function draftUrl(link: DraftLink): string {
  const hash = buildHash(link);
  if (typeof window === "undefined") return hash;
  const { origin, pathname } = window.location;
  return `${origin}${pathname}${hash}`;
}

/** Writes the link without adding a history entry, so the address bar always
 * describes the draft on screen but Back still leaves the app rather than
 * stepping through every move somebody made. */
export function replaceHash(link: DraftLink): string {
  const hash = buildHash(link);
  if (typeof window !== "undefined" && window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }
  return hash;
}
