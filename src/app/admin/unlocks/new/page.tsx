import { prisma } from "@/lib/db";
import Link from "next/link";
import { UnlockForm } from "@/components/admin/UnlockForm";

export default async function NewUnlockPage() {
  const [dialogues, documents] = await Promise.all([
    prisma.dialogue.findMany({
      select: { id: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.document.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/unlocks" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ФРАГМЕНТЫ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">НОВЫЙ ФРАГМЕНТ</h1>
      </div>
      <UnlockForm
        dialogues={dialogues.map((d) => ({ id: d.id, name: d.title || d.id }))}
        documents={documents.map((d) => ({ id: d.id, name: d.title }))}
      />
    </div>
  );
}
