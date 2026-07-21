import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminDialoguesPage() {
  const dialogues = await prisma.dialogue.findMany({
    include: { _count: { select: { lines: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">
            ← ПАНЕЛЬ УПРАВЛЕНИЯ
          </Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">ДИАЛОГИ</h1>
        </div>
        <Link
          href="/admin/dialogues/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20"
        >
          + СОЗДАТЬ
        </Link>
      </div>
      <AdminEntityList
        items={dialogues.map((d) => ({
          id: d.id,
          title: d.title || "Без названия",
          subtitle: `${d.kind} · ${d._count.lines} реплик · L${d.accessLevel}`,
          editHref: `/admin/dialogues/${d.id}`,
          viewHref: `/dialogues/${d.id}`,
        }))}
      />
    </div>
  );
}
