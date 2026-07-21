"use client";

import { useMemo, useState } from "react";
import { createArchiveLink } from "@/app/admin/actions";

type Opt = { id: string; name: string };

const KINDS = [
  {
    value: "relationship",
    label: "Персонаж ↔ персонаж",
    source: "character",
    target: "character",
  },
  {
    value: "character_event",
    label: "Персонаж → событие",
    source: "character",
    target: "event",
  },
  {
    value: "event_location",
    label: "Событие → локация",
    source: "event",
    target: "location",
  },
  {
    value: "character_document",
    label: "Персонаж → документ",
    source: "character",
    target: "document",
  },
  {
    value: "event_document",
    label: "Событие → документ",
    source: "event",
    target: "document",
  },
  {
    value: "character_organization",
    label: "Персонаж → организация",
    source: "character",
    target: "organization",
  },
  {
    value: "organization_event",
    label: "Организация → событие",
    source: "organization",
    target: "event",
  },
  {
    value: "organization_document",
    label: "Организация → документ",
    source: "organization",
    target: "document",
  },
  {
    value: "organization_location",
    label: "Организация → локация",
    source: "organization",
    target: "location",
  },
  {
    value: "dialogue_location",
    label: "Запись → локация (место записи)",
    source: "dialogue",
    target: "location",
  },
  {
    value: "dialogue_about_character",
    label: "Запись → персонаж (о ком)",
    source: "dialogue",
    target: "character",
  },
  {
    value: "dialogue_about_location",
    label: "Запись → локация (о месте)",
    source: "dialogue",
    target: "location",
  },
] as const;

type KindValue = (typeof KINDS)[number]["value"];

interface Props {
  characters: Opt[];
  events: Opt[];
  locations: Opt[];
  documents: Opt[];
  organizations: Opt[];
  dialogues: Opt[];
  defaultKind?: string;
}

export function ArchiveLinkForm({
  characters,
  events,
  locations,
  documents,
  organizations,
  dialogues,
  defaultKind = "event_location",
}: Props) {
  const [kind, setKind] = useState<KindValue>(
    (KINDS.find((k) => k.value === defaultKind)?.value ??
      "event_location") as KindValue
  );

  const meta = KINDS.find((k) => k.value === kind)!;

  const sourceOptions = useMemo(() => {
    switch (meta.source) {
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
  }, [meta.source, characters, events, dialogues, organizations]);

  const targetOptions = useMemo(() => {
    switch (meta.target) {
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
  }, [meta.target, characters, events, locations, documents, organizations]);

  return (
    <form action={createArchiveLink} className="space-y-4">
      <div>
        <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
          ТИП СВЯЗИ
        </label>
        <select
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value as KindValue)}
          className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
        >
          {KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
            ИСТОЧНИК
          </label>
          <select
            name="sourceId"
            required
            className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">Выберите…</option>
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
            className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">Выберите…</option>
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
              defaultValue="союзник"
              className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-widest text-gray-600">
              ДОВЕРИЕ (0–100)
            </label>
            <input
              name="trustLevel"
              type="number"
              min={0}
              max={100}
              defaultValue={50}
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
              className="w-full rounded border border-gray-800 bg-gray-950 px-3 py-2 font-mono text-sm text-gray-200"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="rounded bg-emerald-400/10 px-6 py-2 font-mono text-xs text-emerald-400 hover:bg-emerald-400/20"
      >
        СОЗДАТЬ СВЯЗЬ
      </button>
    </form>
  );
}
