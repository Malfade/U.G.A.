"use client";

import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";
import { FactionAwareStatus } from "./FactionAwareContent";
import { EntityFieldsView, EntityFieldData } from "./EntityFieldsView";
import { FactionViewData } from "@/lib/faction-content";
import { useLoreStore } from "@/lib/store";
import { CLEARANCE_LABELS } from "@/lib/redact";

interface CharacterProfileProps {
  character: {
    id: string;
    name: string;
    callsign: string | null;
    status: string | null;
    accessLevel: number;
    faction: { id: string; name: string } | null;
    organization: { id: string; name: string } | null;
  };
  factionViews: FactionViewData[];
  fields: EntityFieldData[];
  quotes: string[];
}

function OptionalField({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div>
      <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1">{label}</div>
      {href ? (
        <Link href={href} className="text-emerald-400 hover:text-emerald-300 text-sm">
          {value}
        </Link>
      ) : (
        <span className="text-sm text-gray-200">{value}</span>
      )}
    </div>
  );
}

export function CharacterProfileCard({
  character,
  factionViews,
  fields,
  quotes,
}: CharacterProfileProps) {
  const clearance = useLoreStore((s) => s.clearanceLevel);
  const locked = clearance < character.accessLevel;

  return (
    <div className="border border-gray-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-mono text-2xl text-gray-100 mb-1">{character.name}</h1>
          {character.callsign && (
            <div className="font-mono text-sm text-gray-500">
              Позывной: {character.callsign}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!locked && (
            <FactionAwareStatus baseStatus={character.status} factionViews={factionViews} />
          )}
          <AccessLevel level={character.accessLevel} />
        </div>
      </div>

      {locked ? (
        <div className="border border-red-900/40 bg-red-950/20 rounded p-4 text-center">
          <p className="font-mono text-xs text-red-400">
            ДОСТУП ОТКАЗАН — требуется{" "}
            {CLEARANCE_LABELS[character.accessLevel] ?? `L${character.accessLevel}`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <OptionalField label="Статус" value={character.status} />
            <OptionalField
              label="Фракция"
              value={character.faction?.name}
              href={character.faction ? `/factions/${character.faction.id}` : undefined}
            />
            <OptionalField
              label="Организация"
              value={character.organization?.name}
              href={
                character.organization
                  ? `/organizations/${character.organization.id}`
                  : undefined
              }
            />
          </div>

          <EntityFieldsView fields={fields} />

          {quotes.length > 0 && (
            <div className="border-t border-gray-800 pt-3 mt-4">
              <h3 className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">
                ИЗВЕСТНЫЕ ЦИТАТЫ
              </h3>
              <div className="space-y-2">
                {quotes.map((q, i) => (
                  <blockquote
                    key={i}
                    className="border-l-2 border-gray-700 pl-3 text-sm text-gray-400 italic"
                  >
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
