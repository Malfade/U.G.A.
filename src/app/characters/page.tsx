import { prisma } from "@/lib/db";
import Link from "next/link";
import { RedactedText } from "@/components/ui/RedactedText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AccessLevel } from "@/components/ui/AccessLevel";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    where: { isSecondary: false },
    include: { faction: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider">
            ◉ ПЕРСОНАЖИ
          </h1>
          <p className="font-mono text-xs text-gray-600 mt-1">
            Записей в базе: {characters.length}
          </p>
        </div>
      </div>

      <div className="archive-grid">
        {characters.map((char) => (
          <Link
            key={char.id}
            href={`/characters/${char.id}`}
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-900/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-mono text-sm text-gray-200 group-hover:text-emerald-400 transition-colors">
                {char.name}
              </h2>
              <StatusBadge status={char.status} />
            </div>
            {char.callsign && (
              <div className="font-mono text-xs text-gray-500 mb-2">
                Позывной: {char.callsign}
              </div>
            )}
            <div className="font-mono text-xs text-gray-600 mb-2">
              <RedactedText value={char.description} className="line-clamp-2" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-[10px] text-gray-600">
                {char.faction?.name ?? "Нет фракции"}
              </span>
              <AccessLevel level={char.accessLevel} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
