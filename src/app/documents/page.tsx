import { prisma } from "@/lib/db";
import Link from "next/link";
import { AccessLevel } from "@/components/ui/AccessLevel";

const TYPE_ICONS: Record<string, string> = {
  report: "📄",
  transcript: "📝",
  audio: "🎙",
  video: "📹",
  photo: "📷",
  letter: "✉",
};

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { argLocks: true },
  });

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-mono text-xl text-gray-200 tracking-wider">
          ▤ ДОКУМЕНТЫ
        </h1>
        <p className="font-mono text-xs text-gray-600 mt-1">
          Записей: {documents.length}
        </p>
      </div>

      <div className="archive-grid">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className="border border-gray-800 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-900/50 transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{TYPE_ICONS[doc.type] ?? "📄"}</span>
              <h2 className="font-mono text-sm text-gray-200 group-hover:text-emerald-400 transition-colors">
                {doc.title}
              </h2>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[10px] text-gray-600 uppercase">
                {doc.type}
              </span>
              {doc.damagePercent > 0 && (
                <span className="font-mono text-[10px] text-yellow-400">
                  Повреждён: {doc.damagePercent}%
                </span>
              )}
              {doc.argLocks.length > 0 && (
                <span className="font-mono text-[10px] text-red-400">
                  🔒 ЗАБЛОКИРОВАН
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-3">
              <AccessLevel level={doc.accessLevel} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
