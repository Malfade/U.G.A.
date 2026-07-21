"use client";

import { useRef, useState, useTransition } from "react";
import {
  createEntityField,
  updateEntityField,
  deleteEntityField,
} from "@/app/admin/actions";
import { wrapRedaction } from "@/lib/redact";

export interface FieldItem {
  id: string;
  label: string;
  content: string;
  accessLevel: number;
  fullyRedacted: boolean;
  sortOrder: number;
}

interface Props {
  entityType: string;
  entityId: string;
  fields: FieldItem[];
}

export function EntityFieldsEditor({ entityType, entityId, fields }: Props) {
  const [creating, setCreating] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-8 border border-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-mono text-xs text-gray-500 tracking-widest">ПОЛЯ ЗАПИСИ</h2>
          <p className="font-mono text-[10px] text-gray-700 mt-1">
            Пустые поля не показываются. Выделите текст и нажмите «засекретить» — обернётся в [[R]]…[[/R]].
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="px-3 py-1.5 bg-emerald-400/10 text-emerald-400 rounded font-mono text-[10px] hover:bg-emerald-400/20"
        >
          + СОЗДАТЬ ПОЛЕ
        </button>
      </div>

      <div className="space-y-4">
        {fields
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((field) => (
            <FieldEditorRow
              key={field.id}
              field={field}
              entityType={entityType}
              entityId={entityId}
            />
          ))}
        {fields.length === 0 && !creating && (
          <p className="font-mono text-[10px] text-gray-700">Пока нет полей</p>
        )}
      </div>

      {creating && (
        <form
          className="mt-4 border border-dashed border-gray-700 rounded p-4 space-y-3"
          action={(fd) => {
            startTransition(async () => {
              await createEntityField(fd);
              setCreating(false);
            });
          }}
        >
          <input type="hidden" name="entityType" value={entityType} />
          <input type="hidden" name="entityId" value={entityId} />
          <input type="hidden" name="sortOrder" value={String(fields.length)} />
          <FieldFormFields />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded font-mono text-[10px]"
            >
              СОЗДАТЬ
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-4 py-1.5 text-gray-500 font-mono text-[10px]"
            >
              ОТМЕНА
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function FieldFormFields({
  defaults,
  textareaRef,
}: {
  defaults?: Partial<FieldItem>;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">НАЗВАНИЕ</label>
          <input
            name="label"
            required
            defaultValue={defaults?.label ?? ""}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] text-gray-600 mb-1">УРОВЕНЬ ДОСТУПА</label>
          <select
            name="accessLevel"
            defaultValue={defaults?.accessLevel ?? 0}
            className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-mono text-[10px] text-gray-600">СОДЕРЖАНИЕ</label>
          {textareaRef && (
            <button
              type="button"
              onClick={() => {
                const el = textareaRef.current;
                if (!el) return;
                const start = el.selectionStart;
                const end = el.selectionEnd;
                if (start === end) return;
                const selected = el.value.slice(start, end);
                const next =
                  el.value.slice(0, start) + wrapRedaction(selected) + el.value.slice(end);
                el.value = next;
              }}
              className="font-mono text-[10px] text-red-400 hover:text-red-300"
            >
              ЗАСЕКРЕТИТЬ ВЫДЕЛЕНИЕ
            </button>
          )}
        </div>
        <textarea
          ref={textareaRef}
          name="content"
          rows={5}
          defaultValue={defaults?.content ?? ""}
          className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 font-mono text-sm text-gray-200 resize-y"
        />
      </div>
      <label className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
        <input
          type="checkbox"
          name="fullyRedacted"
          value="true"
          defaultChecked={defaults?.fullyRedacted}
          className="accent-red-400"
        />
        Полностью засекречено (нужен уровень доступа поля)
      </label>
    </>
  );
}

function FieldEditorRow({
  field,
  entityType,
  entityId,
}: {
  field: FieldItem;
  entityType: string;
  entityId: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="border border-gray-800 rounded p-4 space-y-3"
      action={(fd) => {
        startTransition(async () => {
          await updateEntityField(field.id, fd);
        });
      }}
    >
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <input type="hidden" name="sortOrder" value={String(field.sortOrder)} />
      <FieldFormFields defaults={field} textareaRef={taRef} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-1.5 bg-emerald-400/10 text-emerald-400 rounded font-mono text-[10px]"
        >
          СОХРАНИТЬ
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm("Удалить поле?")) {
              startTransition(async () => {
                await deleteEntityField(field.id, entityType, entityId);
              });
            }
          }}
          className="px-4 py-1.5 bg-red-400/10 text-red-400 rounded font-mono text-[10px]"
        >
          УДАЛИТЬ
        </button>
      </div>
    </form>
  );
}
