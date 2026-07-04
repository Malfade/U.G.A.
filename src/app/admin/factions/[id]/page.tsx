import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FactionForm } from "@/components/admin/FactionForm";

export default async function EditFactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faction = await prisma.faction.findUnique({ where: { id } });
  if (!faction) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/factions" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ФРАКЦИИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {faction.name}
        </h1>
      </div>
      <FactionForm faction={faction} />
    </div>
  );
}
