"use client";

import { useLoreStore } from "@/lib/store";
import { useActiveFaction } from "@/components/layout/FactionProvider";
import { RedactedText } from "@/components/ui/RedactedText";
import {
  FactionViewData,
  getExtraFactionFields,
  parseFactionViewContent,
  resolveFactionField,
} from "@/lib/faction-content";

export interface ContentField {
  key: string;
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}

interface Props {
  factionViews: FactionViewData[];
  fields: ContentField[];
  children?: React.ReactNode;
}

export function FactionViewBanner() {
  const { label, accentHex, isObserver } = useActiveFaction();
  if (isObserver) return null;

  return (
    <div
      className="mb-4 px-3 py-2 rounded border font-mono text-[10px] tracking-widest"
      style={{
        color: accentHex,
        borderColor: `${accentHex}40`,
        backgroundColor: `${accentHex}10`,
      }}
    >
      ТОЧКА ОБЗОРА: {label.toUpperCase()}
    </div>
  );
}

export function FactionAwareContent({ factionViews, fields, children }: Props) {
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);
  const { isObserver, accentHex } = useActiveFaction();

  const activeView = selectedFactionId
    ? factionViews.find((v) => v.faction.id === selectedFactionId)
    : null;

  const parsed = activeView ? parseFactionViewContent(activeView.content) : null;
  const knownKeys = fields.map((f) => f.key);
  const extras = parsed ? getExtraFactionFields(parsed, knownKeys) : {};

  if (!isObserver && !activeView) {
    return (
      <div className="space-y-4">
        <FactionViewBanner />
        <div className="border border-gray-800 rounded p-4 text-center">
          <p className="font-mono text-xs text-gray-600">
            Данные по этому объекту недоступны для выбранной фракции.
          </p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FactionViewBanner />

      {fields.map((field) => {
        const value = resolveFactionField(field.key, field.value, parsed, isObserver);
        return (
          <div key={field.key} className="border-t border-gray-800 pt-3">
            <h3 className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">
              {field.label}
              {!isObserver && parsed && field.key in parsed && (
                <span className="ml-2 opacity-60" style={{ color: accentHex }}>
                  [ФРАКЦИЯ]
                </span>
              )}
            </h3>
            <RedactedText
              value={value}
              as="p"
              className={`text-sm text-gray-300 leading-relaxed ${field.multiline ? "whitespace-pre-wrap" : ""}`}
            />
          </div>
        );
      })}

      {!isObserver && Object.keys(extras).length > 0 && (
        <div className="border-t border-gray-800 pt-3">
          <h3 className="font-mono text-[10px] tracking-widest mb-3" style={{ color: accentHex }}>
            ДОПОЛНИТЕЛЬНЫЕ СВЕДЕНИЯ
          </h3>
          <div className="space-y-3">
            {Object.entries(extras).map(([key, value]) => (
              <div key={key}>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1 uppercase">
                  {key}
                </div>
                <p className="text-sm text-gray-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

export function FactionAwareStatus({
  baseStatus,
  factionViews,
}: {
  baseStatus: string | null;
  factionViews: FactionViewData[];
}) {
  const selectedFactionId = useLoreStore((s) => s.selectedFactionId);
  const { isObserver } = useActiveFaction();

  const activeView = selectedFactionId
    ? factionViews.find((v) => v.faction.id === selectedFactionId)
    : null;
  const parsed = activeView ? parseFactionViewContent(activeView.content) : null;
  const status = resolveFactionField("status", baseStatus, parsed, isObserver);

  if (!status && !isObserver && selectedFactionId) {
    return <span className="redacted-dark inline-block px-2 py-0.5 rounded text-xs font-mono">██████</span>;
  }

  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono bg-gray-900 text-gray-300 border border-gray-700">
      {status ?? "██████"}
    </span>
  );
}
