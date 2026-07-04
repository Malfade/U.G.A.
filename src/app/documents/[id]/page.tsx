import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";
import { FactionAwareDocument } from "@/components/entities/FactionAwareDocument";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      characterDocuments: { include: { character: { select: { id: true, name: true } } } },
      eventDocuments: { include: { event: { select: { id: true, name: true } } } },
      argLocks: true,
      factionViews: { include: { faction: true } },
    },
  });

  if (!doc) notFound();

  const isLocked = doc.argLocks.length > 0;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/documents"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← ДОКУМЕНТЫ
        </Link>
      </div>

      <div className="border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-mono text-xl text-gray-100 mb-1">
              {doc.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-500 uppercase">
                {doc.type}
              </span>
              {doc.damagePercent > 0 && (
                <span className="font-mono text-xs text-yellow-400">
                  Восстановлено: {100 - doc.damagePercent}%
                </span>
              )}
            </div>
          </div>
          <AccessLevel level={doc.accessLevel} />
        </div>

        <FactionAwareDocument
          content={doc.content ?? ""}
          damagePercent={doc.damagePercent}
          isLocked={isLocked}
          locks={doc.argLocks}
          factionViews={doc.factionViews}
        />
      </div>

      {doc.characterDocuments.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            УПОМЯНУТЫЕ ЛИЦА
          </h2>
          <div className="flex gap-2 flex-wrap">
            {doc.characterDocuments.map(({ character }) => (
              <Link
                key={character.id}
                href={`/characters/${character.id}`}
                className="px-3 py-1.5 bg-gray-900 rounded text-sm font-mono text-emerald-400 hover:bg-gray-800 transition-colors"
              >
                {character.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {doc.eventDocuments.length > 0 && (
        <div className="border border-gray-800 rounded-lg p-6">
          <h2 className="font-mono text-xs text-gray-500 tracking-widest mb-4">
            СВЯЗАННЫЕ СОБЫТИЯ
          </h2>
          <div className="space-y-2">
            {doc.eventDocuments.map(({ event }) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center py-2 px-3 rounded hover:bg-gray-900 transition-colors font-mono text-sm text-gray-300 hover:text-emerald-400"
              >
                {event.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
