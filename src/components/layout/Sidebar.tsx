"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FactionSwitcher } from "./FactionSwitcher";
import { useActiveFaction } from "./FactionProvider";
import { useLoreStore } from "@/lib/store";
import { CLEARANCE_LABELS } from "@/lib/redact";

interface Faction {
  id: string;
  name: string;
}

function ClearanceBadge() {
  const level = useLoreStore((s) => s.clearanceLevel);
  const { accentHex } = useActiveFaction();
  return (
    <div className="px-4 py-3 border-t border-gray-800">
      <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        УРОВЕНЬ ДОПУСКА
      </div>
      <div className="font-mono text-sm" style={{ color: accentHex }}>
        L{level} — {CLEARANCE_LABELS[level] ?? "НЕИЗВЕСТЕН"}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "ГЛАВНАЯ", icon: "◈" },
  { href: "/map", label: "КАРТА МИРА", icon: "◎" },
  { href: "/characters", label: "ПЕРСОНАЖИ", icon: "◉" },
  { href: "/organizations", label: "ОРГАНИЗАЦИИ", icon: "⬡" },
  { href: "/events", label: "ХРОНОЛОГИЯ", icon: "◫" },
  { href: "/documents", label: "ДОКУМЕНТЫ", icon: "▤" },
  { href: "/dialogues", label: "ДИАЛОГИ", icon: "◈" },
  { href: "/graph", label: "СЕТЬ СВЯЗЕЙ", icon: "◬" },
  { href: "/factions", label: "ТОЧКА ОБЗОРА", icon: "◇" },
];

export function Sidebar({ factions }: { factions: Faction[] }) {
  const pathname = usePathname();
  const { accentHex } = useActiveFaction();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 z-40 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="block">
          <div className="font-mono text-xs text-gray-500 tracking-widest">
            UNIFIED GLOBAL
          </div>
          <div
            className="font-mono text-lg tracking-wider font-bold transition-colors duration-300"
            style={{ color: accentHex }}
          >
            ARCHIVE
          </div>
          <div className="font-mono text-[10px] text-gray-600 mt-1">
            v7.4 // СЕТЬ ЧАСТИЧНО ВОССТАНОВЛЕНА
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-mono transition-colors ${
                active
                  ? "border-r-2"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
              }`}
              style={
                active
                  ? {
                      color: accentHex,
                      backgroundColor: `${accentHex}08`,
                      borderRightColor: accentHex,
                    }
                  : undefined
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <FactionSwitcher factions={factions} />

      <ClearanceBadge />

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors"
        >
          <span>⚙</span>
          <span>ПАНЕЛЬ УПРАВЛЕНИЯ</span>
        </Link>
      </div>
    </aside>
  );
}
