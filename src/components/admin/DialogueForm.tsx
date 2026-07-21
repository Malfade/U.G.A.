"use client";

import { useState } from "react";
import {
  createDialogue,
  updateDialogue,
  deleteDialogue,
} from "@/app/admin/actions";

interface Option {
  id: string;
  name: string;
}

interface LineState {
  speakerId: string;
  speakerLabel: string;
  text: string;
}

interface DialogueData {
  id: string;
  title: string | null;
  kind: string;
  summary: string | null;
  accessLevel: number;
  locationId: string | null;
  aboutCharacterId: string | null;
  aboutLocationId: string | null;
  factionId: string | null;
  lines: {
    id: string;
    speakerId: string | null;
    speakerLabel: string | null;
    text: string;
    sortOrder: number;
  }[];
}

interface Props {
  characters: Option[];
  locations: Option[];
  factions: Option[];
  dialogue?: DialogueData;
}

export function DialogueForm({ characters, locations, factions, dialogue }: Props) {
  const isEdit = !!dialogue;
  const [lines, setLines] = useState<LineState[]>(
    dialogue?.lines
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((l) => ({
        speakerId: l.speakerId ?? "",
        speakerLabel: l.speakerLabel ?? "",
        text: l.text,
      })) ?? [{ speakerId: "", speakerLabel: "", text: "" }]
  );

  const handleSubmit = async (formData: FormData) => {
    formData.set("lines", JSON.stringify(lines));
    if (isEdit) await updateDialogue(dialogue!.id, formData);
    else await createDialogue(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">НАЗВАНИЕ</label>
          <input
            name="title"
            defaultValue={dialogue?.title ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">ТИП</label>
          <select
            name="kind"
            defaultValue={dialogue?.kind ?? "dialogue"}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="dialogue">Диалог</option>
            <option value="monologue">Монолог</option>
            <option value="excerpt">Вырезка</option>
            <option value="call">Звонок (запись)</option>
            <option value="dispatch">Диспетчерская</option>
            <option value="log">Журнал / лог</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={dialogue?.accessLevel ?? 0}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">ФРАКЦИЯ (АРХИВ)</label>
          <select
            name="factionId"
            defaultValue={dialogue?.factionId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {factions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">МЕСТО (ПРИВЯЗКА)</label>
          <select
            name="locationId"
            defaultValue={dialogue?.locationId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">О ПЕРСОНАЖЕ</label>
          <select
            name="aboutCharacterId"
            defaultValue={dialogue?.aboutCharacterId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">О МЕСТЕ</label>
          <select
            name="aboutLocationId"
            defaultValue={dialogue?.aboutLocationId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-gray-600 mb-1">КРАТКО</label>
        <textarea
          name="summary"
          rows={2}
          defaultValue={dialogue?.summary ?? ""}
          className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
        />
      </div>

      <div className="border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-[10px] text-gray-600 tracking-widest">РЕПЛИКИ</h3>
          <button
            type="button"
            onClick={() =>
              setLines((prev) => [...prev, { speakerId: "", speakerLabel: "", text: "" }])
            }
            className="px-3 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded"
          >
            + РЕПЛИКА
          </button>
        </div>
        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <select
                value={line.speakerId}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, speakerId: e.target.value } : l
                    )
                  )
                }
                className="col-span-3 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
              >
                <option value="">Спикер…</option>
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                value={line.speakerLabel}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) =>
                      i === index ? { ...l, speakerLabel: e.target.value } : l
                    )
                  )
                }
                placeholder="Или имя вручную"
                className="col-span-2 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
              />
              <textarea
                value={line.text}
                onChange={(e) =>
                  setLines((prev) =>
                    prev.map((l, i) => (i === index ? { ...l, text: e.target.value } : l))
                  )
                }
                rows={2}
                placeholder="Текст реплики"
                className="col-span-6 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
              />
              <button
                type="button"
                onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                className="col-span-1 text-red-400 font-mono text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20"
        >
          {isEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={async () => {
              if (confirm("Удалить диалог?")) await deleteDialogue(dialogue!.id);
            }}
            className="px-6 py-2 bg-red-400/10 text-red-400 rounded font-mono text-xs"
          >
            УДАЛИТЬ
          </button>
        )}
      </div>
    </form>
  );
}
