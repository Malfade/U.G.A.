"use client";

import { AccessLevel } from "@/components/ui/AccessLevel";
import { FactionAwareContent } from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";

interface EventProfileProps {
  event: {
    name: string;
    date: string | null;
    description: string | null;
    cause: string | null;
    consequences: string | null;
    accessLevel: number;
  };
  factionViews: FactionViewData[];
}

export function EventProfileCard({ event, factionViews }: EventProfileProps) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-2xl text-gray-400 mb-1">
            {event.date ?? "██████"}
          </div>
          <h1 className="font-mono text-xl text-gray-100">{event.name}</h1>
        </div>
        <AccessLevel level={event.accessLevel} />
      </div>

      <FactionAwareContent
        factionViews={factionViews}
        fields={[
          { key: "description", label: "ОПИСАНИЕ", value: event.description, multiline: true },
          { key: "cause", label: "ПРИЧИНА", value: event.cause },
          { key: "consequences", label: "ПОСЛЕДСТВИЯ", value: event.consequences },
        ]}
      />
    </div>
  );
}
