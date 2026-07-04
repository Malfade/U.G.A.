import { prisma } from "@/lib/db";
import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      eventLocations: { include: { location: { select: { name: true } } } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ◫ ХРОНОЛОГИЯ
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Зарегистрировано событий: {events.length}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
        <div className="space-y-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block relative pl-10 group"
            >
              <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2 border-gray-700 bg-gray-950 group-hover:border-emerald-400 transition-colors" />
              <div className="border border-gray-800 rounded-lg p-4 group-hover:border-gray-600 group-hover:bg-gray-900/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-lg text-gray-400">
                    {event.date ?? "██████"}
                  </span>
                  <AccessLevel level={event.accessLevel} />
                </div>
                <h2 className="font-mono text-sm text-gray-200 group-hover:text-emerald-400 transition-colors mb-1">
                  {event.name}
                </h2>
                {event.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                )}
                {event.eventLocations.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {event.eventLocations.map(({ location }) => (
                      <span
                        key={location.name}
                        className="px-2 py-0.5 bg-gray-900 rounded text-[10px] font-mono text-gray-500"
                      >
                        📍 {location.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
