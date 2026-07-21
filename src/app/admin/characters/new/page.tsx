import { prisma } from "@/lib/db";
import Link from "next/link";
import { CharacterForm } from "@/components/admin/CharacterForm";

export default async function NewCharacterPage() {
  const [factions, organizations] = await Promise.all([
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/characters" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ПЕРСОНАЖИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          СОЗДАТЬ ПЕРСОНАЖА
        </h1>
      </div>
      <CharacterForm factions={factions} organizations={organizations} />
    </div>
  );
}
