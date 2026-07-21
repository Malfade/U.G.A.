"use client";

import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";
import { useLoreStore } from "@/lib/store";

interface EventListItem {
  id: string;
  name: string;
  date: string | null;
  description: string | null;
  accessLevel: number;
  locations: string[];
}

export function EventsTimeline({ events }: { events: EventListItem[] }) {
  const clearance = useLoreStore((s) => s.clearanceLevel);

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-gray-800" />
      <div className="space-y-6">
        {events.map((event) => {
          const locked = clearance < event.accessLevel;
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group relative block pl-10"
            >
              <div className="absolute left-2.5 top-2 h-3 w-3 rounded-full border-2 border-gray-700 bg-gray-950 transition-colors group-hover:border-emerald-400" />
              <div className="rounded-lg border border-gray-800 p-4 transition-all group-hover:border-gray-600 group-hover:bg-gray-900/50">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-lg text-gray-400">
                    {event.date ?? "██████"}
                  </span>
                  <AccessLevel level={event.accessLevel} />
                </div>
                <h2 className="mb-1 font-mono text-sm text-gray-200 transition-colors group-hover:text-emerald-400">
                  {event.name}
                </h2>
                {locked ? (
                  <p className="font-mono text-xs text-red-400/70">
                    Фрагмент засекречен — повысьте допуск
                  </p>
                ) : (
                  event.description && (
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {event.description}
                    </p>
                  )
                )}
                {!locked && event.locations.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {event.locations.map((name) => (
                      <span
                        key={name}
                        className="rounded bg-gray-900 px-2 py-0.5 font-mono text-[10px] text-gray-500"
                      >
                        📍 {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
