import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DialoguesPage() {
  const dialogues = await prisma.dialogue.findMany({
    include: {
      location: { select: { name: true } },
      aboutCharacter: { select: { name: true } },
      _count: { select: { lines: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="font-mono text-xl text-gray-200 tracking-wider mb-6">ДИАЛОГИ</h1>
      <div className="space-y-2">
        {dialogues.map((d) => (
          <Link
            key={d.id}
            href={`/dialogues/${d.id}`}
            className="block border border-gray-800 rounded-lg px-4 py-3 hover:bg-gray-900/50 transition-colors"
          >
            <div className="font-mono text-sm text-gray-200">
              {d.title || "Без названия"}
            </div>
            <div className="font-mono text-[10px] text-gray-600 mt-1">
              {d.kind} · {d._count.lines} реплик · L{d.accessLevel}
              {d.location && ` · ${d.location.name}`}
              {d.aboutCharacter && ` · о ${d.aboutCharacter.name}`}
            </div>
          </Link>
        ))}
        {dialogues.length === 0 && (
          <p className="font-mono text-xs text-gray-600 text-center py-8">Нет записей</p>
        )}
      </div>
    </div>
  );
}
