"use client";

import { redactDamaged } from "@/lib/redact";

export function DamagedDocument({
  content,
  damagePercent,
}: {
  content: string;
  damagePercent: number;
}) {
  const displayContent =
    damagePercent > 0 ? redactDamaged(content, damagePercent) : content;

  return (
    <div className={`relative ${damagePercent > 0 ? "document-damaged" : ""}`}>
      {damagePercent > 0 && (
        <div className="mb-3 px-3 py-1.5 bg-yellow-900/20 border border-yellow-800/30 rounded text-xs font-mono text-yellow-400">
          ⚠ Файл повреждён. Восстановлено: {100 - damagePercent}%
        </div>
      )}
      <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed bg-gray-950/50 rounded p-4 border border-gray-800">
        {displayContent}
      </pre>
    </div>
  );
}
