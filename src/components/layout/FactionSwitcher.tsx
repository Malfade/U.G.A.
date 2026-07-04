"use client";

import { useLoreStore } from "@/lib/store";
import { useActiveFaction } from "./FactionProvider";

interface Faction {
  id: string;
  name: string;
}

const FACTION_ICONS: Record<string, string> = {
  "Совет": "🔵",
  "Красная Рука": "🔴",
  "Повстанцы": "🟡",
  "Мирные жители": "🟢",
  "Заражённые": "🟣",
};

export function FactionSwitcher({ factions }: { factions: Faction[] }) {
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);
  const setFaction = useLoreStore((s) => s.setFaction);
  const { accentHex } = useActiveFaction();

  const activeStyle = {
    color: accentHex,
    backgroundColor: `${accentHex}15`,
    borderColor: `${accentHex}40`,
  };

  return (
    <div className="p-4 border-t border-gray-800">
      <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">
        ТОЧКА ОБЗОРА
      </div>
      <div className="space-y-1">
        <button
          onClick={() => setFaction(null)}
          className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-all border border-transparent ${
            selectedFactionId === null
              ? ""
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-900"
          }`}
          style={selectedFactionId === null ? activeStyle : undefined}
        >
          ◇ Неизвестный наблюдатель
        </button>
        {factions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFaction(f.id)}
            className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-all border border-transparent ${
              selectedFactionId === f.id
                ? ""
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-900"
            }`}
            style={selectedFactionId === f.id ? activeStyle : undefined}
          >
            {FACTION_ICONS[f.name] ?? "◆"} {f.name}
          </button>
        ))}
      </div>
    </div>
  );
}
