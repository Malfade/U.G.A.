import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EventProfileCard } from "@/components/entities/EventProfileCard";

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
      characterEvents: { include: { character: { select: { id: true, name: true, status: true } } } },
      eventDocuments: { include: { document: { select: { id: true, title: true, type: true } } } },
      factionViews: { include: { faction: true } },
    },
  });

  if (!event) notFound();

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
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">ЛОКАЦИИ</h2>
          <div className="space-y-2">
            {event.eventLocations.map(({ location }) => (
              <Link
                key={location.id}
                href={`/map/${location.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 font-mono text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <span>📍 {location.name}</span>
                <span className="text-xs text-gray-600 uppercase">{location.type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {event.characterEvents.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">УЧАСТНИКИ</h2>
          <div className="flex gap-2 flex-wrap">
            {event.characterEvents.map(({ character }) => (
              <Link
                key={character.id}
                href={`/characters/${character.id}`}
                className="px-3 py-1.5 bg-gray-900 rounded text-sm font-mono text-emerald-400 hover:bg-gray-800 transition-colors"
              >
                {character.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {event.eventDocuments.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">ДОКУМЕНТЫ</h2>
          <div className="space-y-2">
            {event.eventDocuments.map(({ document: doc }) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 font-mono text-sm text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <span>{doc.title}</span>
                <span className="text-xs text-gray-600 uppercase">{doc.type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
