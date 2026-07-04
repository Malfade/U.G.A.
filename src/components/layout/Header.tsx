"use client";

import { useLoreStore } from "@/lib/store";
import { useActiveFaction } from "./FactionProvider";

export function Header() {
  const { discoveryPercent } = useLoreStore();
  const { label, accentHex, isObserver } = useActiveFaction();

  return (
    <header className="h-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 flex items-center justify-between px-6 font-mono text-xs">
      <div className="flex items-center gap-4">
        <span className="text-gray-600">СТАТУС СЕТИ:</span>
        <span className="text-yellow-400 animate-pulse">
          ЧАСТИЧНО ВОССТАНОВЛЕНА
        </span>
        <span className="text-gray-800">|</span>
        <span className="text-gray-600">ТОЧКА ОБЗОРА:</span>
        <span
          className="flex items-center gap-1.5 transition-colors duration-300"
          style={{ color: accentHex }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: accentHex }}
          />
          {label.toUpperCase()}
          {!isObserver && (
            <span className="text-[9px] opacity-60 ml-1">(АКТИВНО)</span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-gray-600">
          ДОСТУПНО ДОКУМЕНТОВ:{" "}
          <span style={{ color: accentHex }}>{discoveryPercent}%</span>
        </div>
        <div className="text-gray-600">
          ЗАСЕКРЕЧЕНО:{" "}
          <span className="text-red-400">{100 - discoveryPercent}%</span>
        </div>
      </div>
    </header>
  );
}
