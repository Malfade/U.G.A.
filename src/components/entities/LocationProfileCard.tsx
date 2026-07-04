"use client";

import { AccessLevel } from "@/components/ui/AccessLevel";
import { FactionAwareContent } from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";

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
}

export function LocationProfileCard({ location, factionViews }: LocationProfileProps) {
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

      <FactionAwareContent
        factionViews={factionViews}
        fields={[
          { key: "population", label: "НАСЕЛЕНИЕ", value: location.population },
          { key: "coordinates", label: "КООРДИНАТЫ", value: coords },
          { key: "description", label: "ОПИСАНИЕ", value: location.description, multiline: true },
        ]}
      />
    </div>
  );
}
