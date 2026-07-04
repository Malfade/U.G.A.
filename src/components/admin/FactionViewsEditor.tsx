"use client";

import { createFactionView, deleteFactionView } from "@/app/admin/actions";

interface FactionOption {
  id: string;
  name: string;
}

interface FactionViewItem {
  id: string;
  factionId: string;
  content: string;
  faction: { id: string; name: string };
}

interface Props {
  entityType: string;
  entityId: string;
  views: FactionViewItem[];
  factions: FactionOption[];
}

export function FactionViewsEditor({ entityType, entityId, views, factions }: Props) {
  const usedFactionIds = new Set(views.map((v) => v.factionId));
  const availableFactions = factions.filter((f) => !usedFactionIds.has(f.id));

  return (
    <div className="mt-8 border border-gray-800 rounded-lg p-6">
      <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-2">
        ТОЧКИ ОБЗОРА ФРАКЦИЙ
      </h2>
      <p className="font-mono text-[10px] text-gray-700 mb-4">
        JSON с переопределением полей для выбранной фракции. Пример:{" "}
        {`{"status": "Подозреваемая", "description": "..."}`}
      </p>

      <div className="space-y-4">
        {views.map((view) => (
          <form
            key={view.id}
            action={createFactionView}
            className="border border-gray-800 rounded p-4 space-y-3"
          >
            <input type="hidden" name="entityType" value={entityType} />
            <input type="hidden" name="entityId" value={entityId} />
            <input type="hidden" name="factionId" value={view.factionId} />
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-300">{view.faction.name}</span>
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Удалить точку обзора «${view.faction.name}»?`)) {
                    await deleteFactionView(view.id, entityType, entityId);
                  }
                }}
                className="font-mono text-[10px] text-red-400 hover:text-red-300"
              >
                УДАЛИТЬ
              </button>
            </div>
            <textarea
              name="content"
              defaultValue={view.content}
              rows={6}
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-xs text-gray-200 focus:outline-none focus:border-emerald-400 resize-y"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded font-mono text-[10px] hover:bg-emerald-400/20"
            >
              СОХРАНИТЬ
            </button>
          </form>
        ))}
      </div>

      {availableFactions.length > 0 && (
        <form action={createFactionView} className="mt-4 border border-dashed border-gray-800 rounded p-4 space-y-3">
          <input type="hidden" name="entityType" value={entityType} />
          <input type="hidden" name="entityId" value={entityId} />
          <div>
            <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
              НОВАЯ ФРАКЦИЯ
            </label>
            <select
              name="factionId"
              required
              className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
            >
              <option value="">— выберите фракцию —</option>
              {availableFactions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="content"
            defaultValue="{}"
            rows={4}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-xs text-gray-200 focus:outline-none focus:border-emerald-400 resize-y"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded font-mono text-[10px] hover:bg-emerald-400/20"
          >
            ДОБАВИТЬ ТОЧКУ ОБЗОРА
          </button>
        </form>
      )}
    </div>
  );
}
