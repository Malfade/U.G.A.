import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { OrganizationProfileCard } from "@/components/entities/OrganizationProfileCard";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id },
    include: { factionViews: { include: { faction: true } } },
  });

  if (!org) notFound();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/organizations"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← ОРГАНИЗАЦИИ
        </Link>
      </div>

      <OrganizationProfileCard org={org} factionViews={org.factionViews} />
    </div>
  );
}
