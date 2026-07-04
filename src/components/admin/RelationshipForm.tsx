"use client";

import { createRelationship, updateRelationship, deleteRelationship } from "@/app/admin/actions";
import { useState } from "react";

interface CharacterOption {
  id: string;
  name: string;
}

interface HistoryEntry {
  id?: string;
  year: string;
  status: string;
  description: string;
}

interface RelationshipData {
  id: string;
  characterAId: string;
  characterBId: string;
  type: string;
  trustLevel: number;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  history: { id: string; year: string; status: string; description: string | null }[];
}

interface Props {
  characters: CharacterOption[];
  relationship?: RelationshipData;
}

export function RelationshipForm({ characters, relationship }: Props) {
  const isEdit = !!relationship;
  const [history, setHistory] = useState<HistoryEntry[]>(
    relationship?.history.map((h) => ({
      id: h.id,
      year: h.year,
      status: h.status,
      description: h.description ?? "",
    })) ?? []
  );

  const handleSubmit = async (formData: FormData) => {
    formData.set("history", JSON.stringify(history));
    if (isEdit) {
      await updateRelationship(relationship!.id, formData);
    } else {
      await createRelationship(formData);
    }
  };

  const addHistoryRow = () => {
    setHistory((prev) => [...prev, { year: "", status: "", description: "" }]);
  };

  const updateHistoryRow = (index: number, field: keyof HistoryEntry, value: string) => {
    setHistory((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const removeHistoryRow = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Персонаж A *"
          name="characterAId"
          options={characters}
          defaultValue={relationship?.characterAId}
          required
        />
        <SelectField
          label="Персонаж B *"
          name="characterBId"
          options={characters}
          defaultValue={relationship?.characterBId}
          required
        />
        <FormField label="Тип связи" name="type" defaultValue={relationship?.type ?? "unknown"} />
        <FormField
          label="Уровень доверия (0–100)"
          name="trustLevel"
          type="number"
          defaultValue={relationship?.trustLevel?.toString() ?? "50"}
        />
        <FormField label="Начало" name="startDate" defaultValue={relationship?.startDate} />
        <FormField label="Конец" name="endDate" defaultValue={relationship?.endDate} />
      </div>

      <FormTextarea label="Описание" name="description" defaultValue={relationship?.description} />

      <div className="border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-[10px] text-gray-600 tracking-widest">ХРОНОЛОГИЯ</h3>
          <button
            type="button"
            onClick={addHistoryRow}
            className="px-3 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded hover:bg-emerald-400/20"
          >
            + ДОБАВИТЬ
          </button>
        </div>
        {history.length === 0 ? (
          <p className="font-mono text-[10px] text-gray-700">Нет записей</p>
        ) : (
          <div className="space-y-3">
            {history.map((row, index) => (
              <div key={row.id ?? index} className="grid grid-cols-12 gap-2 items-start">
                <input
                  value={row.year}
                  onChange={(e) => updateHistoryRow(index, "year", e.target.value)}
                  placeholder="Год"
                  className="col-span-2 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
                />
                <input
                  value={row.status}
                  onChange={(e) => updateHistoryRow(index, "status", e.target.value)}
                  placeholder="Статус"
                  className="col-span-3 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
                />
                <input
                  value={row.description}
                  onChange={(e) => updateHistoryRow(index, "description", e.target.value)}
                  placeholder="Описание"
                  className="col-span-6 bg-gray-950 border border-gray-800 rounded px-2 py-1.5 font-mono text-xs text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeHistoryRow(index)}
                  className="col-span-1 text-red-400 font-mono text-xs hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          {isEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={async () => {
              if (confirm("Удалить связь?")) {
                await deleteRelationship(relationship!.id);
              }
            }}
            className="px-6 py-2 bg-red-400/10 text-red-400 rounded font-mono text-xs hover:bg-red-400/20 transition-colors"
          >
            УДАЛИТЬ
          </button>
        )}
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors"
      />
    </div>
  );
}

function FormTextarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        {label.toUpperCase()}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={3}
        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors resize-y"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  options: CharacterOption[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        {label.toUpperCase()}
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400 transition-colors"
      >
        <option value="">— выберите —</option>
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
