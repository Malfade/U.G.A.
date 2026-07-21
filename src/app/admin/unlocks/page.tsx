import { prisma } from "@/lib/db";
import Link from "next/link";
import { AdminEntityList } from "@/components/admin/AdminEntityList";

export default async function AdminUnlocksPage() {
  const unlocks = await prisma.clearanceUnlock.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="font-mono text-xs text-gray-600 hover:text-gray-400">
            ← ПАНЕЛЬ УПРАВЛЕНИЯ
          </Link>
          <h1 className="font-mono text-xl text-gray-200 tracking-wider mt-2">
            ЗАШИФРОВАННЫЕ ФРАГМЕНТЫ
          </h1>
        </div>
        <Link
          href="/admin/unlocks/new"
          className="px-4 py-2 bg-emerald-400/10 text-emerald-400 rounded font-mono text-xs hover:bg-emerald-400/20"
        >
          + СОЗДАТЬ
        </Link>
      </div>
      <AdminEntityList
        items={unlocks.map((u) => ({
          id: u.id,
          title: u.title,
          subtitle: `→ L${u.grantsLevel} · код ${u.rewardCode}`,
          editHref: `/admin/unlocks/${u.id}`,
          viewHref: u.dialogueId
            ? `/dialogues/${u.dialogueId}`
            : u.documentId
              ? `/documents/${u.documentId}`
              : "/admin/unlocks",
        }))}
      />
    </div>
  );
}
