export interface FactionViewData {
  id: string;
  entityType: string;
  content: string;
  faction: { id: string; name: string };
}

export function parseFactionViewContent(content: string): Record<string, string> {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === "object" && parsed !== null) {
      return Object.fromEntries(
        Object.entries(parsed).map(([k, v]) => [k, String(v)])
      );
    }
  } catch {
    return { content };
  }
  return {};
}

export function resolveFactionField(
  fieldKey: string,
  baseValue: string | null | undefined,
  factionView: Record<string, string> | null,
  isObserver: boolean
): string | null | undefined {
  if (isObserver) return baseValue;
  if (!factionView) return null;
  if (fieldKey in factionView) return factionView[fieldKey];
  return null;
}

export function getExtraFactionFields(
  factionView: Record<string, string>,
  knownKeys: string[]
): Record<string, string> {
  const extras: Record<string, string> = {};
  for (const [key, value] of Object.entries(factionView)) {
    if (!knownKeys.includes(key)) extras[key] = value;
  }
  return extras;
}
