"use client";

import { createLocation, updateLocation, deleteLocation } from "@/app/admin/actions";

interface LocationData {
  id: string;
  name: string;
  type: string;
  coordX: number | null;
  coordY: number | null;
  population: string | null;
  description: string | null;
  accessLevel: number;
}

interface Props {
  location?: LocationData;
}

export function LocationForm({ location }: Props) {
  const isEdit = !!location;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateLocation(location!.id, formData);
    } else {
      await createLocation(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название *" name="name" defaultValue={location?.name} required />
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">ТИП</label>
          <select
            name="type"
            defaultValue={location?.type ?? "city"}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="city">Город</option>
            <option value="base">База</option>
            <option value="anomalyZone">Аномальная зона</option>
            <option value="contaminationZone">Зона заражения</option>
          </select>
        </div>
        <FormField label="Широта (coordX)" name="coordX" type="number" defaultValue={location?.coordX?.toString()} />
        <FormField label="Долгота (coordY)" name="coordY" type="number" defaultValue={location?.coordY?.toString()} />
        <FormField label="Население" name="population" defaultValue={location?.population} />
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={location?.accessLevel ?? 0}
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

      <FormTextarea label="Описание" name="description" defaultValue={location?.description} />

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
              if (confirm("Удалить локацию?")) {
                await deleteLocation(location!.id);
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
