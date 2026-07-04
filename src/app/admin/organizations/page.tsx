import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminOrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">← ПАНЕЛЬ УПРАВЛЕНИЯ</Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ОРГАНИЗАЦИИ</h1>
        </div>
        <Link
          href="/admin/organizations/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={organizations.map((o) => ({
          id: o.id,
          title: o.name,
          subtitle: o.foundedDate ?? "Дата основания неизвестна",
          editHref: `/admin/organizations/${o.id}`,
          viewHref: `/organizations/${o.id}`,
        }))}
      />
    </div>
  );
}
