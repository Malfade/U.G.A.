"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useLoreStore } from "@/lib/store";
import { getAccentHexForFactionName, getThemeForFactionName } from "@/lib/faction-themes";

export interface FactionInfo {
  id: string;
  name: string;
}

const FactionContext = createContext<FactionInfo[]>([]);

export function FactionProvider({
  factions,
  children,
}: {
  factions: FactionInfo[];
  children: React.ReactNode;
}) {
  return (
    <FactionContext.Provider value={factions}>{children}</FactionContext.Provider>
  );
}

export function useActiveFaction() {
  const factions = useContext(FactionContext);
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);

  return useMemo(() => {
    const faction = factions.find((f) => f.id === selectedFactionId) ?? null;
    const theme = getThemeForFactionName(faction?.name ?? null);
    const accentHex = getAccentHexForFactionName(faction?.name ?? null);

    return {
      faction,
      theme,
      accentHex,
      isObserver: !faction,
      label: faction?.name ?? "Неизвестный наблюдатель",
    };
  }, [factions, selectedFactionId]);
}

export function FactionThemeEffect() {
  const { accentHex } = useActiveFaction();

  useEffect(() => {
    document.documentElement.style.setProperty("--faction-accent", accentHex);
  }, [accentHex]);

  return null;
}
