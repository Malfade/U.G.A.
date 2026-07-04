"use client";

import { useLoreStore } from "@/lib/store";
import { useActiveFaction } from "@/components/layout/FactionProvider";
import {
  FactionViewData,
  parseFactionViewContent,
  resolveFactionField,
} from "@/lib/faction-content";
import { DamagedDocument } from "./DamagedDocument";
import { ARGLockGate } from "./ARGLockGate";
import { FactionViewBanner } from "./FactionAwareContent";

interface Props {
  content: string;
  damagePercent: number;
  isLocked: boolean;
  locks: { id: string; keyRequired: string; hint: string | null }[];
  factionViews: FactionViewData[];
}

export function FactionAwareDocument({
  content,
  damagePercent,
  isLocked,
  locks,
  factionViews,
}: Props) {
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);
  const { isObserver } = useActiveFaction();

  const activeView = selectedFactionId
    ? factionViews.find((v) => v.faction.id === selectedFactionId)
    : null;
  const parsed = activeView ? parseFactionViewContent(activeView.content) : null;
  const displayContent =
    resolveFactionField("content", content, parsed, isObserver) ?? content;

  if (!isObserver && !activeView) {
    return (
      <>
        <FactionViewBanner />
        <div className="border border-gray-800 rounded p-4 text-center">
          <p className="font-mono text-xs text-gray-600">
            Документ недоступен для выбранной фракции.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <FactionViewBanner />
      {isLocked ? (
        <ARGLockGate
          locks={locks}
          content={displayContent ?? ""}
          damagePercent={damagePercent}
        />
      ) : (
        <DamagedDocument
          content={displayContent ?? "████████████"}
          damagePercent={damagePercent}
        />
      )}
    </>
  );
}
