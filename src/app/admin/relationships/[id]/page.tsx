import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RelationshipForm } from "@/components/admin/RelationshipForm";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";

export default async function EditRelationshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [relationship, characters, factions, factionViews] = await Promise.all([
    prisma.relationship.findUnique({
      where: { id },
      include: { history: { orderBy: { year: "asc" } } },
    }),
    prisma.character.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "relationship", entityId: id },
      include: { faction: true },
    }),
  ]);

  if (!relationship) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/relationships" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← СВЯЗИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">РЕДАКТИРОВАТЬ СВЯЗЬ</h1>
      </div>
      <RelationshipForm characters={characters} relationship={relationship} />
      <FactionViewsEditor
        entityType="relationship"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
    </div>
  );
}
