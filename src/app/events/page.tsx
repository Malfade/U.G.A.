import { prisma } from "@/lib/db";
import { EventsTimeline } from "@/components/entities/EventsTimeline";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      eventLocations: { include: { location: { select: { name: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-mono text-xl tracking-wider text-gray-200">
          ◫ ХРОНОЛОГИЯ
        </h1>
        <p className="mt-1 font-mono text-xs text-gray-600">
          Зарегистрировано событий: {events.length}
        </p>
      </div>

      <EventsTimeline
        events={events.map((event) => ({
          id: event.id,
          name: event.name,
          date: event.date,
          description: event.description,
          accessLevel: event.accessLevel,
          locations: event.eventLocations.map(({ location }) => location.name),
        }))}
      />
    </div>
  );
}
