"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoreState {
  selectedFactionId: string | null;
  setFaction: (id: string | null) => void;

  discoveredDocuments: string[];
  discoverDocument: (id: string) => void;

  unlockedKeys: string[];
  unlockKey: (code: string) => void;
  hasKey: (code: string) => boolean;

  viewedEntities: string[];
  markViewed: (entityKey: string) => void;
  discoveryPercent: number;
  totalEntities: number;
  setTotalEntities: (n: number) => void;
}

export const useLoreStore = create<LoreState>()(
  persist(
    (set, get) => ({
      selectedFactionId: null,
      setFaction: (id) => set({ selectedFactionId: id }),

      discoveredDocuments: [],
      discoverDocument: (id) =>
        set((s) => ({
          discoveredDocuments: s.discoveredDocuments.includes(id)
            ? s.discoveredDocuments
            : [...s.discoveredDocuments, id],
        })),

      unlockedKeys: [],
      unlockKey: (code) =>
        set((s) => ({
          unlockedKeys: s.unlockedKeys.includes(code)
            ? s.unlockedKeys
            : [...s.unlockedKeys, code],
        })),
      hasKey: (code) => get().unlockedKeys.includes(code),

      viewedEntities: [],
      markViewed: (entityKey) =>
        set((s) => {
          const updated = s.viewedEntities.includes(entityKey)
            ? s.viewedEntities
            : [...s.viewedEntities, entityKey];
          return {
            viewedEntities: updated,
            discoveryPercent:
              s.totalEntities > 0
                ? Math.round((updated.length / s.totalEntities) * 100)
                : 0,
          };
        }),

      discoveryPercent: 0,
      totalEntities: 0,
      setTotalEntities: (n) =>
        set((s) => ({
          totalEntities: n,
          discoveryPercent:
            n > 0 ? Math.round((s.viewedEntities.length / n) * 100) : 0,
        })),
    }),
    { name: "lore-archive-state" }
  )
);
