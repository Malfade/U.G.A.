import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UnlockForm } from "@/components/admin/UnlockForm";

export default async function EditUnlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [unlock, dialogues, documents] = await Promise.all([
    prisma.clearanceUnlock.findUnique({ where: { id } }),
    prisma.dialogue.findMany({
      select: { id: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.document.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);
  if (!unlock) notFound();

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/admin/unlocks" className="font-mono text-xs text-gray-600 hover:text-gray-400">
          ← ФРАГМЕНТЫ
        </Link>
        <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
          РЕДАКТИРОВАТЬ: {unlock.title}
        </h1>
      </div>
      <UnlockForm
        unlock={unlock}
        dialogues={dialogues.map((d) => ({ id: d.id, name: d.title || d.id }))}
        documents={documents.map((d) => ({ id: d.id, name: d.title }))}
      />
    </div>
  );
}
