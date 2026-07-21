const REDACTED_BLOCK = "████████████";
const REDACTED_SHORT = "██████";
const REDACT_OPEN = "[[R]]";
const REDACT_CLOSE = "[[/R]]";

export function redact(value: string | null | undefined, short = false): string {
  if (value === null || value === undefined || value.trim() === "") {
    return short ? REDACTED_SHORT : REDACTED_BLOCK;
  }
  return value;
}

/** Empty / missing — do not render the field at all */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
}

/** Legacy: empty was treated as redacted. Prefer isEmpty + explicit markers. */
export function isRedacted(value: string | null | undefined): boolean {
  return isEmpty(value);
}

export function blocksForLength(len: number): string {
  const n = Math.max(4, Math.min(24, len || 8));
  return "█".repeat(n);
}

export type ContentSegment =
  | { type: "text"; value: string }
  | { type: "redacted"; value: string };

export function parseRedactionMarkers(content: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let rest = content;
  while (rest.length > 0) {
    const start = rest.indexOf(REDACT_OPEN);
    if (start === -1) {
      segments.push({ type: "text", value: rest });
      break;
    }
    if (start > 0) {
      segments.push({ type: "text", value: rest.slice(0, start) });
    }
    const afterOpen = rest.slice(start + REDACT_OPEN.length);
    const end = afterOpen.indexOf(REDACT_CLOSE);
    if (end === -1) {
      segments.push({ type: "text", value: rest.slice(start) });
      break;
    }
    segments.push({ type: "redacted", value: afterOpen.slice(0, end) });
    rest = afterOpen.slice(end + REDACT_CLOSE.length);
  }
  return segments;
}

export function wrapRedaction(text: string): string {
  return `${REDACT_OPEN}${text}${REDACT_CLOSE}`;
}

export function redactDamaged(content: string, damagePercent: number): string {
  if (damagePercent <= 0) return content;
  if (damagePercent >= 100) return REDACTED_BLOCK.repeat(3);

  const chars = content.split("");
  const toRedact = Math.floor(chars.length * (damagePercent / 100));
  const indices = new Set<number>();

  let seed = damagePercent * 7 + content.length * 13;
  while (indices.size < toRedact) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    indices.add(seed % chars.length);
  }

  return chars
    .map((c, i) => (indices.has(i) ? "█" : c))
    .join("");
}

export const CLEARANCE_LABELS: Record<number, string> = {
  0: "ОТКРЫТЫЙ",
  1: "ОГРАНИЧЕННЫЙ",
  2: "СЕКРЕТНЫЙ",
  3: "СОВЕРШЕННО СЕКРЕТНЫЙ",
  4: "ОСОБОЙ ВАЖНОСТИ",
};

export function normalizeKey(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}
