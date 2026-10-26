/**
 * Might or magic, as the cards themselves mark it.
 *
 * Every hero card ends its stat strip with a badge — a horned helm for might,
 * a wizard's hat for magic — so there was no reason to invent a sword and a
 * star when the table already knows those two silhouettes. Traced from the
 * strips in /public/heroes and simplified the way the faction crests are,
 * because at fifteen pixels the outline is all that survives.
 *
 * `currentColor` throughout, so a mark takes the ink of whatever it sits in
 * and still reads out of a greyscale printer.
 */

const MARKS: Record<"might" | "magic", React.ReactNode> = {
  // The helm: two splayed horns over a lower central peak, and a face with
  // the eye slit and the gap between the cheeks punched out of the same path.
  might: (
    <path
      fillRule="evenodd"
      d="M2.2 4.4C2.4 9.6 3.4 13.6 4.4 16.4c.6 1.6.8 3.2.8 4.6h5.1v-4.6h3.4V21h5.1c0-1.4.2-3 .8-4.6C20.6 13.6 21.6 9.6 21.8 4.4c-1.8 2.2-3.8 5.2-6.1 8.4-1-1.8-2.3-3-3.7-3.6-1.4.6-2.7 1.8-3.7 3.6C6 9.6 4 6.6 2.2 4.4zM8 13.1h8v2.3H8z"
    />
  ),
  // The hat: a cone leaning back off a brim that tapers to a point one way and
  // curls the other. The curl is left open, or the brim reads as a slab.
  magic: (
    <>
      <path d="M19.6 3.2c-5 2.2-11 6.4-15 10.7h8.9c2.9-3.5 5.1-7.2 6.1-10.7z" />
      <path
        fillRule="evenodd"
        d="M.9 14.9c3.5-.5 7.5-.3 11.3.3 4.8.8 8.6 2.1 10 3.6-1.2 1.7-4.6 2.3-8.7 1.8C8.8 19.9 4 18 .9 14.9zm8.5 2c2.2 1 5 1.7 7.4 1.8 1.2.1 2 0 2.4-.3-1.2-.8-3.6-1.4-6-1.7-1.7-.2-2.9-.2-3.8.2z"
      />
    </>
  ),
};

export default function ClassMark({
  klass,
  className = "classMark",
}: {
  klass: "might" | "magic";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {MARKS[klass]}
    </svg>
  );
}
