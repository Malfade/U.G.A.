import { prisma } from "@/lib/db";
import Link from "next/link";

const SECTIONS = [
  { href: "/admin/characters", label: "ПЕРСОНАЖИ", icon: "◉", entity: "character" },
  { href: "/admin/events", label: "СОБЫТИЯ", icon: "◫", entity: "event" },
  { href: "/admin/documents", label: "ДОКУМЕНТЫ", icon: "▤", entity: "document" },
  { href: "/admin/organizations", label: "ОРГАНИЗАЦИИ", icon: "⬡", entity: "organization" },
  { href: "/admin/locations", label: "ЛОКАЦИИ", icon: "◎", entity: "location" },
  { href: "/admin/factions", label: "ФРАКЦИИ", icon: "◆", entity: "faction" },
  { href: "/admin/relationships", label: "СВЯЗИ", icon: "⟷", entity: "relationship" },
  { href: "/admin/dialogues", label: "ДИАЛОГИ", icon: "◈", entity: "dialogue" },
  { href: "/admin/unlocks", label: "ФРАГМЕНТЫ", icon: "▣", entity: "unlock" },
];

export default async function AdminPage() {
  const [
    chars,
    events,
    docs,
    orgs,
    locs,
    factions,
    relationships,
    characterEvents,
    eventLocations,
    characterDocuments,
    eventDocuments,
    charsWithOrg,
    dialoguesWithLinks,
    entityLinks,
    dialogues,
    unlocks,
  ] = await Promise.all([
    prisma.character.count(),
    prisma.event.count(),
    prisma.document.count(),
    prisma.organization.count(),
    prisma.location.count(),
    prisma.faction.count(),
    prisma.relationship.count(),
    prisma.characterEvent.count(),
    prisma.eventLocation.count(),
    prisma.characterDocument.count(),
    prisma.eventDocument.count(),
    prisma.character.count({ where: { organizationId: { not: null } } }),
    prisma.dialogue.count({
      where: {
        OR: [
          { locationId: { not: null } },
          { aboutCharacterId: { not: null } },
          { aboutLocationId: { not: null } },
        ],
      },
    }),
    prisma.entityLink.count(),
    prisma.dialogue.count(),
    prisma.clearanceUnlock.count(),
  ]);

  const linkTotal =
    relationships +
    characterEvents +
    eventLocations +
    characterDocuments +
    eventDocuments +
    charsWithOrg +
    dialoguesWithLinks +
    entityLinks;

  const counts: Record<string, number> = {
    character: chars,
    event: events,
    document: docs,
    organization: orgs,
    location: locs,
    faction: factions,
    relationship: linkTotal,
    dialogue: dialogues,
    unlock: unlocks,
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ⚙ ПАНЕЛЬ УПРАВЛЕНИЯ
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Управление контентом архива
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-900/50 transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg text-gray-600 group-hover:text-emerald-400">
                {s.icon}
              </span>
              <span className="font-mono text-xs text-gray-500 tracking-widest">
                {s.label}
              </span>
            </div>
            <div className="font-mono text-2xl text-gray-300 group-hover:text-emerald-400">
              {counts[s.entity] ?? 0}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
