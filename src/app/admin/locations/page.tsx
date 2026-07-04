import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">← ПАНЕЛЬ УПРАВЛЕНИЯ</Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ЛОКАЦИИ</h1>
        </div>
        <Link
          href="/admin/locations/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={locations.map((l) => ({
          id: l.id,
          title: l.name,
          subtitle: l.type.toUpperCase(),
          editHref: `/admin/locations/${l.id}`,
          viewHref: `/locations/${l.id}`,
        }))}
      />
    </div>
  );
}
