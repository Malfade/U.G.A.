import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">← ПАНЕЛЬ УПРАВЛЕНИЯ</Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">СОБЫТИЯ</h1>
        </div>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20 transition-colors"
        >
          + СОЗДАТЬ
        </Link>
      </div>

      <AdminEntityList
        items={events.map((e) => ({
          id: e.id,
          title: e.name,
          subtitle: e.date ?? "Дата неизвестна",
          editHref: `/admin/events/${e.id}`,
          viewHref: `/events/${e.id}`,
        }))}
      />
    </div>
  );
}
