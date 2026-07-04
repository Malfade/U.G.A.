"use client";

import Link from "next/link";
import { FactionAwareContent } from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";

interface RelationshipProfileProps {
  rel: {
    type: string;
    trustLevel: number;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
    characterA: { id: string; name: string };
    characterB: { id: string; name: string };
    history: { id: string; year: string; status: string; description: string | null }[];
  };
  factionViews: FactionViewData[];
}

export function RelationshipProfileCard({ rel, factionViews }: RelationshipProfileProps) {
  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link
            href={`/characters/${rel.characterA.id}`}
            className="font-mono text-lg text-emerald-400 hover:text-emerald-300"
          >
            {rel.characterA.name}
          </Link>
          <span className="font-mono text-gray-600">↔</span>
          <Link
            href={`/characters/${rel.characterB.id}`}
            className="font-mono text-lg text-emerald-400 hover:text-emerald-300"
          >
            {rel.characterB.name}
          </Link>
        </div>
        <div className="font-mono text-sm text-gray-400">{rel.type}</div>
      </div>

      <FactionAwareContent
        factionViews={factionViews}
        fields={[
          { key: "trustLevel", label: "ДОВЕРИЕ", value: `${rel.trustLevel}%` },
          { key: "startDate", label: "НАЧАЛО", value: rel.startDate },
          { key: "endDate", label: "КОНЕЦ", value: rel.endDate ?? "—" },
          { key: "description", label: "ОПИСАНИЕ", value: rel.description, multiline: true },
        ]}
      >
        {rel.history.length > 0 && (
          <div className="border-t border-gray-800 pt-4">
            <h3 className="font-mono text-[10px] text-gray-600 tracking-widest mb-4">
              ХРОНОЛОГИЯ ОТНОШЕНИЙ
            </h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-800" />
              <div className="space-y-4">
                {rel.history.map((h) => (
                  <div key={h.id} className="relative pl-10">
                    <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-gray-700 bg-gray-950" />
                    <div>
                      <span className="font-mono text-sm text-gray-400">{h.year}</span>
                      <span className="font-mono text-xs text-gray-600 ml-2">— {h.status}</span>
                      {h.description && (
                        <p className="text-xs text-gray-500 mt-1">{h.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </FactionAwareContent>
    </div>
  );
}
