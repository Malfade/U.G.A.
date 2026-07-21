import { prisma } from "@/lib/db";
import { GraphExplorer, GraphLink, GraphNode } from "@/components/graph/GraphExplorer";

export default async function GraphPage() {
  const [
    characters,
    relationships,
    organizations,
    events,
    locations,
    documents,
    characterEvents,
    eventLocations,
    characterDocuments,
    eventDocuments,
    dialogues,
    entityLinks,
  ] = await Promise.all([
    prisma.character.findMany({
      where: { isSecondary: false },
      select: {
        id: true,
        name: true,
        organizationId: true,
        faction: { select: { name: true } },
      },
    }),
    prisma.relationship.findMany({
      select: {
        id: true,
        characterAId: true,
        characterBId: true,
        type: true,
        trustLevel: true,
      },
    }),
    prisma.organization.findMany({ select: { id: true, name: true } }),
    prisma.event.findMany({ select: { id: true, name: true, date: true } }),
    prisma.location.findMany({
      select: { id: true, name: true, type: true },
    }),
    prisma.document.findMany({ select: { id: true, title: true, type: true } }),
    prisma.characterEvent.findMany(),
    prisma.eventLocation.findMany(),
    prisma.characterDocument.findMany(),
    prisma.eventDocument.findMany(),
    prisma.dialogue.findMany({
      select: {
        id: true,
        title: true,
        locationId: true,
        aboutCharacterId: true,
        aboutLocationId: true,
      },
    }),
    prisma.entityLink.findMany(),
  ]);

  const nodes: GraphNode[] = [
    ...characters.map((c) => ({
      id: c.id,
      name: c.name,
      type: "character" as const,
      group: c.faction?.name ?? "Нет фракции",
    })),
    ...organizations.map((o) => ({
      id: `org-${o.id}`,
      name: o.name,
      type: "organization" as const,
      group: "Организация",
    })),
    ...events.map((e) => ({
      id: `event-${e.id}`,
      name: e.date ? `${e.date}: ${e.name}` : e.name,
      type: "event" as const,
      group: "Событие",
    })),
    ...locations.map((l) => ({
      id: `loc-${l.id}`,
      name: l.name,
      type: "location" as const,
      group: "Локация",
    })),
    ...documents.map((d) => ({
      id: `doc-${d.id}`,
      name: d.title,
      type: "document" as const,
      group: "Документ",
    })),
    ...dialogues.map((d) => ({
      id: `dlg-${d.id}`,
      name: d.title || "Запись",
      type: "dialogue" as const,
      group: "Запись",
    })),
  ];

  const nodeIds = new Set(nodes.map((n) => n.id));
  const links: GraphLink[] = [];

  const push = (
    source: string,
    target: string,
    type: string,
    id: string,
    trustLevel = 50
  ) => {
    if (!nodeIds.has(source) || !nodeIds.has(target)) return;
    links.push({ source, target, type, trustLevel, id });
  };

  for (const r of relationships) {
    push(r.characterAId, r.characterBId, r.type, `rel-${r.id}`, r.trustLevel);
  }

  for (const c of characters) {
    if (c.organizationId) {
      push(c.id, `org-${c.organizationId}`, "состоит в", `char-org-${c.id}`, 70);
    }
  }

  for (const ce of characterEvents) {
    push(
      ce.characterId,
      `event-${ce.eventId}`,
      "участник",
      `ce-${ce.characterId}-${ce.eventId}`,
      60
    );
  }

  for (const el of eventLocations) {
    push(
      `event-${el.eventId}`,
      `loc-${el.locationId}`,
      "место",
      `el-${el.eventId}-${el.locationId}`,
      55
    );
  }

  for (const cd of characterDocuments) {
    push(
      cd.characterId,
      `doc-${cd.documentId}`,
      "документ",
      `cd-${cd.characterId}-${cd.documentId}`,
      45
    );
  }

  for (const ed of eventDocuments) {
    push(
      `event-${ed.eventId}`,
      `doc-${ed.documentId}`,
      "материал",
      `ed-${ed.eventId}-${ed.documentId}`,
      50
    );
  }

  for (const d of dialogues) {
    const dlg = `dlg-${d.id}`;
    if (d.locationId) push(dlg, `loc-${d.locationId}`, "запись", `dlg-loc-${d.id}`, 40);
    if (d.aboutLocationId) {
      push(dlg, `loc-${d.aboutLocationId}`, "о месте", `dlg-about-loc-${d.id}`, 40);
    }
    if (d.aboutCharacterId) {
      push(dlg, d.aboutCharacterId, "о персонаже", `dlg-about-char-${d.id}`, 40);
    }
  }

  for (const el of entityLinks) {
    const from =
      el.sourceType === "organization"
        ? `org-${el.sourceId}`
        : el.sourceType === "event"
          ? `event-${el.sourceId}`
          : el.sourceType === "document"
            ? `doc-${el.sourceId}`
            : el.sourceType === "location"
              ? `loc-${el.sourceId}`
              : el.sourceId;
    const to =
      el.targetType === "organization"
        ? `org-${el.targetId}`
        : el.targetType === "event"
          ? `event-${el.targetId}`
          : el.targetType === "document"
            ? `doc-${el.targetId}`
            : el.targetType === "location"
              ? `loc-${el.targetId}`
              : el.targetId;
    const label =
      el.targetType === "event"
        ? "организация"
        : el.targetType === "document"
          ? "документ орг."
          : "база";
    push(from, to, label, `entity-${el.id}`, 65);
  }

  return (
    <div className="h-full animate-fade-in">
      <div className="mb-4">
        <h1 className="font-mono text-xl tracking-wider text-gray-200">
          ◬ СЕТЬ СВЯЗЕЙ
        </h1>
        <p className="mt-1 font-mono text-xs text-gray-600">
          Узлов: {nodes.length} // Связей: {links.length}
        </p>
      </div>
      <GraphExplorer nodes={nodes} links={links} />
    </div>
  );
}
