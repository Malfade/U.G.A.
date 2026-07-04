import { prisma } from "@/lib/db";
import Link from "next/link";
import { RelationshipForm } from "@/components/admin/RelationshipForm";

export default async function NewRelationshipPage() {
  const characters = await prisma.character.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/relationships" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← СВЯЗИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">НОВАЯ СВЯЗЬ</h1>
      </div>
      <RelationshipForm characters={characters} />
    </div>
  );
}
