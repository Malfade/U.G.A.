"use client";

import { createFaction, updateFaction, deleteFaction } from "@/app/admin/actions";

interface FactionData {
  id: string;
  name: string;
  emblem: string | null;
  description: string | null;
  foundedDate: string | null;
  colorScheme: string;
  terminology: string;
}

interface Props {
  faction?: FactionData;
}

export function FactionForm({ faction }: Props) {
  const isEdit = !!faction;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateFaction(faction!.id, formData);
    } else {
      await createFaction(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название *" name="name" defaultValue={faction?.name} required />
        <FormField label="Эмблема (URL/символ)" name="emblem" defaultValue={faction?.emblem} />
        <FormField label="Дата основания" name="foundedDate" defaultValue={faction?.foundedDate} />
      </div>

      <FormTextarea label="Описание" name="description" defaultValue={faction?.description} />
      <FormTextarea
        label="Цветовая схема (JSON)"
        name="colorScheme"
        defaultValue={faction?.colorScheme ?? "{}"}
        rows={3}
      />
      <FormTextarea
        label="Терминология (JSON)"
        name="terminology"
        defaultValue={faction?.terminology ?? "{}"}
        rows={3}
      />

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
              if (confirm("Удалить фракцию? Связанные точки обзора также будут удалены.")) {
                await deleteFaction(faction!.id);
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
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">
        {label.toUpperCase()}
      </label>
      <input
        type="text"
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
