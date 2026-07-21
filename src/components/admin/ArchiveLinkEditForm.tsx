"use client";

import { useMemo, useState } from "react";
import { updateArchiveLink } from "@/app/admin/actions";

type Opt = { id: string; name: string };

const KIND_META: Record<
  string,
  { label: string; source: string; target: string }
> = {
  relationship: {
    label: "Персонаж ↔ персонаж",
    source: "character",
    target: "character",
  },
  character_event: {
    label: "Персонаж → событие",
    source: "character",
    target: "event",
  },
  event_location: {
    label: "Событие → локация",
    source: "event",
    target: "location",
  },
  character_document: {
    label: "Персонаж → документ",
    source: "character",
    target: "document",
  },
  event_document: {
    label: "Событие → документ",
    source: "event",
    target: "document",
  },
  character_organization: {
    label: "Персонаж → организация",
    source: "character",
    target: "organization",
  },
  organization_event: {
    label: "Организация → событие",
    source: "organization",
    target: "event",
  },
  organization_document: {
    label: "Организация → документ",
    source: "organization",
    target: "document",
  },
  organization_location: {
    label: "Организация → локация",
    source: "organization",
    target: "location",
  },
  dialogue_location: {
    label: "Запись → локация",
    source: "dialogue",
    target: "location",
  },
  dialogue_about_character: {
    label: "Запись → персонаж",
    source: "dialogue",
    target: "character",
  },
  dialogue_about_location: {
    label: "Запись → о месте",
    source: "dialogue",
    target: "location",
  },
};

interface Props {
  linkId: string;
  kind: string;
  sourceId: string;
  targetId: string;
  relationType?: string;
  trustLevel?: number;
  description?: string;
  characters: Opt[];
  events: Opt[];
  locations: Opt[];
  documents: Opt[];
  organizations: Opt[];
  dialogues: Opt[];
}

export function ArchiveLinkEditForm({
  linkId,
  kind,
  sourceId: initialSource,
  targetId: initialTarget,
  relationType,
  trustLevel,
  description,
  characters,
  events,
  locations,
  documents,
  organizations,
  dialogues,
}: Props) {
  const meta = KIND_META[kind];
  const [sourceId, setSourceId] = useState(initialSource);
  const [targetId, setTargetId] = useState(initialTarget);

  const sourceOptions = useMemo(() => {
    switch (meta?.source) {
      case "character":
        return characters;
      case "event":
        return events;
      case "dialogue":
        return dialogues;
      case "organization":
        return organizations;
      default:
        return [];
    }
  }, [meta, characters, events, dialogues, organizations]);

  const targetOptions = useMemo(() => {
    switch (meta?.target) {
      case "character":
        return characters;
      case "event":
        return events;
      case "location":
        return locations;
      case "document":
        return documents;
      case "organization":
        return organizations;
      default:
        return [];
    }
  }, [meta, characters, events, locations, documents, organizations]);

  if (!meta) {
    return (
      <p className="font-mono text-sm text-red-400">Неизвестный тип связи</p>
    );
  }

  return (
    <form action={updateArchiveLink} className="space-y-4">
      <input type="hidden" name="linkId" value={linkId} />
      <input type="hidden" name="kind" value={kind} />

      <div className="rounded border border-gray-800 bg-gray-900/40 px-4 py-3 font-mono text-xs text-gray-400">
        {meta.label}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
            ИСТОЧНИК
          </label>
          <select
            name="sourceId"
            required
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
          >
            {sourceOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
            ЦЕЛЬ
          </label>
          <select
            name="targetId"
            required
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
          >
            {targetOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {kind === "relationship" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
              ТИП ОТНОШЕНИЙ
            </label>
            <input
              name="relationType"
              defaultValue={relationType ?? "союзник"}
              className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
              ДОВЕРИЕ
            </label>
            <input
              name="trustLevel"
              type="number"
              min={0}
              max={100}
              defaultValue={trustLevel ?? 50}
              className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
              ОПИСАНИЕ
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={description ?? ""}
              className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="rounded bg-emerald-400/10 px-6 py-2 font-mono text-xs text-emerald-400 hover:bg-emerald-400/20"
      >
        СОХРАНИТЬ
      </button>
    </form>
  );
}
