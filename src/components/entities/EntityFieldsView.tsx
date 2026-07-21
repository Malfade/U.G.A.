"use client";

import { blocksForLength, isEmpty, parseRedactionMarkers } from "@/lib/redact";
import { useLoreStore } from "@/lib/store";
import { CLEARANCE_LABELS } from "@/lib/redact";

export interface EntityFieldData {
  id: string;
  label: string;
  content: string;
  accessLevel: number;
  fullyRedacted: boolean;
  sortOrder: number;
}

function FieldBody({
  content,
  canSeeSecrets,
}: {
  content: string;
  canSeeSecrets: boolean;
}) {
  const segments = parseRedactionMarkers(content);
  return (
    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : canSeeSecrets ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <span key={i} className="redacted-dark inline px-0.5 rounded tracking-widest select-none">
            {blocksForLength(seg.value.length)}
          </span>
        )
      )}
    </p>
  );
}

export function EntityFieldsView({ fields }: { fields: EntityFieldData[] }) {
  const clearance = useLoreStore((s) => s.clearanceLevel);
  const visible = fields
    .filter((f) => !isEmpty(f.label))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (visible.length === 0) return null;

  return (
    <div className="space-y-4">
      {visible.map((field) => {
        if (isEmpty(field.content) && !field.fullyRedacted) return null;

        const locked = clearance < field.accessLevel;

        return (
          <div key={field.id} className="border-t border-gray-800 pt-3">
            <h3 className="font-mono text-[10px] text-gray-600 tracking-widest mb-2 flex items-center gap-2">
              {field.label.toUpperCase()}
              {field.accessLevel > 0 && (
                <span className="text-gray-700">L{field.accessLevel}</span>
              )}
            </h3>
            {locked && (field.fullyRedacted || isEmpty(field.content)) ? (
              <div className="border border-red-900/40 bg-red-950/20 rounded p-3">
                <p className="font-mono text-xs text-red-400/80">
                  ДОСТУП ОТКАЗАН — требуется{" "}
                  {CLEARANCE_LABELS[field.accessLevel] ?? `L${field.accessLevel}`}
                </p>
                <p className="redacted-dark inline-block mt-2 px-1 rounded text-xs tracking-widest">
                  ████████████
                </p>
              </div>
            ) : (
              <FieldBody content={field.content} canSeeSecrets={!locked} />
            )}
          </div>
        );
      })}
    </div>
  );
}
