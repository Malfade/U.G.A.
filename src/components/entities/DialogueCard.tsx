"use client";

import Link from "next/link";
import { useLoreStore } from "@/lib/store";
import { DecryptUnlockCard, UnlockData } from "./DecryptUnlockCard";
import { CLEARANCE_LABELS } from "@/lib/redact";

export interface DialogueLineView {
  id: string;
  text: string;
  sortOrder: number;
  speakerLabel: string | null;
  speaker: { id: string; name: string } | null;
}

export interface DialogueViewData {
  id: string;
  title: string | null;
  kind: string;
  summary: string | null;
  accessLevel: number;
  location: { id: string; name: string } | null;
  aboutCharacter: { id: string; name: string } | null;
  aboutLocation: { id: string; name: string } | null;
  faction: { id: string; name: string } | null;
  lines: DialogueLineView[];
  unlocks: UnlockData[];
}

const KIND_LABELS: Record<string, string> = {
  dialogue: "ДИАЛОГ",
  monologue: "МОНОЛОГ",
  excerpt: "ВЫРЕЗКА",
  call: "ЗАПИСЬ ЗВОНКА",
  dispatch: "ДИСПЕТЧЕРСКАЯ",
  log: "ЖУРНАЛ",
};

const CALL_KINDS = new Set(["call", "dispatch", "log"]);

export function DialogueCard({ dialogue }: { dialogue: DialogueViewData }) {
  const clearance = useLoreStore((s) => s.clearanceLevel);
  const locked = clearance < dialogue.accessLevel;
  const isCall = CALL_KINDS.has(dialogue.kind);

  return (
    <div
      className={`mb-4 rounded-lg border p-5 ${
        isCall
          ? "border-amber-900/40 bg-amber-950/10"
          : "border-gray-800"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div
            className={`mb-1 font-mono text-[10px] tracking-widest ${
              isCall ? "text-amber-500/80" : "text-gray-600"
            }`}
          >
            {KIND_LABELS[dialogue.kind] ?? dialogue.kind.toUpperCase()}
            {dialogue.accessLevel > 0 && ` · L${dialogue.accessLevel}`}
          </div>
          <h3 className="font-mono text-sm text-gray-200">
            {dialogue.title || "Без названия"}
          </h3>
        </div>
        <Link
          href={`/dialogues/${dialogue.id}`}
          className="shrink-0 font-mono text-[10px] text-gray-600 hover:text-emerald-400"
        >
          ОТКРЫТЬ →
        </Link>
      </div>

      {dialogue.summary && !locked && (
        <p className="mb-3 text-xs text-gray-500">{dialogue.summary}</p>
      )}

      <div className="mb-3 flex flex-wrap gap-3 font-mono text-[10px] text-gray-600">
        {dialogue.location && (
          <Link href={`/map/${dialogue.location.id}`} className="hover:text-emerald-400">
            📍 {dialogue.location.name}
          </Link>
        )}
        {dialogue.aboutCharacter && (
          <Link
            href={`/characters/${dialogue.aboutCharacter.id}`}
            className="hover:text-emerald-400"
          >
            ◉ {dialogue.aboutCharacter.name}
          </Link>
        )}
        {dialogue.faction && <span>◆ {dialogue.faction.name}</span>}
      </div>

      {locked ? (
        <div className="rounded border border-red-900/40 bg-red-950/20 p-3">
          <p className="font-mono text-xs text-red-400">
            ДОСТУП ОТКАЗАН —{" "}
            {CLEARANCE_LABELS[dialogue.accessLevel] ?? `L${dialogue.accessLevel}`}
          </p>
        </div>
      ) : isCall ? (
        <div className="space-y-0 border border-gray-800/80 bg-black/40 font-mono text-xs">
          {dialogue.lines
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((line) => {
              const speaker = line.speaker?.name ?? line.speakerLabel ?? "???";
              return (
                <div
                  key={line.id}
                  className="grid grid-cols-[minmax(7rem,10rem)_1fr] gap-3 border-b border-gray-900 px-3 py-2 last:border-b-0"
                >
                  <span className="text-amber-400/90">{speaker}</span>
                  <span className="text-gray-300 leading-relaxed">{line.text}</span>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="space-y-2">
          {dialogue.lines
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((line) => (
              <div key={line.id} className="text-sm">
                <span className="font-mono text-xs text-emerald-400/80">
                  {line.speaker?.name ?? line.speakerLabel ?? "???"}
                  {": "}
                </span>
                <span className="text-gray-300">{line.text}</span>
              </div>
            ))}
        </div>
      )}

      {!locked &&
        dialogue.unlocks.map((u) => <DecryptUnlockCard key={u.id} unlock={u} />)}
    </div>
  );
}

export function DialoguesList({
  dialogues,
  title = "ДИАЛОГИ / ЗАПИСИ",
}: {
  dialogues: DialogueViewData[];
  title?: string;
}) {
  if (dialogues.length === 0) return null;
  return (
    <div className="mb-6 rounded-lg border border-gray-800 p-6">
      <h2 className="mb-4 font-mono text-xs tracking-widest text-gray-500">
        {title} ({dialogues.length})
      </h2>
      {dialogues.map((d) => (
        <DialogueCard key={d.id} dialogue={d} />
      ))}
    </div>
  );
}
