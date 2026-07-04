"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LoadingScreen } from "./LoadingScreen";
import { FactionProvider, FactionThemeEffect } from "./FactionProvider";

interface Faction {
  id: string;
  name: string;
}

const STORAGE_KEY = "uga_intro_seen";

export function Shell({
  children,
  factions,
}: {
  children: React.ReactNode;
  factions: Faction[];
}) {
  const [loading, setLoading] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem(STORAGE_KEY);
      setLoading(!seen);
    } catch {
      setLoading(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setLoading(false);
  }, []);

  if (loading === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <FactionProvider factions={factions}>
      <FactionThemeEffect />
      {loading && <LoadingScreen onComplete={handleComplete} />}
      <div className="flex h-screen overflow-hidden">
        <Sidebar factions={factions} />
        <div className="flex-1 ml-64 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </FactionProvider>
  );
}
