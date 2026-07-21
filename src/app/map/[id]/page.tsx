import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LocationProfileCard } from "@/components/entities/LocationProfileCard";
import { DialoguesList } from "@/components/entities/DialogueCard";

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [location, fields, dialogues] = await Promise.all([
    prisma.location.findUnique({
      where: { id },
      include: {
        events: { include: { event: true } },
        factionViews: { include: { faction: true } },
      },
    }),
    prisma.entityField.findMany({
      where: { entityType: "location", entityId: id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.dialogue.findMany({
      where: {
        OR: [{ locationId: id }, { aboutLocationId: id }],
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
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!location) notFound();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/map"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← КАРТА МИРА
        </Link>
      </div>

      <LocationProfileCard
        location={location}
        factionViews={location.factionViews}
        fields={fields}
      />

      <DialoguesList dialogues={dialogues} />

      {location.events.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            СОБЫТИЯ В ЛОКАЦИИ
          </h2>
          <div className="space-y-2">
            {location.events.map(({ event }) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 font-mono text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <span>{event.name}</span>
                {event.date && (
                  <span className="text-xs text-gray-600">{event.date}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
