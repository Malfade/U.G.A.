import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  ArchiveLinksList,
  ArchiveLinkRow,
} from "@/components/admin/ArchiveLinksList";

export default async function AdminRelationshipsPage() {
  const [
    relationships,
    characterEvents,
    eventLocations,
    characterDocuments,
    eventDocuments,
    charactersWithOrg,
    dialogues,
    entityLinks,
  ] = await Promise.all([
    prisma.relationship.findMany({
      include: {
        characterA: { select: { name: true } },
        characterB: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.characterEvent.findMany({
      include: {
        character: { select: { name: true } },
        event: { select: { name: true, date: true } },
      },
    }),
    prisma.eventLocation.findMany({
      include: {
        event: { select: { name: true, date: true } },
        location: { select: { name: true } },
      },
    }),
    prisma.characterDocument.findMany({
      include: {
        character: { select: { name: true } },
        document: { select: { title: true } },
      },
    }),
    prisma.eventDocument.findMany({
      include: {
        event: { select: { name: true, date: true } },
        document: { select: { title: true } },
      },
    }),
    prisma.character.findMany({
      where: { organizationId: { not: null } },
      select: {
        id: true,
        name: true,
        organization: { select: { id: true, name: true } },
      },
    }),
    prisma.dialogue.findMany({
      select: {
        id: true,
        title: true,
        locationId: true,
        aboutCharacterId: true,
        aboutLocationId: true,
        location: { select: { name: true } },
        aboutCharacter: { select: { name: true } },
        aboutLocation: { select: { name: true } },
      },
    }),
    prisma.entityLink.findMany(),
  ]);

  const orgIds = [
    ...new Set(
      entityLinks
        .filter((l) => l.sourceType === "organization")
        .map((l) => l.sourceId)
    ),
  ];
  const eventIds = [
    ...new Set(
      entityLinks.filter((l) => l.targetType === "event").map((l) => l.targetId)
    ),
  ];
  const docIds = [
    ...new Set(
      entityLinks
        .filter((l) => l.targetType === "document")
        .map((l) => l.targetId)
    ),
  ];
  const locIds = [
    ...new Set(
      entityLinks
        .filter((l) => l.targetType === "location")
        .map((l) => l.targetId)
    ),
  ];

  const [orgsMap, eventsMap, docsMap, locsMap] = await Promise.all([
    orgIds.length
      ? prisma.organization.findMany({
          where: { id: { in: orgIds } },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
    eventIds.length
      ? prisma.event.findMany({
          where: { id: { in: eventIds } },
          select: { id: true, name: true, date: true },
        })
      : Promise.resolve([]),
    docIds.length
      ? prisma.document.findMany({
          where: { id: { in: docIds } },
          select: { id: true, title: true },
        })
      : Promise.resolve([]),
    locIds.length
      ? prisma.location.findMany({
          where: { id: { in: locIds } },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ]);

  const nameOrg = Object.fromEntries(orgsMap.map((o) => [o.id, o.name]));
  const nameEvent = Object.fromEntries(
    eventsMap.map((e) => [e.id, e.date ? `${e.date} — ${e.name}` : e.name])
  );
  const nameDoc = Object.fromEntries(docsMap.map((d) => [d.id, d.title]));
  const nameLoc = Object.fromEntries(locsMap.map((l) => [l.id, l.name]));

  const links: ArchiveLinkRow[] = [];

  for (const r of relationships) {
    links.push({
      id: `relationship|${r.id}`,
      kind: "relationship",
      kindLabel: "ПЕРСОНАЖ ↔ ПЕРСОНАЖ",
      title: `${r.characterA.name} ↔ ${r.characterB.name}`,
      subtitle: `${r.type} · доверие ${r.trustLevel}%`,
      editHref: `/admin/relationships/${r.id}`,
    });
  }

  for (const ce of characterEvents) {
    links.push({
      id: `character_event|${ce.characterId}|${ce.eventId}`,
      kind: "character_event",
      kindLabel: "ПЕРСОНАЖ → СОБЫТИЕ",
      title: `${ce.character.name} → ${ce.event.name}`,
      subtitle: ce.event.date ?? "без даты",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(`character_event|${ce.characterId}|${ce.eventId}`)}`,
    });
  }

  for (const el of eventLocations) {
    links.push({
      id: `event_location|${el.eventId}|${el.locationId}`,
      kind: "event_location",
      kindLabel: "СОБЫТИЕ → ЛОКАЦИЯ",
      title: `${el.event.name} → ${el.location.name}`,
      subtitle: el.event.date ?? "место",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(`event_location|${el.eventId}|${el.locationId}`)}`,
    });
  }

  for (const cd of characterDocuments) {
    links.push({
      id: `character_document|${cd.characterId}|${cd.documentId}`,
      kind: "character_document",
      kindLabel: "ПЕРСОНАЖ → ДОКУМЕНТ",
      title: `${cd.character.name} → ${cd.document.title}`,
      subtitle: "документ",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(`character_document|${cd.characterId}|${cd.documentId}`)}`,
    });
  }

  for (const ed of eventDocuments) {
    links.push({
      id: `event_document|${ed.eventId}|${ed.documentId}`,
      kind: "event_document",
      kindLabel: "СОБЫТИЕ → ДОКУМЕНТ",
      title: `${ed.event.name} → ${ed.document.title}`,
      subtitle: ed.event.date ?? "материал",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(`event_document|${ed.eventId}|${ed.documentId}`)}`,
    });
  }

  for (const c of charactersWithOrg) {
    if (!c.organization) continue;
    const id = `character_organization|${c.id}|${c.organization.id}`;
    links.push({
      id,
      kind: "character_organization",
      kindLabel: "ПЕРСОНАЖ → ОРГАНИЗАЦИЯ",
      title: `${c.name} → ${c.organization.name}`,
      subtitle: "членство",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(id)}`,
    });
  }

  for (const d of dialogues) {
    const title = d.title || "Без названия";
    if (d.locationId && d.location) {
      const id = `dialogue_location|${d.id}`;
      links.push({
        id,
        kind: "dialogue_location",
        kindLabel: "ЗАПИСЬ → ЛОКАЦИЯ",
        title: `${title} → ${d.location.name}`,
        subtitle: "место записи",
        editHref: `/admin/relationships/edit?id=${encodeURIComponent(id)}`,
      });
    }
    if (d.aboutCharacterId && d.aboutCharacter) {
      const id = `dialogue_about_character|${d.id}`;
      links.push({
        id,
        kind: "dialogue_about_character",
        kindLabel: "ЗАПИСЬ → ПЕРСОНАЖ",
        title: `${title} → ${d.aboutCharacter.name}`,
        subtitle: "о персонаже",
        editHref: `/admin/relationships/edit?id=${encodeURIComponent(id)}`,
      });
    }
    if (d.aboutLocationId && d.aboutLocation) {
      const id = `dialogue_about_location|${d.id}`;
      links.push({
        id,
        kind: "dialogue_about_location",
        kindLabel: "ЗАПИСЬ → О МЕСТЕ",
        title: `${title} → ${d.aboutLocation.name}`,
        subtitle: "о месте",
        editHref: `/admin/relationships/edit?id=${encodeURIComponent(id)}`,
      });
    }
  }

  for (const el of entityLinks) {
    const kind =
      el.sourceType === "organization" && el.targetType === "event"
        ? "organization_event"
        : el.sourceType === "organization" && el.targetType === "document"
          ? "organization_document"
          : el.sourceType === "organization" && el.targetType === "location"
            ? "organization_location"
            : null;
    if (!kind) continue;

    const sourceName = nameOrg[el.sourceId] ?? el.sourceId;
    const targetName =
      el.targetType === "event"
        ? (nameEvent[el.targetId] ?? el.targetId)
        : el.targetType === "document"
          ? (nameDoc[el.targetId] ?? el.targetId)
          : (nameLoc[el.targetId] ?? el.targetId);

    const kindLabel =
      kind === "organization_event"
        ? "ОРГАНИЗАЦИЯ → СОБЫТИЕ"
        : kind === "organization_document"
          ? "ОРГАНИЗАЦИЯ → ДОКУМЕНТ"
          : "ОРГАНИЗАЦИЯ → ЛОКАЦИЯ";

    const id = `${kind}|${el.id}`;
    links.push({
      id,
      kind,
      kindLabel,
      title: `${sourceName} → ${targetName}`,
      subtitle: "организация",
      editHref: `/admin/relationships/edit?id=${encodeURIComponent(id)}`,
    });
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="font-mono text-xs text-gray-600 hover:text-gray-400"
          >
            ← ПАНЕЛЬ УПРАВЛЕНИЯ
          </Link>
          <h1 className="mt-2 font-mono text-xl tracking-wider text-gray-200">
            СВЯЗИ
          </h1>
          <p className="mt-1 font-mono text-xs text-gray-600">
            Всего: {links.length} · отображаются в сети связей
          </p>
        </div>
        <Link
          href="/admin/relationships/new"
          className="rounded bg-emerald-400/10 px-4 py-2 font-mono text-xs text-emerald-400 transition-colors hover:bg-emerald-400/20"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <ArchiveLinksList links={links} />
    </div>
  );
}
