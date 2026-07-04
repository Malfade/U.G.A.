import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [document, factions, factionViews] = await Promise.all([
    prisma.document.findUnique({ where: { id } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "document", entityId: id },
      include: { faction: true },
    }),
  ]);
  if (!document) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/documents" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ДОКУМЕНТЫ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {document.title}
        </h1>
      </div>
      <DocumentForm document={document} />
      <FactionViewsEditor
        entityType="document"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
    </div>
  );
}
