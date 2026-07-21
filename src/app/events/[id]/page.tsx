import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EventProfileCard } from "@/components/entities/EventProfileCard";
import { DialoguesList } from "@/components/entities/DialogueCard";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      eventLocations: { include: { location: true } },
      characterEvents: {
        include: {
          character: {
            select: { id: true, name: true, status: true, isSecondary: true },
          },
        },
      },
      eventDocuments: {
        include: { document: { select: { id: true, title: true, type: true } } },
      },
      factionViews: { include: { faction: true } },
    },
  });

  if (!event) notFound();

  const locationIds = event.eventLocations.map((el) => el.locationId);
  const dialogues =
    locationIds.length > 0
      ? await prisma.dialogue.findMany({
          where: {
            OR: [
              { locationId: { in: locationIds } },
              { aboutLocationId: { in: locationIds } },
            ],
          },
          include: {
            location: { select: { id: true, name: true } },
            aboutCharacter: { select: { id: true, name: true } },
            aboutLocation: { select: { id: true, name: true } },
            faction: { select: { id: true, name: true } },
            lines: {
              orderBy: { sortOrder: "asc" },
              include: { speaker: { select: { id: true, name: true } } },
            },
            unlocks: true,
          },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const primaryParticipants = event.characterEvents.filter(
    (ce) => !ce.character.isSecondary
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/events"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← ХРОНОЛОГИЯ
        </Link>
      </div>

      <EventProfileCard event={event} factionViews={event.factionViews} />

      {event.eventLocations.length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-800 p-6">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-gray-500">
            ЛОКАЦИИ
          </h2>
          <div className="space-y-2">
            {event.eventLocations.map(({ location }) => (
              <Link
                key={location.id}
                href={`/map/${location.id}`}
                className="flex items-center justify-between rounded px-3 py-2 font-mono text-sm text-gray-300 transition-colors hover:bg-gray-900 hover:text-emerald-400"
              >
                <span>📍 {location.name}</span>
                <span className="text-xs uppercase text-gray-600">
                  {location.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {primaryParticipants.length > 0 && (
        <div className="mb-6 rounded-lg border border-gray-800 p-6">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-gray-500">
            УЧАСТНИКИ
          </h2>
          <div className="flex flex-wrap gap-2">
            {primaryParticipants.map(({ character }) => (
              <Link
                key={character.id}
                href={`/characters/${character.id}`}
                className="rounded bg-gray-900 px-3 py-1.5 font-mono text-sm text-emerald-400 transition-colors hover:bg-gray-800"
              >
                {character.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <DialoguesList
        dialogues={dialogues}
        title="ЗАПИСИ / ЗВОНКИ ПО РЕГИОНУ"
      />

      {event.eventDocuments.length > 0 && (
        <div className="rounded-lg border border-gray-800 p-6">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-gray-500">
            ДОКУМЕНТЫ
          </h2>
          <div className="space-y-2">
            {event.eventDocuments.map(({ document: doc }) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between rounded px-3 py-2 font-mono text-sm text-gray-300 transition-colors hover:bg-gray-900 hover:text-emerald-400"
              >
                <span>{doc.title}</span>
                <span className="text-xs uppercase text-gray-600">{doc.type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
