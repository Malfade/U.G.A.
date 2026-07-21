import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DialogueForm } from "@/components/admin/DialogueForm";

export default async function EditDialoguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dialogue, characters, locations, factions] = await Promise.all([
    prisma.dialogue.findUnique({
      where: { id },
      include: { lines: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.character.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.faction.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!dialogue) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/dialogues" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ДИАЛОГИ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {dialogue.title || "Без названия"}
        </h1>
      </div>
      <DialogueForm
        characters={characters}
        locations={locations}
        factions={factions}
        dialogue={dialogue}
      />
    </div>
  );
}
