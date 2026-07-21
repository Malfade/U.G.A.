import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArchiveLinkForm } from "@/components/admin/ArchiveLinkForm";

export default async function NewArchiveLinkPage() {
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
          НОВАЯ СВЯЗЬ
        </h1>
        <p className="mt-1 font-mono text-xs text-gray-600">
          Выберите тип, затем две сущности. Связь сразу попадёт в сеть.
        </p>
      </div>
      <ArchiveLinkForm
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
        defaultKind="event_location"
      />
    </div>
  );
}
