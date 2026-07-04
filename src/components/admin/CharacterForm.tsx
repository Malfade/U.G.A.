"use client";

import { createCharacter, updateCharacter, deleteCharacter } from "@/app/admin/actions";

interface CharacterData {
  id: string;
  name: string;
  callsign: string | null;
  gender: string | null;
  birthDate: string | null;
  age: number | null;
  height: string | null;
  weight: string | null;
  rank: string | null;
  status: string | null;
  description: string | null;
  biography: string | null;
  abilities: string | null;
  factionId: string | null;
  accessLevel: number;
}

interface Props {
  factions: { id: string; name: string }[];
  character?: CharacterData;
}

export function CharacterForm({ factions, character }: Props) {
  const isEdit = !!character;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateCharacter(character!.id, formData);
    } else {
      await createCharacter(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Имя *" name="name" defaultValue={character?.name} required />
        <FormField label="Позывной" name="callsign" defaultValue={character?.callsign} />
        <FormField label="Пол" name="gender" defaultValue={character?.gender} />
        <FormField label="Дата рождения" name="birthDate" defaultValue={character?.birthDate} />
        <FormField label="Возраст" name="age" type="number" defaultValue={character?.age?.toString()} />
        <FormField label="Рост" name="height" defaultValue={character?.height} />
        <FormField label="Вес" name="weight" defaultValue={character?.weight} />
        <FormField label="Ранг" name="rank" defaultValue={character?.rank} />
        <FormField label="Статус" name="status" defaultValue={character?.status} />
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">ФРАКЦИЯ</label>
          <select
            name="factionId"
            defaultValue={character?.factionId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="">Нет фракции</option>
            {factions.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={character?.accessLevel ?? 0}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="0">0 — Открытый</option>
            <option value="1">1 — Ограниченный</option>
            <option value="2">2 — Секретный</option>
            <option value="3">3 — Совершенно секретный</option>
            <option value="4">4 — Особой важности</option>
          </select>
        </div>
      </div>

      <FormTextarea label="Описание" name="description" defaultValue={character?.description} />
      <FormTextarea label="Биография" name="biography" defaultValue={character?.biography} rows={6} />
      <FormTextarea label="Способности" name="abilities" defaultValue={character?.abilities} />

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
              if (confirm("Удалить персонажа?")) {
                await deleteCharacter(character!.id);
              }
            }}
            className="px-6 py-2 bg-red-400/10 text-red-400 rounded font-mono text-xs hover:bg-red-400/20 transition-colors"
          >
            УДАЛИТЬ
          </button>
        )}
      </div>

      <p className="font-mono text-[10px] text-gray-700">
        Пустые поля автоматически отображаются как засекреченные (████████████)
      </p>
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
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        {label.toUpperCase()}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none focus:border-emerald-400 transition-colors resize-y"
      />
    </div>
  );
}
