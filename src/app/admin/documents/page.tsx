import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">← ПАНЕЛЬ УПРАВЛЕНИЯ</Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ДОКУМЕНТЫ</h1>
        </div>
        <Link
          href="/admin/documents/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={documents.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.type.toUpperCase(),
          editHref: `/admin/documents/${d.id}`,
          viewHref: `/documents/${d.id}`,
        }))}
      />
    </div>
  );
}
