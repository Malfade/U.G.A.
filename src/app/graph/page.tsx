import { prisma } from "@/lib/db";
import { GraphExplorer } from "@/components/graph/GraphExplorer";

export default async function GraphPage() {
  const characters = await prisma.character.findMany({
    select: { id: true, name: true, status: true, faction: { select: { name: true } } },
  });

  const relationships = await prisma.relationship.findMany({
    select: {
      id: true,
      characterAId: true,
      characterBId: true,
      type: true,
      trustLevel: true,
    },
  });

  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
  });

  const events = await prisma.event.findMany({
    select: { id: true, name: true, date: true },
    take: 10,
    orderBy: { date: "desc" },
  });

  const nodes = [
    ...characters.map((c) => ({
      id: c.id,
      name: c.name,
      type: "character" as const,
      group: c.faction?.name ?? "Нет фракции",
    })),
    ...organizations.map((o) => ({
      id: `org-${o.id}`,
      name: o.name,
      type: "organization" as const,
      group: "Организация",
    })),
    ...events.map((e) => ({
      id: `event-${e.id}`,
      name: `${e.date ?? "?"}: ${e.name}`,
      type: "event" as const,
      group: "Событие",
    })),
  ];

  const links = relationships.map((r) => ({
    source: r.characterAId,
    target: r.characterBId,
    type: r.type,
    trustLevel: r.trustLevel,
    id: r.id,
  }));

  return (
    <div className="animate-fade-in h-full">
      <div className="mb-4">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ◬ СЕТЬ СВЯЗЕЙ
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Узлов: {nodes.length} // Связей: {links.length}
        </p>
      </div>
      <GraphExplorer nodes={nodes} links={links} />
    </div>
  );
}
