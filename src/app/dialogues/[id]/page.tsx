import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DialogueCard } from "@/components/entities/DialogueCard";

export default async function DialoguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dialogue = await prisma.dialogue.findUnique({
    where: { id },
    include: {
      location: { select: { id: true, name: true } },
      aboutCharacter: { select: { id: true, name: true } },
      aboutLocation: { select: { id: true, name: true } },
      faction: { select: { id: true, name: true } },
      lines: {
        orderBy: { sortOrder: "asc" },
        include: { speaker: { select: { id: true, name: true } } },
      },
      unlocks: true,
    },
  });
  if (!dialogue) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          href="/dialogues"
          className="font-mono text-xs text-gray-600 hover:text-gray-400"
        >
          ← ДИАЛОГИ
        </Link>
      </div>
      <DialogueCard dialogue={dialogue} />
    </div>
  );
}
