"use client";

import { useLoreStore } from "@/lib/store";
import { useActiveFaction } from "@/components/layout/FactionProvider";

interface FactionViewData {
  id: string;
  entityType: string;
  content: string;
  faction: { id: string; name: string };
}

export function FactionViewPanel({ views }: { views: FactionViewData[] }) {
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);
  const setFaction = useLoreStore((s) => s.setFaction);
  const { accentHex } = useActiveFaction();

  const activeView = selectedFactionId
    ? views.find((v) => v.faction.id === selectedFactionId)
    : null;

  if (views.length === 0) return null;

  let parsed: Record<string, string> = {};
  if (activeView) {
    try {
      parsed = JSON.parse(activeView.content);
    } catch {
      parsed = { content: activeView.content };
    }
  }

  return (
    <div
      className="border rounded-lg p-6 mb-6 transition-colors duration-300"
      style={{ borderColor: `${accentHex}30` }}
    >
      <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
        ВЗГЛЯД ФРАКЦИИ
      </h2>
      {!activeView ? (
        <div>
          <p className="font-mono text-xs text-gray-600 mb-3">
            Выберите фракцию в боковой панели для просмотра альтернативной точки зрения.
          </p>
          <div className="flex flex-wrap gap-2">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setFaction(v.faction.id)}
                className="px-2 py-1 bg-gray-900 rounded text-[10px] font-mono text-gray-400 border border-gray-800 hover:border-gray-600 transition-colors"
              >
                {v.faction.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="font-mono text-xs mb-2" style={{ color: accentHex }}>
            Источник: {activeView.faction.name}
          </div>
          {Object.entries(parsed).map(([key, value]) => (
            <div key={key}>
              <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1 uppercase">
                {key}
              </div>
              <p className="text-sm text-gray-300">{String(value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
