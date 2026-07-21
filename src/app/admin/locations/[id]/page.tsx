import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LocationForm } from "@/components/admin/LocationForm";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";
import { EntityFieldsEditor } from "@/components/admin/EntityFieldsEditor";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [location, factions, factionViews, fields] = await Promise.all([
    prisma.location.findUnique({ where: { id } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "location", entityId: id },
      include: { faction: true },
    }),
    prisma.entityField.findMany({
      where: { entityType: "location", entityId: id },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  if (!location) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/locations" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ЛОКАЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {location.name}
        </h1>
      </div>
      <LocationForm location={location} />
      <EntityFieldsEditor entityType="location" entityId={id} fields={fields} />
      <FactionViewsEditor
        entityType="location"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
    </div>
  );
}
