import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminRelationshipsPage() {
  const relationships = await prisma.relationship.findMany({
    include: {
      characterA: { select: { name: true } },
      characterB: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">
            ← ПАНЕЛЬ УПРАВЛЕНИЯ
          </Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">СВЯЗИ</h1>
        </div>
        <Link
          href="/admin/relationships/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={relationships.map((r) => ({
          id: r.id,
          title: `${r.characterA.name} ↔ ${r.characterB.name}`,
          subtitle: `${r.type} · доверие ${r.trustLevel}%`,
          editHref: `/admin/relationships/${r.id}`,
          viewHref: `/relationships/${r.id}`,
        }))}
      />
    </div>
  );
}
