/**
 * Copying text, with the older way kept as a fallback.
 *
 * `navigator.clipboard.writeText` is the right API and the one to try first,
 * but it is gated behind a permission that some browsers and embedded contexts
 * refuse outright even from a genuine click. The deprecated
 * `document.execCommand("copy")` route has no such gate, and between them a
 * copy nearly always lands.
 *
 * Returns whether it worked, because the caller has to be honest about it:
 * telling somebody their link is on the clipboard when it is not costs them a
 * turn of the draft.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission refused, or no clipboard at all. Try the old way.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    // Off-screen rather than hidden: a display:none field cannot be selected.
    area.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
}
