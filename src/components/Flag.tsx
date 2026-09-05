/**
 * The picker's flags, drawn inline.
 *
 * Emoji flags are not an option here: Windows renders them as bare letter
 * pairs, which is exactly the thing a flag picker exists to avoid. These are
 * deliberately simplified — stripes, crosses and one charge each — because at
 * 18 pixels across that is all that survives anyway.
 */

const VIEWBOX = "0 0 18 12";

/** A Nordic cross, offset left the way all of them are. */
function nordic(field: string, cross: string, inner?: string) {
  return (
    <>
      <rect width="18" height="12" fill={field} />
      <rect x="5" width="2.4" height="12" fill={cross} />
      <rect y="4.8" width="18" height="2.4" fill={cross} />
      {inner && (
        <>
          <rect x="5.6" width="1.2" height="12" fill={inner} />
          <rect y="5.4" width="18" height="1.2" fill={inner} />
        </>
      )}
    </>
  );
}

function stripes(colors: string[], vertical = false) {
  const size = (vertical ? 18 : 12) / colors.length;
  return (
    <>
      {colors.map((color, i) => (
        <rect
          key={i}
          x={vertical ? i * size : 0}
          y={vertical ? 0 : i * size}
          width={vertical ? size : 18}
          height={vertical ? 12 : size}
          fill={color}
        />
      ))}
    </>
  );
}

const FLAGS: Record<string, React.ReactNode> = {
  gb: (
    <>
      <rect width="18" height="12" fill="#012169" />
      <path d="M0 0l18 12M18 0L0 12" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0l18 12M18 0L0 12" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="4" />
      <path d="M9 0v12M0 6h18" stroke="#C8102E" strokeWidth="2.4" />
    </>
  ),
  pl: stripes(["#fff", "#DC143C"]),
  fr: stripes(["#002395", "#fff", "#ED2939"], true),
  ru: stripes(["#fff", "#0039A6", "#D52B1E"]),
  de: stripes(["#000", "#DD0000", "#FFCE00"]),
  cz: (
    <>
      <rect width="18" height="6" fill="#fff" />
      <rect y="6" width="18" height="6" fill="#D7141A" />
      <path d="M0 0l9 6-9 6z" fill="#11457E" />
    </>
  ),
  ua: (
    <>
      <rect width="18" height="6" fill="#0057B7" />
      <rect y="6" width="18" height="6" fill="#FFDD00" />
    </>
  ),
  fi: nordic("#fff", "#003580"),
  it: stripes(["#008C45", "#fff", "#CD212A"], true),
  es: (
    <>
      <rect width="18" height="12" fill="#AA151B" />
      <rect y="3" width="18" height="6" fill="#F1BF00" />
    </>
  ),
  dk: nordic("#C8102E", "#fff"),
  hu: stripes(["#CD2A3E", "#fff", "#436F4D"]),
  cn: (
    <>
      <rect width="18" height="12" fill="#DE2910" />
      <path
        d="M4 1.6l.75 2.3-1.96-1.42h2.42L3.25 3.9z"
        fill="#FFDE00"
      />
      <circle cx="7.2" cy="1.4" r="0.5" fill="#FFDE00" />
      <circle cx="8.6" cy="2.8" r="0.5" fill="#FFDE00" />
      <circle cx="8.6" cy="4.7" r="0.5" fill="#FFDE00" />
      <circle cx="7.2" cy="6" r="0.5" fill="#FFDE00" />
    </>
  ),
  il: (
    <>
      <rect width="18" height="12" fill="#fff" />
      <rect y="1.4" width="18" height="1.6" fill="#0038B8" />
      <rect y="9" width="18" height="1.6" fill="#0038B8" />
      <path
        d="M9 4l2 3.4H7zM9 8.4L7 5h4z"
        fill="none"
        stroke="#0038B8"
        strokeWidth="0.7"
      />
    </>
  ),
};

export default function Flag({ code, className }: { code: string; className?: string }) {
  const art = FLAGS[code];
  if (!art) return null;
  return (
    <svg className={className} viewBox={VIEWBOX} role="presentation" aria-hidden="true">
      {art}
    </svg>
  );
}
