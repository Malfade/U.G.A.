import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RelationshipProfileCard } from "@/components/entities/RelationshipProfileCard";

export default async function RelationshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rel = await prisma.relationship.findUnique({
    where: { id },
    include: {
      characterA: { select: { id: true, name: true } },
      characterB: { select: { id: true, name: true } },
      history: { orderBy: { year: "asc" } },
      factionViews: { include: { faction: true } },
    },
  });

  if (!rel) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/graph"
          className="font-mono text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← СЕТЬ СВЯЗЕЙ
        </Link>
      </div>

      <RelationshipProfileCard rel={rel} factionViews={rel.factionViews} />
    </div>
  );
}
