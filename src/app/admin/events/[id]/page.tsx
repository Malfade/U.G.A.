import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, factions, factionViews] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "event", entityId: id },
      include: { faction: true },
    }),
  ]);
  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/events" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← СОБЫТИЯ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {event.name}
        </h1>
      </div>
      <EventForm event={event} />
      <FactionViewsEditor
        entityType="event"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
    </div>
  );
}
