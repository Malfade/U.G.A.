const REDACTED_BLOCK = "████████████";
const REDACTED_SHORT = "██████";

export function redact(value: string | null | undefined, short = false): string {
  if (value === null || value === undefined || value.trim() === "") {
    return short ? REDACTED_SHORT : REDACTED_BLOCK;
  }
  return value;
}

export function isRedacted(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
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
