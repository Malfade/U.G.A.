"use client";

import { AccessLevel } from "@/components/ui/AccessLevel";
import { CLEARANCE_LABELS } from "@/lib/redact";
import { useLoreStore } from "@/lib/store";
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
  const clearance = useLoreStore((s) => s.clearanceLevel);
  const locked = clearance < event.accessLevel;

  return (
    <div className="mb-6 rounded-lg border border-gray-800 p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 font-mono text-2xl text-gray-400">
            {event.date || "—"}
          </div>
          <h1 className="font-mono text-xl text-gray-100">{event.name}</h1>
        </div>
        <AccessLevel level={event.accessLevel} />
      </div>

      {locked ? (
        <div className="rounded border border-red-900/40 bg-red-950/20 p-4">
          <p className="font-mono text-sm text-red-400">
            ДОСТУП ОТКАЗАН — требуется{" "}
            {CLEARANCE_LABELS[event.accessLevel] ?? `L${event.accessLevel}`}
          </p>
          <p className="mt-2 font-mono text-[10px] text-gray-600">
            Ищите зашифрованные фрагменты в звонках и документах по региону.
          </p>
        </div>
      ) : (
        <FactionAwareContent
          factionViews={factionViews}
          fields={[
            {
              key: "description",
              label: "ОПИСАНИЕ",
              value: event.description,
              multiline: true,
            },
            { key: "cause", label: "ПРИЧИНА", value: event.cause },
            {
              key: "consequences",
              label: "ПОСЛЕДСТВИЯ",
              value: event.consequences,
            },
          ]}
        />
      )}
    </div>
  );
}
