"use client";

/**
 * An outward arrow to the wiki.
 *
 * Deliberately small and low-contrast: on a pick board it sits next to a card
 * whose whole point is to be clicked, and "look this up" must not compete with
 * "take this". It stops the click from reaching the card underneath, so
 * reading about a hero is never mistaken for drafting them.
 */
export default function WikiLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="wikiLink"
      href={href}
      title={label}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      <svg className="wikiIcon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
