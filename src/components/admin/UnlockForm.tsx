"use client";

import {
  createClearanceUnlock,
  updateClearanceUnlock,
  deleteClearanceUnlock,
} from "@/app/admin/actions";

interface Option {
  id: string;
  name: string;
}

interface UnlockData {
  id: string;
  title: string;
  grantsLevel: number;
  cipherText: string;
  solutionKey: string;
  rewardCode: string;
  hint: string | null;
  dialogueId: string | null;
  documentId: string | null;
}

interface Props {
  dialogues: Option[];
  documents: Option[];
  unlock?: UnlockData;
}

export function UnlockForm({ dialogues, documents, unlock }: Props) {
  const isEdit = !!unlock;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) await updateClearanceUnlock(unlock!.id, formData);
    else await createClearanceUnlock(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block font-mono text-[10px] text-gray-600 mb-1">НАЗВАНИЕ *</label>
          <input
            name="title"
            required
            defaultValue={unlock?.title ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">
            ОТКРЫВАЕТ УРОВЕНЬ
          </label>
          <select
            name="grantsLevel"
            defaultValue={unlock?.grantsLevel ?? 1}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">КОД ДОПУСКА *</label>
          <input
            name="rewardCode"
            required
            defaultValue={unlock?.rewardCode ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">КЛЮЧ *</label>
          <input
            name="solutionKey"
            required
            defaultValue={unlock?.solutionKey ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">ПОДСКАЗКА</label>
          <input
            name="hint"
            defaultValue={unlock?.hint ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">В ДИАЛОГЕ</label>
          <select
            name="dialogueId"
            defaultValue={unlock?.dialogueId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {dialogues.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">В ДОКУМЕНТЕ</label>
          <select
            name="documentId"
            defaultValue={unlock?.documentId ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            <option value="">—</option>
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block font-mono text-[10px] text-gray-600 mb-1">ШИФРТЕКСТ *</label>
        <textarea
          name="cipherText"
          required
          rows={6}
          defaultValue={unlock?.cipherText ?? ""}
          className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
        />
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-800">
        <button
          type="submit"
          className="px-6 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs"
        >
          {isEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={async () => {
              if (confirm("Удалить?")) await deleteClearanceUnlock(unlock!.id);
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
