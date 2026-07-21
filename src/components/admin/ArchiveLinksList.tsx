"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { deleteArchiveLink } from "@/app/admin/actions";

export type ArchiveLinkRow = {
  id: string;
  kind: string;
  kindLabel: string;
  title: string;
  subtitle: string;
  editHref: string | null;
};

const KIND_FILTERS = [
  { value: "all", label: "Все" },
  { value: "relationship", label: "Персонажи" },
  { value: "character_event", label: "Персонаж → событие" },
  { value: "event_location", label: "Событие → локация" },
  { value: "character_document", label: "Персонаж → документ" },
  { value: "event_document", label: "Событие → документ" },
  { value: "character_organization", label: "Персонаж → организация" },
  { value: "organization_event", label: "Организация → событие" },
  { value: "organization_document", label: "Организация → документ" },
  { value: "organization_location", label: "Организация → локация" },
  { value: "dialogue_location", label: "Запись → локация" },
  { value: "dialogue_about_character", label: "Запись → персонаж" },
  { value: "dialogue_about_location", label: "Запись → о месте" },
];

export function ArchiveLinksList({ links }: { links: ArchiveLinkRow[] }) {
  const [filter, setFilter] = useState("all");
  const [pending, startTransition] = useTransition();

  const visible = useMemo(
    () => (filter === "all" ? links : links.filter((l) => l.kind === filter)),
    [filter, links]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {KIND_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded px-2.5 py-1 font-mono text-[10px] transition-colors ${
              filter === f.value
                ? "bg-emerald-400/15 text-emerald-400"
                : "bg-gray-900 text-gray-500 hover:text-gray-300"
            }`}
          >
            {f.label}
            {f.value === "all"
              ? ` (${links.length})`
              : ` (${links.filter((l) => l.kind === f.value).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 px-4 py-3 transition-colors hover:bg-gray-900/50"
          >
            <div className="min-w-0">
              <div className="mb-0.5 font-mono text-[10px] tracking-widest text-gray-600">
                {item.kindLabel}
              </div>
              <div className="truncate font-mono text-sm text-gray-200">
                {item.title}
              </div>
              <div className="font-mono text-xs text-gray-600">{item.subtitle}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {item.editHref && (
                <Link
                  href={item.editHref}
                  className="rounded bg-emerald-400/5 px-3 py-1 font-mono text-xs text-emerald-400 hover:text-emerald-300"
                >
                  РЕДАКТИРОВАТЬ
                </Link>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (!confirm("Удалить связь?")) return;
                  startTransition(async () => {
                    await deleteArchiveLink(item.id);
                  });
                }}
                className="rounded bg-red-400/5 px-3 py-1 font-mono text-xs text-red-400 hover:text-red-300 disabled:opacity-40"
              >
                УДАЛИТЬ
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="py-8 text-center font-mono text-xs text-gray-600">
            Нет записей этого типа
          </div>
        )}
      </div>
    </div>
  );
}
