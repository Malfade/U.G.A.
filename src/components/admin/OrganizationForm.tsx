"use client";

import { createOrganization, updateOrganization, deleteOrganization } from "@/app/admin/actions";

interface OrganizationData {
  id: string;
  name: string;
  description: string | null;
  foundedDate: string | null;
  hierarchy: string | null;
  goals: string | null;
}

interface Props {
  organization?: OrganizationData;
}

export function OrganizationForm({ organization }: Props) {
  const isEdit = !!organization;

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateOrganization(organization!.id, formData);
    } else {
      await createOrganization(formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Название *" name="name" defaultValue={organization?.name} required />
        <FormField label="Дата основания" name="foundedDate" defaultValue={organization?.foundedDate} />
      </div>

      <FormTextarea label="Описание" name="description" defaultValue={organization?.description} />
      <FormTextarea label="Иерархия" name="hierarchy" defaultValue={organization?.hierarchy} />
      <FormTextarea label="Цели" name="goals" defaultValue={organization?.goals} />

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
              if (confirm("Удалить организацию?")) {
                await deleteOrganization(organization!.id);
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
