import { prisma } from "@/lib/db";
import { FactionSelector } from "@/components/entities/FactionSelector";

export default async function FactionsPage() {
  const factions = await prisma.faction.findMany({
    include: {
      _count: { select: { characters: true, factionViews: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ПРОСМОТР МИРА
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Выберите фракцию, чтобы увидеть мир её глазами
        </p>
      </div>

      <FactionSelector
        factions={factions.map((f) => ({
          id: f.id,
          name: f.name,
          description: f.description,
          foundedDate: f.foundedDate,
          characterCount: f._count.characters,
        }))}
      />
    </div>
  );
}
