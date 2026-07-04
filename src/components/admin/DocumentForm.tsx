"use client";

import { createDocument, updateDocument, deleteDocument } from "@/app/admin/actions";

interface DocumentData {
  id: string;
  title: string;
  type: string;
  content: string | null;
  accessLevel: number;
  damagePercent: number;
}

interface Props {
  document?: DocumentData;
}

export function DocumentForm({ document }: Props) {
  const isEdit = !!document;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateDocument(document!.id, formData);
    } else {
      await createDocument(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Заголовок *" name="title" defaultValue={document?.title} required />
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">ТИП</label>
          <select
            name="type"
            defaultValue={document?.type ?? "report"}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="report">Отчёт</option>
            <option value="transcript">Расшифровка</option>
            <option value="audio">Аудиозапись</option>
            <option value="video">Видеозапись</option>
            <option value="photo">Фотография</option>
            <option value="letter">Письмо</option>
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 tracking-widest mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={document?.accessLevel ?? 0}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="0">0 — Открытый</option>
            <option value="1">1 — Ограниченный</option>
            <option value="2">2 — Секретный</option>
            <option value="3">3 — Совершенно секретный</option>
            <option value="4">4 — Особой важности</option>
          </select>
        </div>
        <FormField label="Повреждение (%)" name="damagePercent" type="number" defaultValue={String(document?.damagePercent ?? 0)} />
      </div>

      <FormTextarea label="Содержание" name="content" defaultValue={document?.content} rows={8} />

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
              if (confirm("Удалить документ?")) {
                await deleteDocument(document!.id);
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
