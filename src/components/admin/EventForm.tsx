"use client";

import { createEvent, updateEvent, deleteEvent } from "@/app/admin/actions";

interface EventData {
  id: string;
  name: string;
  date: string | null;
  description: string | null;
  cause: string | null;
  consequences: string | null;
  accessLevel: number;
}

interface Props {
  event?: EventData;
}

export function EventForm({ event }: Props) {
  const isEdit = !!event;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateEvent(event!.id, formData);
    } else {
      await createEvent(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название *" name="name" defaultValue={event?.name} required />
        <FormField label="Дата" name="date" defaultValue={event?.date} />
        <div className="col-span-2">
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={event?.accessLevel ?? 0}
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

      <FormTextarea label="Описание" name="description" defaultValue={event?.description} />
      <FormTextarea label="Причина" name="cause" defaultValue={event?.cause} />
      <FormTextarea label="Последствия" name="consequences" defaultValue={event?.consequences} />

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
              if (confirm("Удалить событие?")) {
                await deleteEvent(event!.id);
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
