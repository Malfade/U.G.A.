"use client";

import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";
import {
  FactionAwareContent,
  FactionAwareStatus,
} from "./FactionAwareContent";
import { FactionViewData } from "@/lib/faction-content";

interface CharacterProfileProps {
  character: {
    id: string;
    name: string;
    callsign: string | null;
    rank: string | null;
    gender: string | null;
    age: number | null;
    height: string | null;
    weight: string | null;
    birthDate: string | null;
    status: string | null;
    description: string | null;
    biography: string | null;
    abilities: string | null;
    accessLevel: number;
    faction: { id: string; name: string } | null;
  };
  factionViews: FactionViewData[];
  quotes: string[];
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  const content = !value ? (
    <span className="redacted-dark inline-block px-1 rounded text-xs">██████</span>
  ) : href ? (
    <Link href={href} className="text-emerald-400 hover:text-emerald-300 text-sm">
      {value}
    </Link>
  ) : (
    <span className="text-sm text-gray-200">{value}</span>
  );

  return (
    <div>
      <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-1">{label}</div>
      {content}
    </div>
  );
}

export function CharacterProfileCard({ character, factionViews, quotes }: CharacterProfileProps) {
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
          <FactionAwareStatus baseStatus={character.status} factionViews={factionViews} />
          <AccessLevel level={character.accessLevel} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Field label="Ранг" value={character.rank} />
        <Field label="Пол" value={character.gender} />
        <Field label="Возраст" value={character.age?.toString()} />
        <Field label="Рост" value={character.height} />
        <Field label="Вес" value={character.weight} />
        <Field label="Дата рождения" value={character.birthDate} />
        <Field
          label="Фракция"
          value={character.faction?.name}
          href={character.faction ? `/factions/${character.faction.id}` : undefined}
        />
      </div>

      <FactionAwareContent
        factionViews={factionViews}
        fields={[
          { key: "description", label: "ОПИСАНИЕ", value: character.description, multiline: true },
          { key: "biography", label: "БИОГРАФИЯ", value: character.biography, multiline: true },
          { key: "abilities", label: "СПОСОБНОСТИ", value: character.abilities },
        ]}
      />

      {quotes.length > 0 && (
        <div className="border-t border-gray-800 pt-3 mt-4">
          <h3 className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">ИЗВЕСТНЫЕ ЦИТАТЫ</h3>
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
    </div>
  );
}
