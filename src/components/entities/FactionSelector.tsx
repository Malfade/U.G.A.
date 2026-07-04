"use client";

import { useLoreStore } from "@/lib/store";

interface FactionInfo {
  id: string;
  name: string;
  description: string | null;
  foundedDate: string | null;
  characterCount: number;
}

const FACTION_COLORS: Record<string, string> = {
  "Совет": "border-blue-800 hover:border-blue-600",
  "Красная Рука": "border-red-800 hover:border-red-600",
  "Повстанцы": "border-amber-800 hover:border-amber-600",
  "Мирные жители": "border-teal-800 hover:border-teal-600",
  "Заражённые": "border-purple-800 hover:border-purple-600",
};

const FACTION_ACTIVE_COLORS: Record<string, string> = {
  "Совет": "border-blue-500 bg-blue-500/5",
  "Красная Рука": "border-red-500 bg-red-500/5",
  "Повстанцы": "border-amber-500 bg-amber-500/5",
  "Мирные жители": "border-teal-500 bg-teal-500/5",
  "Заражённые": "border-purple-500 bg-purple-500/5",
};

export function FactionSelector({ factions }: { factions: FactionInfo[] }) {
  const { selectedFactionId, setFaction } = useLoreStore();

  return (
    <div className="space-y-4">
      <button
        onClick={() => setFaction(null)}
        className={`w-full text-left border rounded-lg p-4 transition-all ${
          selectedFactionId === null
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-gray-800 hover:border-gray-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-sm text-gray-200 mb-1">
              ◇ Неизвестный наблюдатель
            </h2>
            <p className="text-xs text-gray-500">
              Нейтральная точка зрения. Минимум информации, максимум загадок.
            </p>
          </div>
          {selectedFactionId === null && (
            <span className="font-mono text-xs text-emerald-400">АКТИВНО</span>
          )}
        </div>
      </button>

      {factions.map((f) => {
        const isActive = selectedFactionId === f.id;
        const borderClass = isActive
          ? FACTION_ACTIVE_COLORS[f.name] ?? "border-emerald-500 bg-emerald-500/5"
          : FACTION_COLORS[f.name] ?? "border-gray-800 hover:border-gray-600";

        return (
          <button
            key={f.id}
            onClick={() => setFaction(f.id)}
            className={`w-full text-left border rounded-lg p-4 transition-all ${borderClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-sm text-gray-200 mb-1">
                  {f.name}
                </h2>
                <p className="text-xs text-gray-500">
                  {f.description ?? "████████████"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  {f.foundedDate && (
                    <span className="font-mono text-[10px] text-gray-600">
                      Основана: {f.foundedDate}
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-gray-600">
                    Агентов: {f.characterCount}
                  </span>
                </div>
              </div>
              {isActive && (
                <span className="font-mono text-xs text-emerald-400">
                  АКТИВНО
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
