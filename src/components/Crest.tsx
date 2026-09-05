/**
 * A crest per faction, drawn inline.
 *
 * There is no crest artwork to fetch — the rulebook has box shots and the card
 * database has photographs of whole town boards, neither of which survives
 * being shrunk to the corner of a card. So these are drawn here, the same way
 * and for the same reason as the language picker's flags: deliberately
 * simplified to one silhouette each, because at thirty pixels across that is
 * all that reads anyway.
 *
 * Everything is `currentColor`, so a crest takes its faction's tint from the
 * card it sits on, and one shape is one path — which is what keeps it legible
 * on the parchment sheet, in a printer's greyscale, and at seat-strip size.
 */

const VIEWBOX = "0 0 24 24";

const CRESTS: Record<string, React.ReactNode> = {
  // Battlements under a cross: the knights' order.
  castle: (
    <>
      <path d="M4 21v-8h2.5v-3H9v3h1.2V8h3.6v5H15v-3h2.5v3H20v8z" />
      <path d="M11.2 1h1.6v2.2H15v1.6h-2.2V7h-1.6V4.8H9V3.2h2.2z" />
    </>
  ),
  // A conifer over its trunk: the forest that Rampart is built into.
  rampart: (
    <>
      <path d="M12 2l4.4 6.4h-2.3L19 16H5l4.9-7.6H7.6z" />
      <path d="M10.9 16h2.2v6h-2.2z" />
    </>
  ),
  // A wizard's tower under a star.
  tower: (
    <>
      <path d="M6.5 13.2L12 7l5.5 6.2z" />
      <path d="M8 13.6h8V22H8z" />
      <path d="M12 1l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z" />
    </>
  ),
  // A flame. The curl licking up the inside is what stops it reading as a
  // raindrop, which a plain teardrop does.
  inferno: (
    <path d="M12 2c1.5 4 5.5 6 5.5 11a5.5 5.5 0 0 1-11 0c0-2.5 2-3.5 3-5 .1 2 .8 2.8 1.5 2.8 1 0 1.4-1 1-2.8-.5-2.2-.4-4 0-6z" />
  ),
  // A skull. The eyes are punched out of the same path so the crest stays one
  // shape however small it is drawn.
  necropolis: (
    <path
      fillRule="evenodd"
      d="M12 2a8 7.5 0 0 1 8 7.5c0 2.7-1.4 4.6-3 5.7V19h-1.6v2h-1.6v-2h-3.6v2H8.6v-2H7V15.2C5.4 14.1 4 12.2 4 9.5A8 7.5 0 0 1 12 2zm-3 6.4a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm6 0a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z"
    />
  ),
  // A dragon's eye, its pupil punched out of the same shape.
  dungeon: (
    <path
      fillRule="evenodd"
      d="M12 5c5.5 0 9.5 5.2 9.5 7s-4 7-9.5 7-9.5-5.2-9.5-7S6.5 5 12 5zm0 3.2c-1 0-1.8 1.7-1.8 3.8s.8 3.8 1.8 3.8 1.8-1.7 1.8-3.8-.8-3.8-1.8-3.8z"
    />
  ),
  // Crossed blades.
  stronghold: (
    <>
      <rect x="10.7" y="2" width="2.6" height="20" rx="0.7" transform="rotate(45 12 12)" />
      <rect x="10.7" y="2" width="2.6" height="20" rx="0.7" transform="rotate(-45 12 12)" />
    </>
  ),
  // A shield, for the bulwark in the swamp.
  fortress: <path d="M12 2l8 3v7.2C20 17.4 16.4 20.8 12 22.5 7.6 20.8 4 17.4 4 12.2V5z" />,
  // Four points for four elements.
  conflux: <path d="M12 1.5l3.2 6.6H8.8zM22.5 12l-6.6 3.2V8.8zM12 22.5l-3.2-6.6h6.4zM1.5 12l6.6-3.2v6.4z" />,
  // Two swells of sea.
  cove: (
    <>
      <path d="M2 8.5c2-2.2 4.3-2.2 6.3 0s4.3 2.2 6.3 0 4.3-2.2 6.3 0v3c-2-2.2-4.3-2.2-6.3 0s-4.3 2.2-6.3 0-4.3-2.2-6.3 0z" />
      <path d="M2 15c2-2.2 4.3-2.2 6.3 0s4.3 2.2 6.3 0 4.3-2.2 6.3 0v3c-2-2.2-4.3-2.2-6.3 0s-4.3 2.2-6.3 0-4.3-2.2-6.3 0z" />
    </>
  ),
};

/** True when a faction has a crest to draw. A faction added to the catalogue
 * before anybody draws it one falls back to the colour bar it already had. */
export function hasCrest(factionId: string): boolean {
  return factionId in CRESTS;
}

export default function Crest({
  factionId,
  className,
}: {
  factionId: string;
  className?: string;
}) {
  const art = CRESTS[factionId];
  if (!art) return null;
  return (
    <svg
      className={className ? `crest ${className}` : "crest"}
      viewBox={VIEWBOX}
      fill="currentColor"
      role="presentation"
      aria-hidden="true"
    >
      {art}
    </svg>
  );
}
