import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CharacterProfileCard } from "@/components/entities/CharacterProfileCard";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      faction: true,
      characterEvents: { include: { event: true } },
      characterDocuments: { include: { document: { select: { id: true, title: true, type: true } } } },
      relationshipsA: {
        include: {
          characterB: { select: { id: true, name: true } },
          history: { orderBy: { year: "asc" } },
        },
      },
      relationshipsB: {
        include: {
          characterA: { select: { id: true, name: true } },
          history: { orderBy: { year: "asc" } },
        },
      },
      factionViews: { include: { faction: true } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!character) notFound();

  const charName = character.name;
  const charCallsign = character.callsign;

  const [mentionedInEvents, mentionedInDocuments, mentionedInOrgs, mentionedInLocations, mentionedInFactionViews] = await Promise.all([
    prisma.event.findMany({
      where: {
        OR: [
          { description: { contains: charName } },
          { cause: { contains: charName } },
          { consequences: { contains: charName } },
          ...(charCallsign ? [
            { description: { contains: charCallsign } },
            { cause: { contains: charCallsign } },
            { consequences: { contains: charCallsign } },
          ] : []),
        ],
      },
      select: { id: true, name: true, date: true },
    }),
    prisma.document.findMany({
      where: {
        OR: [
          { content: { contains: charName } },
          { title: { contains: charName } },
          ...(charCallsign ? [
            { content: { contains: charCallsign } },
            { title: { contains: charCallsign } },
          ] : []),
        ],
      },
      select: { id: true, title: true, type: true },
    }),
    prisma.organization.findMany({
      where: {
        OR: [
          { description: { contains: charName } },
          { goals: { contains: charName } },
          { hierarchy: { contains: charName } },
          ...(charCallsign ? [
            { description: { contains: charCallsign } },
            { goals: { contains: charCallsign } },
            { hierarchy: { contains: charCallsign } },
          ] : []),
        ],
      },
      select: { id: true, name: true },
    }),
    prisma.location.findMany({
      where: {
        OR: [
          { description: { contains: charName } },
          ...(charCallsign ? [
            { description: { contains: charCallsign } },
          ] : []),
        ],
      },
      select: { id: true, name: true },
    }),
    prisma.factionView.findMany({
      where: {
        OR: [
          { content: { contains: charName } },
          ...(charCallsign ? [
            { content: { contains: charCallsign } },
          ] : []),
        ],
        characterId: null,
      },
      include: { faction: true },
    }),
  ]);

  const linkedEventIds = new Set(character.characterEvents.map(ce => ce.event.id));
  const linkedDocIds = new Set(character.characterDocuments.map(cd => cd.document.id));

  const autoEvents = mentionedInEvents.filter(e => !linkedEventIds.has(e.id));
  const autoDocs = mentionedInDocuments.filter(d => !linkedDocIds.has(d.id));

  const hasMentions = autoEvents.length > 0 || autoDocs.length > 0 || mentionedInOrgs.length > 0 || mentionedInLocations.length > 0 || mentionedInFactionViews.length > 0;

  let quotes: string[] = [];
  try {
    quotes = character.quotes ? JSON.parse(character.quotes) : [];
  } catch {
    quotes = [];
  }

  const allRelationships = [
    ...character.relationshipsA.map((r) => ({
      ...r,
      otherCharacter: r.characterB,
    })),
    ...character.relationshipsB.map((r) => ({
      ...r,
      otherCharacter: r.characterA,
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/characters"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← ПЕРСОНАЖИ
        </Link>
      </div>

      <CharacterProfileCard
        character={character}
        factionViews={character.factionViews}
        quotes={quotes}
      />

      {hasMentions && (
        <div className="border border-amber-400/20 bg-amber-400/5 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-amber-400 tracking-widest mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            АВТОМАТИЧЕСКИЕ УПОМИНАНИЯ
          </h2>
          <p className="font-mono text-[10px] text-gray-500 mb-4">
            Субъект упоминается в следующих записях архива
          </p>

          <div className="flex flex-wrap gap-2">
            {autoEvents.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-400/10 text-blue-400 rounded-full font-mono text-[11px] hover:bg-blue-400/20 transition-colors"
              >
                <span className="text-[9px] opacity-60">СОБЫТИЕ</span>
                {e.name}
              </Link>
            ))}
            {autoDocs.map((d) => (
              <Link
                key={d.id}
                href={`/documents/${d.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-400/10 text-purple-400 rounded-full font-mono text-[11px] hover:bg-purple-400/20 transition-colors"
              >
                <span className="text-[9px] opacity-60">ДОКУМЕНТ</span>
                {d.title}
              </Link>
            ))}
            {mentionedInOrgs.map((o) => (
              <Link
                key={o.id}
                href={`/organizations/${o.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400/10 text-emerald-400 rounded-full font-mono text-[11px] hover:bg-emerald-400/20 transition-colors"
              >
                <span className="text-[9px] opacity-60">ОРГАНИЗАЦИЯ</span>
                {o.name}
              </Link>
            ))}
            {mentionedInLocations.map((l) => (
              <Link
                key={l.id}
                href={`/map/${l.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400/10 text-cyan-400 rounded-full font-mono text-[11px] hover:bg-cyan-400/20 transition-colors"
              >
                <span className="text-[9px] opacity-60">ЛОКАЦИЯ</span>
                {l.name}
              </Link>
            ))}
            {mentionedInFactionViews.map((fv) => (
              <span
                key={fv.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-400/10 text-red-400 rounded-full font-mono text-[11px]"
              >
                <span className="text-[9px] opacity-60">ВЗГЛЯД ФРАКЦИИ</span>
                {fv.faction.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {character.notes.length > 0 && (
        <div className="border border-amber-400/20 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-amber-400/80 tracking-widest mb-4">
            ЗАМЕТКИ ({character.notes.length})
          </h2>
          <div className="space-y-3">
            {character.notes.map((note) => (
              <div key={note.id} className="border border-gray-800 rounded p-3">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-gray-600">
                  {note.author && <span>— {note.author}</span>}
                  <span>{new Date(note.createdAt).toLocaleString("ru-RU")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {allRelationships.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            СВЯЗИ
          </h2>
          <div className="space-y-4">
            {allRelationships.map((rel) => (
              <div key={rel.id} className="border border-gray-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/characters/${rel.otherCharacter.id}`}
                    className="font-mono text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    {rel.otherCharacter.name}
                  </Link>
                  <span className="font-mono text-xs text-gray-500">
                    {rel.type} // Доверие: {rel.trustLevel}%
                  </span>
                </div>
                {rel.description && (
                  <p className="text-xs text-gray-500 mb-2">{rel.description}</p>
                )}
                {rel.history.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {rel.history.map((h) => (
                      <span
                        key={h.id}
                        className="inline-block px-2 py-1 bg-gray-900 rounded text-[10px] font-mono text-gray-400"
                        title={h.description ?? undefined}
                      >
                        {h.year}: {h.status}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/relationships/${rel.id}`}
                  className="font-mono text-[10px] text-gray-600 hover:text-gray-400 mt-2 inline-block"
                >
                  ПОДРОБНЕЕ →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {character.characterEvents.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            СВЯЗАННЫЕ СОБЫТИЯ
          </h2>
          <div className="space-y-2">
            {character.characterEvents.map(({ event }) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 transition-colors group"
              >
                <span className="font-mono text-sm text-gray-300 group-hover:text-emerald-400">
                  {event.name}
                </span>
                <span className="font-mono text-xs text-gray-600">
                  {event.date ?? "██████"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {character.characterDocuments.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            УПОМИНАНИЯ В ДОКУМЕНТАХ
          </h2>
          <div className="space-y-2">
            {character.characterDocuments.map(({ document: doc }) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-900 transition-colors group"
              >
                <span className="font-mono text-sm text-gray-300 group-hover:text-emerald-400">
                  {doc.title}
                </span>
                <span className="font-mono text-xs text-gray-600 uppercase">
                  {doc.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
