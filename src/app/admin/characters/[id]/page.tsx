import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CharacterForm } from "@/components/admin/CharacterForm";
import { NotesList } from "@/components/admin/NotesList";
import { FactionViewsEditor } from "@/components/admin/FactionViewsEditor";

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [character, factions, factionViews] = await Promise.all([
    prisma.character.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: "desc" } } },
    }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.factionView.findMany({
      where: { entityType: "character", entityId: id },
      include: { faction: true },
    }),
  ]);
  if (!character) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/characters" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ПЕРСОНАЖИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {character.name}
        </h1>
      </div>
      <CharacterForm factions={factions} character={character} />
      <FactionViewsEditor
        entityType="character"
        entityId={id}
        views={factionViews}
        factions={factions}
      />
      <NotesList characterId={character.id} notes={character.notes} />
    </div>
  );
}
