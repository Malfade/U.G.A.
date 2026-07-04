import { prisma } from "@/lib/db";
import { WorldMap } from "@/components/map/WorldMap";

export default async function MapPage() {
  const locations = await prisma.location.findMany({
    include: {
      events: { include: { event: { select: { id: true, name: true, date: true } } } },
    },
  });

  const mapData = locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    type: loc.type,
    coordX: loc.coordX ?? 0,
    coordY: loc.coordY ?? 0,
    population: loc.population,
    description: loc.description,
    accessLevel: loc.accessLevel,
    events: loc.events.map((e) => ({
      id: e.event.id,
      name: e.event.name,
      date: e.event.date,
    })),
  }));

  return (
    <div className="animate-fade-in h-full">
      <div className="mb-4">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ◎ КАРТА МИРА
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Объектов на карте: {locations.length}
        </p>
      </div>
      <WorldMap locations={mapData} />
    </div>
  );
}
