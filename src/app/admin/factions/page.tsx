import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminFactionsPage() {
  const factions = await prisma.faction.findMany({
    include: { _count: { select: { characters: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">
            ← ПАНЕЛЬ УПРАВЛЕНИЯ
          </Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ФРАКЦИИ</h1>
        </div>
        <Link
          href="/admin/factions/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={factions.map((f) => ({
          id: f.id,
          title: f.name,
          subtitle: `Участников: ${f._count.characters}`,
          editHref: `/admin/factions/${f.id}`,
          viewHref: `/factions/${f.id}`,
        }))}
      />
    </div>
  );
}
