"use client";

import { FactionAwareContent } from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";

interface OrganizationProfileProps {
  org: {
    name: string;
    foundedDate: string | null;
    description: string | null;
    hierarchy: string | null;
    goals: string | null;
  };
  factionViews: FactionViewData[];
}

export function OrganizationProfileCard({ org, factionViews }: OrganizationProfileProps) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-6">
      <h1 className="font-mono text-2xl text-gray-100 mb-4">{org.name}</h1>

      <FactionAwareContent
        factionViews={factionViews}
        fields={[
          { key: "foundedDate", label: "ДАТА ОСНОВАНИЯ", value: org.foundedDate },
          { key: "description", label: "ОПИСАНИЕ", value: org.description, multiline: true },
          { key: "hierarchy", label: "ИЕРАРХИЯ", value: org.hierarchy, multiline: true },
          { key: "goals", label: "ЦЕЛИ", value: org.goals, multiline: true },
        ]}
      />
    </div>
  );
}
