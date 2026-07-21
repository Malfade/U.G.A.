/** Shared helpers for EntityLink-based archive connections (org ↔ event/doc/loc). */

export const ENTITY_LINK_KINDS = {
  organization_event: {
    label: "Организация → событие",
    sourceType: "organization",
    targetType: "event",
    source: "organization" as const,
    target: "event" as const,
  },
  organization_document: {
    label: "Организация → документ",
    sourceType: "organization",
    targetType: "document",
    source: "organization" as const,
    target: "document" as const,
  },
  organization_location: {
    label: "Организация → локация",
    sourceType: "organization",
    targetType: "location",
    source: "organization" as const,
    target: "location" as const,
  },
} as const;

export type EntityLinkKind = keyof typeof ENTITY_LINK_KINDS;

export function graphNodeId(type: string, id: string): string {
  switch (type) {
    case "organization":
      return `org-${id}`;
    case "event":
      return `event-${id}`;
    case "document":
      return `doc-${id}`;
    case "location":
      return `loc-${id}`;
    case "dialogue":
      return `dlg-${id}`;
    case "character":
      return id;
    default:
      return `${type}-${id}`;
  }
}

export function kindFromEntityTypes(
  sourceType: string,
  targetType: string
): EntityLinkKind | null {
  const entry = Object.entries(ENTITY_LINK_KINDS).find(
    ([, v]) => v.sourceType === sourceType && v.targetType === targetType
  );
  return (entry?.[0] as EntityLinkKind) ?? null;
}
