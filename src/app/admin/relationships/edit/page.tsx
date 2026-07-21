import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveLinkEditForm } from "@/components/admin/ArchiveLinkEditForm";

export default async function EditArchiveLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: linkId } = await searchParams;
  if (!linkId) notFound();

  const [kind, a, b] = linkId.split("|");
  if (!kind || !a) notFound();

  let sourceId = a;
  let targetId = b ?? "";
  let relationType: string | undefined;
  let trustLevel: number | undefined;
  let description: string | undefined;

  switch (kind) {
    case "relationship": {
      const r = await prisma.relationship.findUnique({ where: { id: a } });
      if (!r) notFound();
      sourceId = r.characterAId;
      targetId = r.characterBId;
      relationType = r.type;
      trustLevel = r.trustLevel;
      description = r.description ?? undefined;
      break;
    }
    case "character_event":
    case "event_location":
    case "character_document":
    case "event_document":
    case "character_organization":
      if (!b) notFound();
      break;
    case "dialogue_location": {
      const d = await prisma.dialogue.findUnique({ where: { id: a } });
      if (!d?.locationId) notFound();
      targetId = d.locationId;
      break;
    }
    case "dialogue_about_character": {
      const d = await prisma.dialogue.findUnique({ where: { id: a } });
      if (!d?.aboutCharacterId) notFound();
      targetId = d.aboutCharacterId;
      break;
    }
    case "dialogue_about_location": {
      const d = await prisma.dialogue.findUnique({ where: { id: a } });
      if (!d?.aboutLocationId) notFound();
      targetId = d.aboutLocationId;
      break;
    }
    case "organization_event":
    case "organization_document":
    case "organization_location": {
      const link = await prisma.entityLink.findUnique({ where: { id: a } });
      if (!link) notFound();
      sourceId = link.sourceId;
      targetId = link.targetId;
      break;
    }
    default:
      notFound();
  }

  const [characters, events, locations, documents, organizations, dialogues] =
    await Promise.all([
      prisma.character.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.event.findMany({
        select: { id: true, name: true, date: true },
        orderBy: { date: "asc" },
      }),
      prisma.location.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.document.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
      prisma.organization.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.dialogue.findMany({
        select: { id: true, title: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-6">
        <Link
          href="/admin/relationships"
          className="font-mono text-xs text-gray-600 hover:text-gray-400"
        >
          ← СВЯЗИ
        </Link>
        <h1 className="mt-2 font-mono text-xl tracking-wider text-gray-200">
          РЕДАКТИРОВАТЬ СВЯЗЬ
        </h1>
      </div>
      <ArchiveLinkEditForm
        linkId={linkId}
        kind={kind}
        sourceId={sourceId}
        targetId={targetId}
        relationType={relationType}
        trustLevel={trustLevel}
        description={description}
        characters={characters}
        events={events.map((e) => ({
          id: e.id,
          name: e.date ? `${e.date} — ${e.name}` : e.name,
        }))}
        locations={locations}
        documents={documents.map((d) => ({ id: d.id, name: d.title }))}
        organizations={organizations}
        dialogues={dialogues.map((d) => ({
          id: d.id,
          name: d.title || "Без названия",
        }))}
      />
    </div>
  );
}
