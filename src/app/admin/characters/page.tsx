import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminCharactersPage() {
  const characters = await prisma.character.findMany({
    include: {
      faction: { select: { name: true } },
      organization: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">← ПАНЕЛЬ УПРАВЛЕНИЯ</Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ПЕРСОНАЖИ</h1>
        </div>
        <Link
          href="/admin/characters/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={characters.map((c) => ({
          id: c.id,
          title: c.name,
          subtitle:
            [
              c.isSecondary ? "второстепенный" : null,
              c.faction?.name,
              c.organization?.name,
            ]
              .filter(Boolean)
              .join(" · ") || "Без привязки",
          status: c.status,
          editHref: `/admin/characters/${c.id}`,
          viewHref: `/characters/${c.id}`,
        }))}
      />
    </div>
  );
}
