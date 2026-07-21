"use client";

import { AccessLevel } from "@/components/ui/AccessLevel";
import { EntityFieldsView, EntityFieldData } from "./EntityFieldsView";
import { FactionAwareContent } from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";
import { useLoreStore } from "@/lib/store";
import { CLEARANCE_LABELS } from "@/lib/redact";

const TYPE_LABELS: Record<string, string> = {
  city: "ГОРОД",
  base: "БАЗА",
  anomalyZone: "АНОМАЛЬНАЯ ЗОНА",
  contaminationZone: "ЗОНА ЗАРАЖЕНИЯ",
};

interface LocationProfileProps {
  location: {
    name: string;
    type: string;
    population: string | null;
    coordX: number | null;
    coordY: number | null;
    description: string | null;
    accessLevel: number;
  };
  factionViews: FactionViewData[];
  fields: EntityFieldData[];
}

export function LocationProfileCard({
  location,
  factionViews,
  fields,
}: LocationProfileProps) {
  const clearance = useLoreStore((s) => s.clearanceLevel);
  const locked = clearance < location.accessLevel;
  const coords =
    location.coordX != null && location.coordY != null
      ? `${location.coordX.toFixed(2)}, ${location.coordY.toFixed(2)}`
      : null;

  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-xs text-gray-500 uppercase mb-1">
            {TYPE_LABELS[location.type] ?? location.type}
          </div>
          <h1 className="font-mono text-2xl text-gray-100">{location.name}</h1>
        </div>
        <AccessLevel level={location.accessLevel} />
      </div>

      {locked ? (
        <div className="border border-red-900/40 bg-red-950/20 rounded p-4 text-center">
          <p className="font-mono text-xs text-red-400">
            ДОСТУП ОТКАЗАН —{" "}
            {CLEARANCE_LABELS[location.accessLevel] ?? `L${location.accessLevel}`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {location.population && (
              <div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1">
                  НАСЕЛЕНИЕ
                </div>
                <div className="text-sm text-gray-200">{location.population}</div>
              </div>
            )}
            {coords && (
              <div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1">
                  КООРДИНАТЫ
                </div>
                <div className="text-sm text-gray-200 font-mono">{coords}</div>
              </div>
            )}
          </div>

          <FactionAwareContent
            factionViews={factionViews}
            fields={[
              {
                key: "description",
                label: "ОПИСАНИЕ",
                value: location.description,
                multiline: true,
              },
            ]}
          />

          <div className="mt-4">
            <EntityFieldsView fields={fields} />
          </div>
        </>
      )}
    </div>
  );
}
