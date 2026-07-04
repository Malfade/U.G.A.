import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrganizationForm } from "@/components/admin/OrganizationForm";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [organization, factions, factionViews] = await Promise.all([
    prisma.organization.findUnique({ where: { id } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "organization", entityId: id },
      include: { faction: true },
    }),
  ]);
  if (!organization) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/organizations" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ОРГАНИЗАЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {organization.name}
        </h1>
      </div>
      <OrganizationForm organization={organization} />
      <FactionViewsEditor
        entityType="organization"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
    </div>
  );
}
